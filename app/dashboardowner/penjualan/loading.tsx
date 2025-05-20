'use client';

import { creepster, cousine } from '@/app/ui/fonts';

export default function Loading() {
  return (
    <div className={`min-h-screen bg-[#6A1E55] text-white p-4 ${cousine.className} animate-pulse`}>
      {/* Title Skeleton */}
      <div className="text-center mb-4">
        <div className={`${creepster.className} h-16 w-96 mx-auto bg-gray-300 rounded`}></div>
      </div>

      {/* Search and Button Section Skeleton */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="h-6 w-20 bg-gray-300 rounded"></div>
          <div className="h-8 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-20 bg-gray-300 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-40 bg-gray-300 rounded"></div>
          <div className="h-8 w-48 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#FFE1F9]">
              {[...Array(5)].map((_, index) => (
                <th key={index} className="p-4">
                  <div className="h-8 w-32 bg-gray-300 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(4)].map((_, index) => (
              <tr key={index} className="border-t">
                {[...Array(5)].map((_, colIndex) => (
                  <td key={colIndex} className="p-2">
                    <div className="h-6 w-24 bg-gray-300 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex flex-col items-center mt-16">
        <div className="flex gap-2 mb-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-8 w-8 bg-gray-300 rounded"></div>
          ))}
        </div>
        <div className="h-6 w-64 bg-gray-300 rounded"></div>
      </div>

      {/* Back Button Skeleton */}
      <div className="mt-4">
        <div className="h-10 w-24 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}