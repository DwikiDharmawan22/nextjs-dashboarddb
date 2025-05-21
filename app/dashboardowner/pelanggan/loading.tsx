'use client';

import { creepster, cousine } from '@/app/ui/fonts';
import Skeleton from '@/app/ui/skeletons2';

export default function Loading() {
  return (
    <div className="min-h-screen text-white p-4" style={{ backgroundColor: '#6A1E55' }}>
      <h1 className={`text-6xl text-white font-bold flex justify-center items-center ${creepster.className}`}>
        DATA PELANGGAN
      </h1>

      <div className="flex justify-between items-center mb-4">
        <div className={`flex items-center gap-2 text-xl ${cousine.className}`}>
          <span>SHOW:</span>
          <div className="h-8 w-20 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-40 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-8 w-32 bg-gray-300 rounded animate-pulse"></div>
        </div>
      </div>

      <div className={`flex justify-center items-center text-2xl bg-white text-black rounded-lg overflow-hidden ${cousine.className}`}>
        <table className="w-full">
          <Skeleton type="table-header" />
          <Skeleton type="transaction-row" />
        </table>
      </div>

      <Skeleton type="pagination" />

      {/* Modal skeleton */}
      <Skeleton type="modal" />
    </div>
  );
}