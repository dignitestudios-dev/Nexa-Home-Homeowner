interface AddressData {
  label: string
  address: string
  country: string
  state: string
  city: string
  zipCode: string
  longitude: string
  latitude: string
}

interface AddAddressVars extends AddressData {}

interface AddAddressResponse {
  success: boolean
  message: string
}

interface SavedAddress {
  _id: string
  user: string
  label: string
  address: string
  country: string
  state: string
  city: string
  zipCode: string
  isDefault: boolean
  coordinates: {
    type: string
    coordinates: [number, number]
  }
  createdAt: string
  updatedAt: string
}

interface GetAllAddressesResponse {
  success: boolean
  message: string
  data: {
    addresses: SavedAddress[]
  }
}
