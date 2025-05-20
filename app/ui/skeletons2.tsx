'use client';

import { cousine } from '@/app/ui/fonts';

interface SkeletonProps {
  type:
    | 'metric'
    | 'chart'
    | 'bottom'
    | 'table-header'
    | 'product-row'
    | 'transaction-row'
    | 'modal'
    | 'pagination';
}

export default function Skeleton({ type }: SkeletonProps) {
  if (type === 'metric') {
    return (
      <div className={`${cousine.className} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-pulse`}>
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-[#F091DD] p-6 rounded-xl shadow-sm flex items-center"
          >
            <div className="mr-4 bg-gray-300 border-2 rounded-full p-2 w-16 h-16"></div>
            <div className="flex-1 text-center">
              <div className="h-8 w-20 mx-auto bg-gray-300 rounded mb-1"></div>
              <div className="h-6 w-32 mx-auto bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="bg-[#e9acdd] p-6 rounded-xl shadow-sm animate-pulse">
        <div className="flex items-center justify-center mb-4">
          <div className="h-8 w-8 mr-2 bg-gray-300 rounded-full"></div>
          <div className="h-8 w-48 bg-gray-300 rounded"></div>
        </div>
        <div className="h-80 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (type === 'bottom') {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
        <div className="flex items-center justify-center mb-2">
          <div className="h-8 w-8 mr-2 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-64 bg-gray-300 rounded"></div>
        </div>
        <div className="h-8 w-48 mx-auto bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (type === 'table-header') {
    return (
      <thead className="animate-pulse">
        <tr className="bg-[#FFE1F9]">
          {[...Array(5)].map((_, index) => (
            <th key={index} className="p-4">
              <div className="h-8 w-32 bg-gray-300 rounded"></div>
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  if (type === 'product-row') {
    return (
      <tbody className="animate-pulse">
        {[...Array(3)].map((_, index) => (
          <tr key={index} className="border-t text-[#6A1E55]">
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

  if (type === 'transaction-row') {
    return (
      <tbody className="animate-pulse">
        {[...Array(4)].map((_, index) => (
          <tr key={index} className="border-t text-[#6A1E55]">
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

  if (type === 'modal') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 animate-pulse">
        <div className="bg-[#FFE1F9] p-6 rounded-lg w-96">
          <div className={`h-8 w-48 mx-auto bg-gray-300 rounded mb-4 ${cousine.className}`}></div>
          <div className="mb-4">
            <div className="h-4 w-16 bg-gray-300 rounded mb-1"></div>
            <div className="h-8 w-full bg-gray-300 rounded"></div>
          </div>
          <div className="mb-4">
            <div className="h-4 w-24 bg-gray-300 rounded mb-1"></div>
            <div className="h-8 w-full bg-gray-300 rounded"></div>
          </div>
          <div className="mb-4">
            <div className="h-4 w-20 bg-gray-300 rounded mb-1"></div>
            <div className="h-8 w-full bg-gray-300 rounded"></div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="h-10 w-24 bg-gray-300 rounded"></div>
            <div className="h-10 w-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'pagination') {
    return (
      <div className="flex flex-col items-center mt-16 animate-pulse">
        <div className="flex gap-2 mb-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-8 w-8 bg-gray-300 rounded"></div>
          ))}
        </div>
        <div className="h-6 w-64 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return null;
}