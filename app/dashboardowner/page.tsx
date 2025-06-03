import { fetchCardData, fetchDashboardData, fetchTopProductToday, fetchTopCustomerThisMonth } from '@/app/lib/data2';
import ClientDashboard from './client';
import { ChartData } from '@/app/lib/definitions2';

export default async function DashboardPage() {
  // Initialize chart data
  let dailyIncomeData: ChartData = {
    labels: [],
    datasets: [{ label: '', data: [], backgroundColor: '', borderColor: '', borderWidth: 0 }],
  };
  let monthlyIncomeData: ChartData = {
    labels: [],
    datasets: [{ label: '', data: [], backgroundColor: '', borderColor: '', borderWidth: 0 }],
  };
  let loading = true;

  // Fetch dashboard data (charts)
  await fetchDashboardData(
    (data) => (dailyIncomeData = data),
    (data) => (monthlyIncomeData = data),
    (isLoading) => (loading = isLoading)
  );

  // Fetch card data (metrics)
  const { numberOfCustomers, numberOfTransactions, totalRevenue } = await fetchCardData();

  // Fetch top product and top customer
  const topProduct = await fetchTopProductToday();
  const topCustomer = await fetchTopCustomerThisMonth();

  return (
    <ClientDashboard
      dailyIncomeData={dailyIncomeData}
      monthlyIncomeData={monthlyIncomeData}
      numberOfOrders={numberOfTransactions} // Assuming orders = transactions
      numberOfCustomers={numberOfCustomers}
      numberOfTransactions={numberOfTransactions}
      totalRevenue={totalRevenue}
      topProduct={topProduct}
      topCustomer={topCustomer}
    />
  );
}