interface JobCategory {
  _id: string
  name: string
  slug: string
  icon: string
}

interface JobImage {
  _id: string
  filename: string
  key: string
  location: string
  mimetype: string
  size: number
  uploadedById: string
  uploadedByModel: string
  slug: string | null
  createdAt: string
  updatedAt: string
}

interface JobAddressDetails {
  _id: string
  address: string
  country: string
  state: string
  city: string
  zipCode: string
  coordinates: {
    type: string
    coordinates: [number, number]
  }
}
 interface ProviderProfilePicture {
  _id: string;
  filename: string;
  key: string;
  location: string;
  mimetype: string;
  size: number;
  uploadedById: string;
  uploadedByModel: string;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
interface Job {
  _id: string
  user: string
  provider: {
  _id: string;
  name: string;
  email: string;
  contactEmail: string | null;
  phone: string;
  profilePicture: ProviderProfilePicture;
  overview: string;
}
  category: JobCategory
  title: string
  description: string
  images: JobImage[]
  date: string
  addressDetails: JobAddressDetails
  when: string
  type: string
  status: string
  contactPreference: string[]
  applyCount: number
  isLocked: boolean
  userDisplayTag: string
  createdAt: string
  updatedAt: string
}

interface JobPagination {
  itemsPerPage: number
  currentPage: number
  totalItems: number
  totalPages: number
}

interface GetJobsResponse {
  success: boolean
  message: string
  data: {
    jobs: Job[]
    tab: string
    pagination: JobPagination
  }
}

type JobTab = 'ongoing' | 'completed'

interface JobUser {
  _id: string
  name: string
  profilePicture: string | null
}

interface JobCategoryPricing {
  dollarPrice: number
  oneTimeCredits: number
  recurringCredits: number
}

interface JobCategoryDetail {
  _id: string
  name: string
  slug: string
  icon: string
  pricing?: JobCategoryPricing
}

interface AppliedProviderAddress {
  _id: string
  label: string
  address: string
  city: string
  state: string
  country: string
  zipCode: string
  coordinates: {
    type: string
    coordinates: [number, number]
  }
}

interface AppliedProviderProfilePicture {
  _id: string
  filename: string
  key: string
  location: string
  mimetype: string
  size: number
  uploadedById: string
  uploadedByModel: string
  slug: string | null
  createdAt: string
  updatedAt: string
}

interface AppliedProvider {
  _id: string
  name: string
  profilePicture: AppliedProviderProfilePicture | null
  overview: string | null
  averageRating: number
  totalReviews: number
  appliedAt: string
  leadCost: number
  providerAddress: AppliedProviderAddress | null
}

 interface ProviderCoordinates {
  type: "Point";
  coordinates: [number, number];
}

 interface ProviderAddress {
  _id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates: ProviderCoordinates;
}

 interface ProviderProfilePicture {
  _id: string;
  filename: string;
  key: string;
  location: string;
  mimetype: string;
  size: number;
  uploadedById: string;
  uploadedByModel: string;
  slug: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface JobProvider {
  _id: string;
  name: string;
  email: string;
  contactEmail: string | null;
  phone: string;
  profilePicture: ProviderProfilePicture;
  overview: string;
  averageRating: number;
  totalReviews: number;
  providerAddress: ProviderAddress;
}

interface JobDetail extends Omit<Job, 'user' | 'category' | 'provider'> {
  user: JobUser
  category: JobCategoryDetail
  provider: JobProvider | null
  radius: number
  review: string | null
  isReviewSubmitted: boolean
}

interface GetJobDetailResponse {
  success: boolean
  message: string
  data: {
    job: JobDetail
    appliedProviders: AppliedProvider[]
  }
}

interface MatchingProvider {
  _id: string
  providerAddressId: string
  name: string
  profilePicture: {
    _id: string
    location: string
    filename: string
    mimetype: string
  } | null
  averageRating: number
  totalReviews: number
  area?: string
  distanceMiles?: number
}

interface GetMatchingProvidersResponse {
  success: boolean
  message: string
  data: {
    providers: MatchingProvider[]
    pagination: {
      page: number | null
      limit: number | null
      total: number
      totalPages: number
    }
  }
}

interface CreateJobVars {
  addressId: string
  category: string
  title: string
  description: string
  when: string
  type: string
  radius: number
  sendToAll: boolean
  providerIds?: string[]
  contactPreference?: string[]
  images?: File[]
}

interface CreatedJob {
  _id: string
  user: string
  provider: string | null
  category: string
  title: string
  description: string
  images: string[]
  date: string
  addressDetails: JobAddressDetails
  when: string
  type: string
  status: string
  contactPreference: string[]
  applyCount: number
  isLocked: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

interface CreateJobResponse {
  success: boolean
  message: string
  data: {
    job: CreatedJob
    matchedProviders: number
  }
}
