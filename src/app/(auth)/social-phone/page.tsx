import React, { Suspense } from 'react'
import SocialPhonePage from '../_components/social-phone';

type Props = {}

const page = (props: Props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <div className="w-full lg:w-1/2"><SocialPhonePage/></div>
    </Suspense>
  )
}

export default page
