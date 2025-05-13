'use client'

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  ClipboardDocumentIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ArrowsRightLeftIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { creepster, cousine } from '@/app/ui/fonts';
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [dailyIncomeData, setDailyIncomeData] = useState<ChartData>({
    labels: [],
    datasets: []
  });
  const [monthlyIncomeData, setMonthlyIncomeData] = useState<ChartData>({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulasi delay fetching data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setDailyIncomeData({
          labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"],
          datasets: [{
            label: "Pendapatan Harian",
            data: [30000, 35000, 20000, 25000, 40000],
            backgroundColor: "#29CA2E",
            borderColor: "#29CA2E",
            borderWidth: 1,
          }],
        });

        setMonthlyIncomeData({
          labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"],
          datasets: [{
            label: "Pendapatan Bulanan",
            data: [15000, 20000, 25000, 30000, 18000, 22000, 28000, 32000, 20000, 25000, 15000, 10000],
            backgroundColor: "#E92020",
            borderColor: "#E92020",
            borderWidth: 1,
          }],
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: string | number) {
            if (typeof value === 'number') {
              return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              }).format(value);
            }
            return value;
          }
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="  min-h-screen">
      <h1 className={`${creepster.className} text-6xl text-white font-bold text-center mb-8`}>
        DASHBOARD
      </h1>

      {/* Metrics Section */}
      <div className={`${cousine.className} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8`}>
        <MetricCard 
          icon={<ClipboardDocumentIcon className="h-8 w-8" />}
          value="80" 
          label="Total Orders" 
          bgColor="bg-[#F091DD]"
          iconColor="text-blue-600"
        />
        
        <MetricCard 
          icon={<ArrowUpTrayIcon className="h-8 w-8" />}
          value="Rp 8.000.000" 
          label="Outcome" 
          bgColor="bg-[#F091DD]"
          iconColor="text-red-600"
        />
        
        <MetricCard 
          icon={<ArrowDownTrayIcon className="h-8 w-8" />}
          value="Rp 18.000.000" 
          label="Income" 
          bgColor="bg-[#F091DD]"
          iconColor="text-green-600"
        />
        
        <MetricCard 
          icon={<ArrowsRightLeftIcon className="h-8 w-8" />}
          value="237" 
          label="Total Transaksi" 
          bgColor="bg-[#F091DD]"
          iconColor="text-purple-600"
        />
      </div>

      {/* Charts Section */}
      <div className=" grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ChartCard 
          title="Pendapatan Harian"
          icon={<CalendarDaysIcon className="h-8 w-8 mr-2" />}
          chart={<Bar data={dailyIncomeData} options={chartOptions} />}
        />
        
        <ChartCard 
          title="Pendapatan Bulanan"
          icon={<ChartBarIcon className="h-8 w-8 mr-2" />}
          chart={<Bar data={monthlyIncomeData} options={chartOptions} />}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        <InfoCard 
          title="Produk yang banyak dipesan hari ini"
          value="Topeng Cicilia"
          icon={<ShoppingBagIcon className="h-8 w-8 mr-2" />}
        />
        
        <InfoCard 
          title="Transaksi Pelanggan Terbanyak Bulan Ini"
          value="Dwiki"
          icon={<UserIcon className="h-8 w-8 mr-2" />}
        />
      </div>
    </div>
  );
}

// Komponen Metric Card
function MetricCard({ 
  icon, 
  value, 
  label, 
  bgColor,
  iconColor
}: { 
  icon: React.ReactNode;
  value: string; 
  label: string; 
  bgColor: string;
  iconColor?: string;
}) {
  return (
    <div className={`${bgColor} p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center`}>
      <div className={`mr-4 ${iconColor || 'text-gray-600'} bg-white border-2 rounded-full p-2 flex items-center justify-center w-16 h-16`}>
        {icon}
      </div>
      <div className="flex-1 text-center">
        <h2 className="text-3xl font-bold text-[#6A1E55] mb-1">{value}</h2>
        <p className="text-2xl font-bold text-gray-600 uppercase">{label}</p>
      </div>
    </div>
  );
}

// Komponen Chart Card
function ChartCard({ 
  title, 
  icon,
  chart 
}: { 
  title: string;
  icon?: React.ReactNode;
  chart: React.ReactNode;
}) {
  return (
    <div className="bg-[#e9acdd] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-center mb-4">
        {icon}
        <h2 className={`${cousine.className} text-3xl font-bold text-[#6A1E55]`}>{title}</h2>
      </div>
      <div className="h-80">
        {chart}
      </div>
    </div>
  );
}

// Komponen Info Card
function InfoCard({ 
  title, 
  value,
  icon
}: { 
  title: string; 
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-center mb-2">
        {icon}
        <p className={`${cousine.className} text-2xl text-[#6A1E55] `}>{title}</p>
      </div>
      <h3 className="flex items-center justify-center text-3xl font-bold text-[#6A1E55] underline decoration-[#6A1E55] decoration-4 underline-offset-8">{value}</h3>
    </div>
  );
}