'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  CalendarDaysIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { creepster, cousine } from '@/app/ui/fonts';
import { ChartData } from '@/app/lib/definitions2';
import { Suspense } from 'react';
import Cards from '@/app/ui/dashboard/cards2';
import Skeleton from '@/app/ui/skeletons2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ClientDashboardProps {
  dailyIncomeData: ChartData;
  monthlyIncomeData: ChartData;
  numberOfOrders: number;
  numberOfCustomers: number;
  numberOfTransactions: number;
  totalRevenue: number;
  topProduct: string;
  topCustomer: string;
}

export default function ClientDashboard({
  dailyIncomeData,
  monthlyIncomeData,
  numberOfOrders,
  numberOfCustomers,
  numberOfTransactions,
  totalRevenue,
  topProduct,
  topCustomer,
}: ClientDashboardProps) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: string | number) {
            if (typeof value === 'number') {
              return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(value);
            }
            return value;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <h1 className={`${creepster.className} text-6xl text-white font-bold text-center mb-8`}>
          DASHBOARD
        </h1>
        <Skeleton type="metric" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Skeleton type="chart" />
          <Skeleton type="chart" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton type="bottom" />
          <Skeleton type="bottom" />
        </div>
      </div>
    }>
      <div className="min-h-screen">
        <h1 className={`${creepster.className} text-6xl text-white font-bold text-center mb-8`}>
          DASHBOARD
        </h1>
        {/* Metrics Section */}
        <Cards
          type="metric"
          metrics={{
            numberOfCustomers,
            numberOfTransactions,
            totalRevenue,
          }}
          loading={false}
        />
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#e9acdd] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center mb-4">
              <CalendarDaysIcon className="h-8 w-8 mr-2" />
              <h2 className={`${cousine.className} text-3xl font-bold text-[#6A1E55]`}>Pendapatan Harian</h2>
            </div>
            <div className="h-80">
              <Bar data={dailyIncomeData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-[#e9acdd] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center mb-4">
              <ChartBarIcon className="h-8 w-8 mr-2" />
              <h2 className={`${cousine.className} text-3xl font-bold text-[#6A1E55]`}>Pendapatan Bulanan</h2>
            </div>
            <div className="h-80">
              <Bar data={monthlyIncomeData} options={chartOptions} />
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <ShoppingBagIcon className="h-8 w-8 mr-2" />
              <p className={`${cousine.className} text-2xl text-[#6A1E55]`}>Produk yang banyak dipesan hari ini</p>
            </div>
            <h3 className="flex items-center justify-center text-3xl font-bold text-[#6A1E55] underline decoration-[#6A1E55] decoration-4 underline-offset-8">
              {topProduct}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-center mb-2">
              <UserIcon className="h-8 w-8 mr-2" />
              <p className={`${cousine.className} text-2xl text-[#6A1E55]`}>Transaksi Pelanggan Terbanyak Bulan Ini</p>
            </div>
            <h3 className="flex items-center justify-center text-3xl font-bold text-[#6A1E55] underline decoration-[#6A1E55] decoration-4 underline-offset-8">
              {topCustomer}
            </h3>
          </div>
        </div>
      </div>
    </Suspense>
  );
}