'use client';

import Image from 'next/image';
import {
  ClipboardDocumentIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';
import { cousine } from '@/app/ui/fonts';
import { SaleProduct, Transaction } from '@/app/lib/definitions2';

interface Metrics {
  numberOfOrders?: number;
  totalOutcome?: number;
  totalRevenue?: number;
  numberOfTransactions?: number;
}

interface CardsProps {
  type: 'metric' | 'product' | 'transaction';
  metrics?: Metrics;
  products?: SaleProduct[];
  transactions?: Transaction[];
  loading: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function Cards({
  type,
  metrics = {},
  products = [],
  transactions = [],
  loading,
  onEdit = () => {},
  onDelete = () => {},
}: CardsProps) {
  if (type === 'metric') {
    const cards = [
      {
        icon: <ClipboardDocumentIcon className="h-8 w-8" />,
        iconColor: 'text-blue-600',
        title: 'Total Orders',
        value: metrics.numberOfOrders,
      },
      {
        icon: <ArrowUpTrayIcon className="h-8 w-8" />,
        iconColor: 'text-red-600',
        title: 'Outcome',
        value: metrics.totalOutcome
          ? new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(metrics.totalOutcome)
          : undefined,
      },
      {
        icon: <ArrowDownTrayIcon className="h-8 w-8" />,
        iconColor: 'text-green-600',
        title: 'Income',
        value: metrics.totalRevenue
          ? new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
            }).format(metrics.totalRevenue)
          : undefined,
      },
      {
        icon: <ArrowsRightLeftIcon className="h-8 w-8" />,
        iconColor: 'text-purple-600',
        title: 'Total Transaksi',
        value: metrics.numberOfTransactions,
      },
    ];

    return (
      <div className={`${cousine.className} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8`}>
        {loading
          ? [...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-[#F091DD] p-6 rounded-xl shadow-sm flex items-center animate-pulse"
              >
                <div className="mr-4 bg-gray-300 border-2 rounded-full p-2 w-16 h-16"></div>
                <div className="flex-1 text-center">
                  <div className="h-8 w-20 mx-auto bg-gray-300 rounded mb-1"></div>
                  <div className="h-6 w-32 mx-auto bg-gray-300 rounded"></div>
                </div>
              </div>
            ))
          : cards.map((card, index) => (
              <div
                key={index}
                className="bg-[#F091DD] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center"
              >
                <div
                  className={`mr-4 ${card.iconColor} bg-white border-2 rounded-full p-2 flex items-center justify-center w-16 h-16`}
                >
                  {card.icon}
                </div>
                <div className="flex-1 text-center">
                  <h2 className="text-3xl font-bold text-[#6A1E55] mb-1">{card.value ?? 'N/A'}</h2>
                  <p className="text-2xl font-bold text-gray-600 uppercase">{card.title}</p>
                </div>
              </div>
            ))}
      </div>
    );
  }

  if (type === 'product') {
    if (loading) {
      return (
        <tbody>
          {[...Array(3)].map((_, index) => (
            <tr key={index} className="border-t text-[#6A1E55] animate-pulse">
              <td className="p-2">
                <div className="h-6 w-16 bg-gray-300 rounded"></div>
              </td>
              <td className="p-4 flex items-center gap-2">
                <div className="h-16 w-16 bg-gray-300 rounded"></div>
                <div className="h-6 w-40 bg-gray-300 rounded"></div>
              </td>
              <td className="p-2">
                <div className="h-6 w-24 bg-gray-300 rounded"></div>
              </td>
              <td className="p-4 flex gap-2">
                <div className="h-8 w-16 bg-gray-300 rounded"></div>
                <div className="h-8 w-16 bg-gray-300 rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      );
    }

    if (products.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={4} className="p-4 text-center text-[#6A1E55]">
              Tidak ada produk
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="border-t text-[#6A1E55]">
            <td className="p-2">{product.id}</td>
            <td className="p-4 flex items-center gap-2">
              <Image
                src={product.image}
                alt={product.name}
                width={60}
                height={60}
                className="object-cover"
              />
              <span>{product.name}</span>
            </td>
            <td className="p-2">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(product.price)}
            </td>
            <td className="p-4 flex gap-2">
              <button
                className={`bg-[#D29BC7] text-white font-bold px-3 py-1 rounded ${cousine.className}`}
                onClick={() => onEdit(product.id)}
              >
                Edit
              </button>
              <button
                className={`bg-red-500 text-white font-bold px-3 py-1 rounded ${cousine.className}`}
                onClick={() => onDelete(product.id)}
              >
                Hapus
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    );
  }

  if (type === 'transaction') {
    if (loading) {
      return (
        <tbody>
          {[...Array(4)].map((_, index) => (
            <tr key={index} className="border-t text-[#6A1E55] animate-pulse">
              {[...Array(5)].map((_, colIndex) => (
                <td key={colIndex} className="p-2">
                  <div className="h-6 w-24 bg-gray-300 rounded"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      );
    }

    if (transactions.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={5} className="p-4 text-center text-[#6A1E55]">
              Tidak ada transaksi
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {transactions.map((transaction) => (
          <tr key={transaction.id} className="border-t text-[#6A1E55]">
            <td className="p-2">{transaction.id}</td>
            <td className="p-2">{transaction.date}</td>
            <td className="p-2">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(transaction.totalprice)}
            </td>
            <td className="p-2">{transaction.username}</td>
            <td className="p-2">{transaction.product}</td>
          </tr>
        ))}
      </tbody>
    );
  }

  return null;
}