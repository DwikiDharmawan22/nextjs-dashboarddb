// app/lib/data2.ts
import postgres from 'postgres';
import {
  Customer,
  Transaction,
  SaleProduct,
  Profile,
  ProductPelanggan,
  TeamMember,
  ShopProduct,
  Product1,
  reviewProduct,
  blogProduct,
  ChartData,
  AvailableProduct,
  Contact,
} from '@/app/lib/definitions2';

const sql = postgres({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: false },
});

// Existing functions (unchanged, included for completeness)
export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const data = await sql<Customer[]>`
      SELECT username, email, phone, transactions
      FROM customers
      ORDER BY username ASC
    `;
    return data.map((customer) => ({
      ...customer,
      transactions: Array.isArray(customer.transactions) ? customer.transactions : [],
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customers.');
  }
}

export async function saveCustomers(customers: Customer[]): Promise<void> {
  try {
    await sql.begin(async (sql) => {
      for (const customer of customers) {
        await sql`
          INSERT INTO customers (username, email, phone, transactions)
          VALUES (${customer.username}, ${customer.email}, ${customer.phone}, ${customer.transactions})
          ON CONFLICT (username) DO UPDATE
          SET email = EXCLUDED.email,
              phone = EXCLUDED.phone,
              transactions = EXCLUDED.transactions
        `;
      }
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to save customers.');
  }
}

export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const data = await sql<Transaction[]>`
      SELECT id, date, totalPrice, username, product
      FROM transactions
      ORDER BY date DESC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch transactions.');
  }
}

export async function saveTransaction(newTransaction: Transaction): Promise<void> {
  try {
    await sql`
      INSERT INTO transactions (id, date, totalPrice, username, product)
      VALUES (${newTransaction.id}, ${newTransaction.date}, ${newTransaction.totalprice}, ${newTransaction.username}, ${newTransaction.product})
      ON CONFLICT (id) DO UPDATE
      SET date = EXCLUDED.date,
          totalPrice = EXCLUDED.totalPrice,
          username = EXCLUDED.username,
          product = EXCLUDED.product
    `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to save transaction.');
  }
}

export async function fetchProducts(): Promise<SaleProduct[]> {
  try {
    const data = await sql<SaleProduct[]>`
      SELECT id, image, name, price
      FROM products
      ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function saveProducts(products: SaleProduct[]): Promise<void> {
  try {
    await sql.begin(async (sql) => {
      for (const product of products) {
        await sql`
          INSERT INTO products (id, image, name, price)
          VALUES (${product.id}, ${product.image}, ${product.name}, ${product.price})
          ON CONFLICT (id) DO UPDATE
          SET image = EXCLUDED.image,
              name = EXCLUDED.name,
              price = EXCLUDED.price
        `;
      }
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to save products.');
  }
}

export async function fetchAvailableProducts(): Promise<AvailableProduct[]> {
  try {
    const data = await sql<AvailableProduct[]>`
      SELECT name, price
      FROM available_products
      ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch available products.');
  }
}

export async function fetchDashboardData(
  setDailyIncomeData: (data: ChartData) => void,
  setMonthlyIncomeData: (data: ChartData) => void,
  setLoading: (loading: boolean) => void
): Promise<void> {
  try {
    const dailyData = await sql`
      SELECT TO_CHAR(day, 'Day') AS day, SUM(amount) AS total
      FROM daily_income
      GROUP BY day
      ORDER BY day
      LIMIT 5
    `;
    setDailyIncomeData({
      labels: dailyData.map((row) => row.day.trim()),
      datasets: [{
        label: "Pendapatan Harian",
        data: dailyData.map((row) => Number(row.total) || 0),
        backgroundColor: "#29CA2E",
        borderColor: "#29CA2E",
        borderWidth: 1,
      }],
    });

    const monthlyData = await sql`
      SELECT month, SUM(amount) AS total
      FROM monthly_income
      GROUP BY month
      ORDER BY month
      LIMIT 12
    `;
    setMonthlyIncomeData({
      labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"],
      datasets: [{
        label: "Pendapatan Bulanan",
        data: monthlyData.map((row) => Number(row.total) || 0),
        backgroundColor: "#E92020",
        borderColor: "#E92020",
        borderWidth: 1,
      }],
    });

    setLoading(false);
  } catch (error) {
    console.error('Database Error:', error);
    setLoading(false);
    throw new Error('Failed to fetch dashboard data.');
  }
}

export async function fetchProfile(): Promise<Profile> {
  try {
    const data = await sql<Profile[]>`
      SELECT name, role, email, phone, facebook
      FROM profile
      LIMIT 1
    `;
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch profile data.');
  }
}

export async function fetchPelangganProducts(): Promise<ProductPelanggan[]> {
  try {
    const data = await sql<ProductPelanggan[]>`
      SELECT name, imageSrc, width, height, altText, link
      FROM pelanggan_products
      ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch pelanggan products.');
  }
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  try {
    const data = await sql<TeamMember[]>`
      SELECT image, name, description
      FROM team_members
      ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch team members.');
  }
}

export async function fetchShopProducts(): Promise<ShopProduct[]> {
  try {
    const data = await sql<ShopProduct[]>`
      SELECT image, name, width, height, link
      FROM shop_products
      ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch shop products.');
  }
}

export async function fetchProductById(id: string): Promise<Product1> {
  try {
    const data = await sql<Product1[]>`
      SELECT id, image, name, description, materials, price, rating, navigation
      FROM product_details
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!data[0]) {
      throw new Error('Product not found');
    }
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product details.');
  }
}

export async function fetchReviewProducts(): Promise<reviewProduct[]> {
  try {
    const data = await sql<reviewProduct[]>`
      SELECT image, name, width, height, rating, description
      FROM review_products
      ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch review products.');
  }
}

export async function fetchBlogProducts(): Promise<blogProduct[]> {
  try {
    const data = await sql<blogProduct[]>`
      SELECT image, name, postDate, description
      FROM blog_products
      ORDER BY postDate DESC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch blog products.');
  }
}

// Updated fetchCardData to include totalOutcome
// In data2.ts, if no expenses table
export async function fetchCardData(): Promise<{
  numberOfCustomers: number;
  numberOfTransactions: number;
  totalRevenue: number;
  totalOutcome: number;
}> {
  try {
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const transactionCountPromise = sql`SELECT COUNT(*) FROM transactions`;
    const totalRevenuePromise = sql`SELECT SUM(totalPrice) AS total FROM transactions`;

    const data = await Promise.all([
      customerCountPromise,
      transactionCountPromise,
      totalRevenuePromise,
    ]);

    const numberOfCustomers = Number(data[0][0].count ?? '0');
    const numberOfTransactions = Number(data[1][0].count ?? '0');
    const totalRevenue = Number(data[2][0].total ?? '0');

    return {
      numberOfCustomers,
      numberOfTransactions,
      totalRevenue,
      totalOutcome: 0, // No expenses table
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

// New function: Fetch top product ordered today
export async function fetchTopProductToday(): Promise<string> {
  try {
    const data = await sql`
      SELECT product
      FROM transactions
      WHERE DATE(date) = CURRENT_DATE
      GROUP BY product
      ORDER BY COUNT(*) DESC
      LIMIT 1
    `;
    return data[0]?.product || 'Tidak ada produk';
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch top product.');
  }
}

// New function: Fetch customer with most transactions this month
export async function fetchTopCustomerThisMonth(): Promise<string> {
  try {
    const data = await sql`
      SELECT username
      FROM transactions
      WHERE EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY username
      ORDER BY COUNT(*) DESC
      LIMIT 1
    `;
    return data[0]?.username || 'Tidak ada pelanggan';
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch top customer.');
  }
}

export async function fetchFilteredCustomers(query: string): Promise<Customer[]> {
  try {
    const data = await sql<Customer[]>`
      SELECT username, email, phone, transactions
      FROM customers
      WHERE
        username ILIKE ${`%${query}%`} OR
        email ILIKE ${`%${query}%`} OR
        phone ILIKE ${`%${query}%`}
      ORDER BY username ASC
    `;
    return data.map((customer) => ({
      ...customer,
      transactions: Array.isArray(customer.transactions) ? customer.transactions : [],
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch filtered customers.');
  }
}

export const contactData: Contact = {
  location: 'Jalan Kebenaran dan Hidup\nNo. 77, Sleman Concat\nBabarsari Depok',
  phone: '0821-2881-1829',
  website: 'www.uajy.ac.id',
};

export async function getContactData(): Promise<Contact> {
  return contactData;
}

// export const VALID_EMAIL = 'user123';
// export const VALID_PASSWORD = '12345';
// export const ADMIN_EMAIL = 'admin123';
// export const ADMIN_PASSWORD = '12345';

export const generateRandomCaptcha = (): string => {
  if (typeof window === 'undefined') return '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
};

export const generateCaptcha = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
};

// export const calculatePasswordStrength = (
//   password: string,
//   setPasswordStrength: (strength: number) => void
// ) => {
//   let strength = 0;
//   if (password.length >= 8) strength += 20;
//   if (/[A-Z]/.test(password)) strength += 20;
//   if (/[a-z]/.test(password)) strength += 20;
//   if (/[0-9]/.test(password)) strength += 20;
//   if (/[^A-Za-z0-9]/.test(password)) strength += 20;
//   setPasswordStrength(Math.min(strength, 100));
// };