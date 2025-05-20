'use client';

import { creepster, cousine } from '@/app/ui/fonts';
import Skeleton from '@/app/ui/skeletons2';

export default function Loading() {
  return (
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
  );
}