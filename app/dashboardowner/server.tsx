// app/dashboardowner/server.tsx
import postgres from 'postgres'; // Impor default
import { ChartData } from '@/app/lib/definitions2';

// Inisialisasi koneksi database
const sql = postgres(process.env.DATABASE_URL || 'postgres://user:password@host:port/database'); // Sesuaikan dengan kredensial Anda

export async function fetchDashboardData(): Promise<{
  dailyIncomeData: ChartData;
  monthlyIncomeData: ChartData;
}> {
  try {
    const dailyData = await sql`
      SELECT TO_CHAR(day, 'Day') AS day, SUM(amount) AS total
      FROM daily_income
      GROUP BY day
      ORDER BY day
      LIMIT 5
    `;
    const dailyIncomeData: ChartData = {
      labels: dailyData.map((row) => row.day.trim()),
      datasets: [
        {
          label: 'Pendapatan Harian',
          data: dailyData.map((row) => Number(row.total) || 0),
          backgroundColor: '#29CA2E',
          borderColor: '#29CA2E',
          borderWidth: 1,
        },
      ],
    };

    const monthlyData = await sql`
      SELECT month, SUM(amount) AS total
      FROM monthly_income
      GROUP BY month
      ORDER BY month
      LIMIT 12
    `;
    const monthlyIncomeData: ChartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
      datasets: [
        {
          label: 'Pendapatan Bulanan',
          data: monthlyData.map((row) => Number(row.total) || 0),
          backgroundColor: '#E92020',
          borderColor: '#E92020',
          borderWidth: 1,
        },
      ],
    };

    return { dailyIncomeData, monthlyIncomeData };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch dashboard data.');
  }
}