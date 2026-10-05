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
