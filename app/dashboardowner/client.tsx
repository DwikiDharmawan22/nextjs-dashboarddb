// app/dashboardowner/client.tsx
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
  ClipboardDocumentIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ArrowsRightLeftIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { creepster, cousine } from '@/app/ui/fonts';
import { ChartData } from '@/app/lib/definitions2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ClientDashboardProps {
  dailyIncomeData: ChartData;
  monthlyIncomeData: ChartData;
  numberOfOrders: number;
  numberOfTransactions: number;
  totalRevenue: number;
  totalOutcome: number;
  topProduct: string;
  topCustomer: string;
}

export default function ClientDashboard({
  dailyIncomeData,
  monthlyIncomeData,
  numberOfOrders,
  numberOfTransactions,
  totalRevenue,
  totalOutcome,
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
    <div className="min-h-screen">
      <h1 className={`${creepster.className} text-6xl text-white font-bold text-center mb-8`}>
        DASHBOARD
      </h1>
      {/* Metrics Section */}
      <div className={`${cousine.className} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8`}>
        <div className="bg-[#F091DD] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center">
          <div className="mr-4 text-blue-600 bg-white border-2 rounded-full p-2 flex items-center justify-center w-16 h-16">
            <ClipboardDocumentIcon className="h-8 w-8" />
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-3xl font-bold text-[#6A1E55] mb-1">{numberOfOrders}</h2>
            <p className="text-2xl font-bold text-gray-600 uppercase">Total Orders</p>
          </div>
        </div>
        <div className="bg-[#F091DD] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center">
          <div className="mr-4 text-red-600 bg-white border-2 rounded-full p-2 flex items-center justify-center w-16 h-16">
            <ArrowUpTrayIcon className="h-8 w-8" />
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-3xl font-bold text-[#6A1E55] mb-1">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(totalOutcome)}
            </h2>
            <p className="text-2xl font-bold text-gray-600 uppercase">Outcome</p>
          </div>
        </div>
        <div className="bg-[#F091DD] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center">
          <div className="mr-4 text-green-600 bg-white border-2 rounded-full p-2 flex items-center justify-center w-16 h-16">
            <ArrowDownTrayIcon className="h-8 w-8" />
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-3xl font-bold text-[#6A1E55] mb-1">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(totalRevenue)}
            </h2>
            <p className="text-2xl font-bold text-gray-600 uppercase">Income</p>
          </div>
        </div>
        <div className="bg-[#F091DD] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center">
          <div className="mr-4 text-purple-600 bg-white border-2 rounded-full p-2 flex items-center justify-center w-16 h-16">
            <ArrowsRightLeftIcon className="h-8 w-8" />
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-3xl font-bold text-[#6A1E55] mb-1">{numberOfTransactions}</h2>
            <p className="text-2xl font-bold text-gray-600 uppercase">Total Transaksi</p>
          </div>
        </div>
      </div>
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
  );
}