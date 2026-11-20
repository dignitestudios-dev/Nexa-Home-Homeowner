import React, { Suspense } from 'react'
import Dashboard from '../_components/dashboard';
import DashboardSkeleton from '../_components/dashboard-skeleton';

type Props = {}

const page = (props: Props) => {
  return (
    <div className="">
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard/>
      </Suspense>
    </div>
  )
}

export default page
