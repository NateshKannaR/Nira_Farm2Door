'use client';

import React from 'react';
import DemandForecastStudio from '@/components/DemandForecastStudio';
import MandiArbitrageStudio from '@/components/MandiArbitrageStudio';

export default function ForecastPage() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-12">
      <DemandForecastStudio />
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <MandiArbitrageStudio />
      </div>
    </div>
  );
}
