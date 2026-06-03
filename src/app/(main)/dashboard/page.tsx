import React, { Suspense } from 'react'
import Dashboard from '../_components/dashboard';
// import Dashboard from ""
type Props = {}

const page = (props: Props) => {
  return (
    <div className="">
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard/>
      </Suspense>
    </div>
  )
}

export default page