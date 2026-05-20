import React from 'react'

type Props = {
    title:string
}

const TopHeading = ({title}: Props) => {
  return (
      <h1 className="text-[32px] truncate w-[80%] font-semibold ">{title}</h1>
  )
}

export default TopHeading