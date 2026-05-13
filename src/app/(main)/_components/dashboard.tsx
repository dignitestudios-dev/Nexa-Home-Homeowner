"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react'
import TopHeading from './ui/top-heading';

type Props = {}

const tabs = ['Home', 'Ongoing', 'Completed'];

const recentActivities = [
  { title: 'Landscaping', imageClass: 'bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-200 via-slate-100 to-slate-200' },
  { title: 'Pool Cleaning', imageClass: 'bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-200 via-sky-100 to-slate-200' },
  { title: 'Fence Installation', imageClass: 'bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-200 via-orange-100 to-slate-200' },
  { title: 'Pest Control', imageClass: 'bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-200 via-emerald-100 to-slate-200' },
  { title: 'Gutter Cleaning', imageClass: 'bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-300 via-slate-100 to-slate-200' },
];

const categories = [
  'Plumbing Services',
  'Electrical Services',
  'HVAC Services And Maintenance',
  'Handyman Services',
  'Cleaning Services',
  'Lawn Care And Landscaping',
  'Pest Control',
  'Appliance Repair',
  'Roofing Services',
  'Gutter Services',
];

const Dashboard = (props: Props) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="max-w-[1230px] mx-auto py-5 space-y-10 px-4 sm:px-6 lg:px-0">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <TopHeading title="Welcome Rayan" />
          <p className="text-xl text-slate-600 mt-1">Toronto, Canada</p>
        </div>
        <Button className="flex items-center gap-2 px-5" variant="primary">
          <Search size={18} />
          Find an Expert
        </Button>
      </div>

      <div className="space-y-8">
        <div className="w-full max-w-[510px] rounded-[12px] bg-[#F8F8F8] p-1">
          <div className="grid grid-cols-3 gap-1">
            {tabs.map((tab) => {
              const active = tab === activeTab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'min-h-[38px] rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#005864]/20',
                    active
                      ? 'bg-[#005864] text-white shadow-sm'
                      : 'bg-white text-[#005864] hover:bg-slate-100'
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-950">Based on your recent activity</h2>
          <div className="grid gap-4 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2">
            {recentActivities.map((activity) => (
              <div key={activity.title} className="overflow-hidden rounded-[12px] bg-white shadow-sm border border-slate-200">
                <div className={cn('h-[117px] rounded-t-[12px] p-4', activity.imageClass)} />
                <div className="px-4 py-4">
                  <p className="text-base font-medium text-slate-900">{activity.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-slate-950">Categories</h2>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">01</div>
            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#005864] text-white shadow-sm transition hover:bg-[#004d57]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2">
          {categories.map((title) => (
            <div key={title} className="overflow-hidden rounded-[12px] bg-white shadow-sm border border-slate-200">
              <div className="h-[211px] rounded-t-[12px] bg-slate-200" />
              <div className="px-4 py-4">
                <p className="text-base font-medium text-slate-900">{title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard