"use client"
import React, { Suspense } from 'react'
import LoginPage from '../_components/login';

type Props = {}

const Page = (props: Props) => {
  return (
    <div className="w-full lg:w-1/2">
      <Suspense fallback={null}>
        <LoginPage />
      </Suspense>
    </div>
  )
}

export default Page