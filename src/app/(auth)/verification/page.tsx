import React, { Suspense } from 'react'
import Verification from '../_components/verification';

const page = () => {
  return (
    <div className="w-1/2 flex justify-center items-center h-screen">
      <Suspense>
        <Verification />
      </Suspense>
    </div>
  )
}

export default page