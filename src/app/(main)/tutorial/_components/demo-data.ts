import { StepOneData, StepTwoData } from "../../find-expert/page";

export const DEMO_STEP_ONE_DATA: StepOneData = {
  categoryId: "demo-landscaping-category",
  categoryName: "Landscaping & Lawn Care",
  description: "Looking for weekly front and backyard lawn mowing, precision edging, and seasonal hedge trimming for a residential home.",
  when: "Need an expert right away",
  addressId: "demo-address-id",
  jobType: "recurring",
  contactCall: true,
  contactEmail: true,
  uploadedImages: [],
  uploadedVideos: [],
};

export const DEMO_STEP_TWO_DATA: StepTwoData = {
  sendToAll: true,
  selectedProviderIds: ["demo-prov-1", "demo-prov-2", "demo-prov-3"],
  radius: 50,
};

export const DEMO_MATCHED_PROVIDERS: MatchingProvider[] = [
  {
    _id: "demo-prov-1",
    providerAddressId: "demo-addr-1",
    name: "Apex Home & Garden Pro",
    averageRating: 4.9,
    totalReviews: 142,
    isVerifiedBadge: true,
    profilePicture: {
      _id: "demo-pic-1",
      location: "",
      filename: "avatar1.jpg",
      mimetype: "image/jpeg",
    },
    distanceMiles: 3.2,
  },
  {
    _id: "demo-prov-2",
    providerAddressId: "demo-addr-2",
    name: "GreenThumb Landscaping LLC",
    averageRating: 5.0,
    totalReviews: 98,
    isVerifiedBadge: true,
    profilePicture: {
      _id: "demo-pic-2",
      location: "",
      filename: "avatar2.jpg",
      mimetype: "image/jpeg",
    },
    distanceMiles: 5.8,
  },
  {
    _id: "demo-prov-3",
    providerAddressId: "demo-addr-3",
    name: "EcoClean Yard Solutions",
    averageRating: 4.8,
    totalReviews: 76,
    isVerifiedBadge: true,
    profilePicture: {
      _id: "demo-pic-3",
      location: "",
      filename: "avatar3.jpg",
      mimetype: "image/jpeg",
    },
    distanceMiles: 7.1,
  },
];

export interface DemoJobItem {
  _id: string;
  serviceName: string;
  description: string;
  status: "Ongoing" | "Completed";
  postedDate: string;
  actionText: string;
  when: string;
  applyCount?: number;
}

export const DEMO_ONGOING_JOBS: DemoJobItem[] = [
  {
    _id: "demo-ongoing-1",
    serviceName: "Landscaping & Lawn Care",
    description: "Weekly front and backyard lawn mowing, precision edging, and seasonal hedge trimming for a residential home.",
    status: "Ongoing",
    postedDate: "Today",
    actionText: "Confirm Expert",
    when: "Right away",
    applyCount: 3,
  },
  {
    _id: "demo-ongoing-2",
    serviceName: "Plumbing Pipe Repair",
    description: "Fixing kitchen sink pressure leak and full inspection of master bathroom drainage valve.",
    status: "Ongoing",
    postedDate: "Yesterday",
    actionText: "Confirm Expert",
    when: "This week",
    applyCount: 3,
  },
  {
    _id: "demo-ongoing-3",
    serviceName: "HVAC System Tune-Up",
    description: "Seasonal AC coil cleaning, compressor diagnostics, and smart thermostat calibration.",
    status: "Ongoing",
    postedDate: "10/05/26",
    actionText: "Confirm Expert",
    when: "Flexible",
    applyCount: 3,
  },
];

export const DEMO_COMPLETED_JOBS: DemoJobItem[] = [
  {
    _id: "demo-completed-1",
    serviceName: "Gutter Cleaning & Guard Installation",
    description: "Full residential gutter debris cleanout, downspout flushing, and high-durability mesh leaf guard fitting.",
    status: "Completed",
    postedDate: "09/28/26",
    actionText: "Completed",
    when: "Completed",
    applyCount: 1,
  },
  {
    _id: "demo-completed-2",
    serviceName: "Electrical Panel Upgrade",
    description: "200A main breaker panel replacement with new safety surge protectors and labeled circuits.",
    status: "Completed",
    postedDate: "09/15/26",
    actionText: "Completed",
    when: "Completed",
    applyCount: 1,
  },
  {
    _id: "demo-completed-3",
    serviceName: "Pest Control & Termite Barrier",
    description: "Comprehensive perimeter spray application, foundation sealing, and preventative termite inspection.",
    status: "Completed",
    postedDate: "08/30/26",
    actionText: "Completed",
    when: "Completed",
    applyCount: 1,
  },
];

