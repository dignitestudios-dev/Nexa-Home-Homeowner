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
