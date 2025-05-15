import postgres from 'postgres';
import {
  Customer,
  Transaction,
  SaleProduct,
  ShopProduct,
  TeamMember,
  reviewProduct,
  blogProduct,
  Contact,
  ChartData,
  ProductPelanggan,
  Product1,
  Profile,
  AvailableProduct,
} from '@/app/lib/definitions2';
import { formatCurrency } from './utils';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Customers
export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const data = await sql<Customer[]>`
      SELECT * FROM customers
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

export async function fetchCustomerById(id: string): Promise<Customer | null> {
  try {
    const data = await sql<Customer[]>`
      SELECT * FROM customers
      WHERE id = ${id}
    `;
    if (data.length === 0) return null;
    return {
      ...data[0],
      transactions: Array.isArray(data[0].transactions) ? data[0].transactions : [],
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer.');
  }
}

export async function saveCustomer(customer: Customer): Promise<void> {
  try {
    if (customer.id) {
      await sql`
        UPDATE customers
        SET username = ${customer.username},
            email = ${customer.email},
            phone = ${customer.phone},
            transactions = ${customer.transactions}
        WHERE id = ${customer.id}
      `;
    } else {
      await sql`
        INSERT INTO customers (username, email, phone, transactions)
        VALUES (${customer.username}, ${customer.email}, ${customer.phone}, ${customer.transactions})
      `;
    }
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to save customer.');
  }
}

// Transactions
export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const data = await sql<Transaction[]>`
      SELECT * FROM transactions
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
      INSERT INTO transactions (id, date, total_price, username, product)
      VALUES (${newTransaction.id}, ${newTransaction.date}, ${newTransaction.totalPrice}, ${newTransaction.username}, ${newTransaction.product})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to save transaction.');
  }
}

// Products
export async function fetchProducts(): Promise<SaleProduct[]> {
  try {
    const data = await sql<SaleProduct[]>`
      SELECT * FROM products
      ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch products.');
  }
}

export async function saveProduct(product: SaleProduct): Promise<void> {
  try {
    await sql`
      INSERT INTO products (id, image, name, price)
      VALUES (${product.id}, ${product.image}, ${product.name}, ${product.price})
      ON CONFLICT (id) DO UPDATE
      SET image = EXCLUDED.image,
          name = EXCLUDED.name,
          price = EXCLUDED.price
    `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to save product.');
  }
}

// Shop Products
export async function fetchShopProducts(): Promise<ShopProduct[]> {
  try {
    const data = await sql<ShopProduct[]>`
      SELECT * FROM shop_products
      ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch shop products.');
  }
}

// Team Members
export async function fetchTeamMembers(): Promise<TeamMember[]> {
  try {
    const data = await sql<TeamMember[]>`
      SELECT * FROM team_members
      ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch team members.');
  }
}

// Reviews
export async function fetchReviews(): Promise<reviewProduct[]> {
  try {
    const data = await sql<reviewProduct[]>`
      SELECT * FROM reviews
      ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch reviews.');
  }
}

// Blogs
export async function fetchBlogs(): Promise<blogProduct[]> {
  try {
    const data = await sql<blogProduct[]>`
      SELECT * FROM blogs
      ORDER BY post_date DESC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch blogs.');
  }
}

// Contacts
export async function fetchContactData(): Promise<Contact> {
  try {
    const data = await sql<Contact[]>`
      SELECT * FROM contacts
      LIMIT 1
    `;
    if (data.length === 0) {
      throw new Error('No contact data found in database.');
    }
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch contact data.');
  }
}

// Dashboard
export async function fetchDashboardData(
  setDailyIncomeData: (data: ChartData) => void,
  setMonthlyIncomeData: (data: ChartData) => void,
  setLoading: (loading: boolean) => void
): Promise<void> {
  try {
    // Simulate delay for demo purposes
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Fetch daily income (aggregated by day of week)
    const dailyData = await sql`
      SELECT
        EXTRACT(DOW FROM date) AS day,
        SUM(CAST(REPLACE(REPLACE(total_price, 'Rp', ''), ',00', '') AS NUMERIC)) AS total
      FROM transactions
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY day
      ORDER BY day
    `;

    const dailyLabels = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dailyValues = new Array(7).fill(0);
    dailyData.forEach((row) => {
      dailyValues[parseInt(row.day)] = row.total;
    });

    setDailyIncomeData({
      labels: dailyLabels,
      datasets: [{
        label: 'Pendapatan Harian',
        data: dailyValues,
        backgroundColor: '#29CA2E',
        borderColor: '#29CA2E',
        borderWidth: 1,
      }],
    });

    // Fetch monthly income
    const monthlyData = await sql`
      SELECT
        EXTRACT(MONTH FROM date) AS month,
        SUM(CAST(REPLACE(REPLACE(total_price, 'Rp', ''), ',00', '') AS NUMERIC)) AS total
      FROM transactions
      WHERE date >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY month
      ORDER BY month
    `;

    const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthlyValues = new Array(12).fill(0);
    monthlyData.forEach((row) => {
      monthlyValues[parseInt(row.month) - 1] = row.total;
    });

    setMonthlyIncomeData({
      labels: monthlyLabels,
      datasets: [{
        label: 'Pendapatan Bulanan',
        data: monthlyValues,
        backgroundColor: '#E92020',
        borderColor: '#E92020',
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

// Profile
export async function fetchProfile(): Promise<Profile> {
  try {
    const data = await sql<Profile[]>`
      SELECT * FROM profiles
      LIMIT 1
    `;
    if (data.length === 0) {
      throw new Error('No profile data found in database.');
    }
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch profile data.');
  }
}

// Product Pelanggan
export async function fetchProductPelanggan(): Promise<ProductPelanggan[]> {
  try {
    const data = await sql<ProductPelanggan[]>`
      SELECT * FROM product_pelanggan
      ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product pelanggan.');
  }
}

// Product Details
export async function fetchProductDetails(name: string): Promise<Product1 | null> {
  try {
    const data = await sql<Product1[]>`
      SELECT * FROM product_details
      WHERE name = ${name}
    `;
    if (data.length === 0) return null;
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch product details.');
  }
}

// Available Products
export async function fetchAvailableProducts(): Promise<AvailableProduct[]> {
  try {
    const data = await sql<AvailableProduct[]>`
      SELECT * FROM available_products
      ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch available products.');
  }
}

// Authentication
export async function validateUser(email: string, password: string): Promise<{ isValid: boolean; role: string }> {
  try {
    const data = await sql`
      SELECT role FROM users
      WHERE email = ${email} AND password = ${password}
    `;
    if (data.length === 0) {
      return { isValid: false, role: '' };
    }
    return { isValid: true, role: data[0].role };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to validate user.');
  }
}

export async function registerUser(email: string, password: string, role: string = 'user'): Promise<void> {
  try {
    await sql`
      INSERT INTO users (email, password, role)
      VALUES (${email}, ${password}, ${role})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to register user.');
  }
}

export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const data = await sql`
      SELECT 1 FROM users
      WHERE email = ${email}
    `;
    return data.length > 0;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to check email.');
  }
}

export const generateRandomCaptcha = (): string => {
  if (typeof window === 'undefined') return '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
};

export const generateCaptcha = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
};

export const calculatePasswordStrength = (password: string, setPasswordStrength: (strength: number) => void) => {
  let strength = 0;
  if (password.length > 0) strength += 20;
  if (password.length >= 8) strength += 20;
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[^A-Za-z0-9]/.test(password)) strength += 20;
  setPasswordStrength(strength);
};