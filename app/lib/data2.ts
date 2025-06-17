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

// Custom type for query result
interface QueryResult {
  rowCount?: number;
}

export const sql = postgres({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: { rejectUnauthorized: false },
});

// Sync a single product from products to shop_products
async function syncProductToShopProduct(product: SaleProduct): Promise<void> {
  try {
    const defaultWidth = 300;
    const defaultHeight = 300;
    const link = `/shop/product/${product.id}`;

    // Sisipkan atau perbarui berdasarkan id
    await sql`
      INSERT INTO shop_products (id, image, name, width, height, link)
      VALUES (${product.id}, ${product.image}, ${product.name}, ${defaultWidth}, ${defaultHeight}, ${link})
      ON CONFLICT (id) DO UPDATE
      SET image = EXCLUDED.image,
          name = EXCLUDED.name,
          width = EXCLUDED.width,
          height = EXCLUDED.height,
          link = EXCLUDED.link
    `;
  } catch (error) {
    console.error('Database Error syncing product to shop_products:', error);
    throw new Error(`Failed to sync product ${product.id} to shop_products.`);
  }
}

// Sync all products to shop_products
export async function syncAllProductsToShopProducts(): Promise<void> {
  try {
    const products = await fetchProducts();
    await sql.begin(async (sql) => {
      for (const product of products) {
        await syncProductToShopProduct(product);
      }
    });
    console.log('All products synced to shop_products successfully.');
  } catch (error) {
    console.error('Database Error syncing all products:', error);
    throw new Error('Failed to sync all products to shop_products.');
  }
}

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
      SELECT id, date, totalPrice AS totalprice, username, product
      FROM transactions
      ORDER BY date DESC
    `;
    console.log('[fetchTransactions] Fetched data:', data.map(t => ({ id: t.id, date: t.date, totalprice: t.totalprice })));
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

export async function deleteTransaction(id: string): Promise<void> {
  try {
    console.log('Attempting to delete transaction with ID:', id);
    console.log('Database config:', {
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
      username: process.env.PGUSER,
    });
    const result = await sql`
      DELETE FROM transactions
      WHERE id = ${id}
      RETURNING *
    `;
    if (result.length === 0) {
      console.warn(`No transaction found with ID: ${id}`);
      throw new Error('Transaction not found');
    }
    console.log('Transaction deleted with ID:', id);
  } catch (error: any) {
    console.error('Error deleting transaction with ID:', id, {
      message: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      severity: error.severity,
    });
    if (error.code && error.code.startsWith('08')) {
      throw new Error('Failed to delete transaction due to network issue. Please try again.');
    }
    throw new Error('Failed to delete transaction due to server issue. Please try again.');
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
export async function fetchTopProductsByTransactions(): Promise<SaleProduct[]> {
  try {
    const data = await sql<SaleProduct[]>`
      SELECT p.id, p.image, p.name, p.price
      FROM products p
      JOIN (
        SELECT 
          SPLIT_PART(product, ' - ', 1) as product_name, 
          COUNT(*) as transaction_count
        FROM transactions
        WHERE product IS NOT NULL
        GROUP BY SPLIT_PART(product, ' - ', 1)
        ORDER BY transaction_count DESC
        LIMIT 3
      ) t ON p.name = t.product_name
      ORDER BY t.transaction_count DESC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch top products by transactions.');
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
        await syncProductToShopProduct(product);
      }
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to save products.');
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await sql.begin(async (sql) => {
      const productResult = await sql`
        DELETE FROM products
        WHERE id = ${id}
        RETURNING *
      `;
      if (!productResult || productResult.length === 0) {
        throw new Error('Product not found in products table');
      }
      const shopProductResult = await sql`
        DELETE FROM shop_products
        WHERE id = ${id}
        RETURNING *
      `;
      if (!shopProductResult || shopProductResult.length === 0) {
        console.warn(`No shop product found with ID: ${id}`);
      }
    });
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete product.');
  }
}

export async function fetchUsersByRole(role: string): Promise<{ username: string }[]> {
  try {
    const data = await sql<{ username: string }[]>`
      SELECT username
      FROM users
      WHERE role = ${role}
      ORDER BY username ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error(`Failed to fetch users with role ${role}.`);
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
      SELECT 
        TO_CHAR(date, 'Day') AS day, 
        SUM(totalPrice) AS total
      FROM transactions
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY TO_CHAR(date, 'Day'), date
      ORDER BY date
    `;
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dailyMap = new Map(dailyData.map(row => [row.day.trim(), Number(row.total) || 0]));
    const dailyLabels = days.slice(-7).map(day => day);
    const dailyValues = dailyLabels.map(day => dailyMap.get(day) || 0);

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

    const monthlyData = await sql`
      SELECT 
        EXTRACT(MONTH FROM date) AS month_num,
        SUM(totalPrice) AS total
      FROM transactions
      WHERE date >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY EXTRACT(MONTH FROM date)
      ORDER BY EXTRACT(MONTH FROM date)
    `;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthlyMap = new Map(monthlyData.map(row => [Number(row.month_num), Number(row.total) || 0]));
    const monthlyValues = months.map((_, i) => monthlyMap.get(i + 1) || 0);

    setMonthlyIncomeData({
      labels: months,
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
      SELECT id, image, name, width, height, link
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

export async function fetchCardData(): Promise<{
  numberOfCustomers: number;
  numberOfTransactions: number;
  totalRevenue: number;
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
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

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

export const generateRandomCaptcha = (): string => {
  if (typeof window === 'undefined') return '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
};

export const generateCaptcha = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
};