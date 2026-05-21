import React from 'react'
import ServiceCard from './ui/service-card';
import type { Category } from '@/features/user/hooks';

type RecentActivity = {
  title: string;
  imageClass: string;
};

type CarouselItem = Category | RecentActivity;

type Props = {
  carouselItems: CarouselItem[];
  isCategoriesLoading: boolean;
  categoryDocs: Category[];
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  scrollCarousel: (direction: number) => void;
  categoryPage: number;
  setCategoryPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

const OnGoingServicesTab = (props: Props) => {
  const { carouselItems, isCategoriesLoading, categoryDocs, scrollContainerRef, scrollCarousel, categoryPage, setCategoryPage, totalPages } = props;

  return (
    <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-3">
        <ServiceCard
          serviceName="Service Name"
  description="Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim fauc..."
  status="Ongoing"
  postedDate="01/12/25"
  actionText="Ready to Hire"
        />
        <ServiceCard
          serviceName="Service Name"
  description="Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim fauc..."
  status="Ongoing"
  postedDate="01/12/25"
  actionText="Ready to Hire"
        />
        <ServiceCard
          serviceName="Service Name"
  description="Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim fauc..."
  status="Ongoing"
  postedDate="01/12/25"
  actionText="Ready to Hire"
        />
        <ServiceCard
          serviceName="Service Name"
  description="Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim fauc..."
  status="Ongoing"
  postedDate="01/12/25"
  actionText="Ready to Hire"
        />
        <ServiceCard
          serviceName="Service Name"
  description="Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim fauc..."
  status="Ongoing"
  postedDate="01/12/25"
  actionText="Ready to Hire"
        />
        <ServiceCard
          serviceName="Service Name"
  description="Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim fauc..."
  status="Ongoing"
  postedDate="01/12/25"
  actionText="Ready to Hire"
        />
        <ServiceCard
          serviceName="Service Name"
  description="Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim fauc..."
  status="Ongoing"
  postedDate="01/12/25"
  actionText="Ready to Hire"
        />
        <ServiceCard
          serviceName="Service Name"
  description="Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim fauc..."
  status="Ongoing"
  postedDate="01/12/25"
  actionText="Ready to Hire"
        />
        <ServiceCard
          serviceName="Service Name"
  description="Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim fauc..."
  status="Ongoing"
  postedDate="01/12/25"
  actionText="Ready to Hire"
        />
    </div>
  )
}

export default OnGoingServicesTab