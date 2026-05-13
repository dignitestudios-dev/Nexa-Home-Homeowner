'use client'

import * as React from 'react'
import { Icon, type LeafletMouseEvent } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface AddAddressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (address: AddressData) => void
  isPending?: boolean
}

const emptyForm: AddressData & { lat: number | null; lng: number | null } = {
  label: '',
  address: '',
  country: '',
  state: '',
  city: '',
  zipCode: '',
  longitude: '',
  latitude: '',
  lat: null,
  lng: null,
}

export function AddAddressDialog({ open, onOpenChange, onSave, isPending }: AddAddressDialogProps) {
  const [formState, setFormState] = React.useState(emptyForm)
  const [error, setError] = React.useState('')

  const handleChange = (field: keyof AddressData, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }))
  }

  const handleMapClick = (lat: number, lng: number) => {
    setFormState((prev) => ({
      ...prev,
      lat,
      lng,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6),
    }))
    setError('')
  }

  const defaultCenter: [number, number] = [40.74, -73.98]
  const mapCenter: [number, number] = [formState.lat ?? defaultCenter[0], formState.lng ?? defaultCenter[1]]
  const mapZoom = 12

  const defaultIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  function MapClickHandler() {
    const map = useMap()
    useMapEvents({
      click(e: LeafletMouseEvent) {
        handleMapClick(e.latlng.lat, e.latlng.lng)
      },
    })
    React.useEffect(() => {
      if (formState.lat !== null && formState.lng !== null) {
        map.setView([formState.lat, formState.lng], mapZoom)
      }
    }, [formState.lat, formState.lng, map])
    return null
  }

  const handleSave = () => {
    const { label, address, country, state, city, zipCode, lat, lng } = formState
    if (!label || !address || !country || !state || !city || !zipCode) {
      setError('Please fill in all address fields.')
      return
    }
    if (lat === null || lng === null) {
      setError('Please choose a location on the map.')
      return
    }
    onSave({
      label,
      address,
      country,
      state,
      city,
      zipCode,
      latitude: formState.latitude,
      longitude: formState.longitude,
    })
    setFormState(emptyForm)
    setError('')
  }

  const inputClass = 'h-12 rounded-xl border border-[#005864] bg-white px-4 py-3 text-sm text-[#1C1C1C] placeholder:text-[rgba(24,24,24,0.6)]'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="relative w-full max-w-131.25 h-[80%] overflow-y-auto rounded-xl bg-[#F8F8F8] p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <DialogTitle className="text-[28px] font-semibold text-[#181818]">Add Address</DialogTitle>
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#181818]">Label</label>
            <Input value={formState.label} onChange={(e) => handleChange('label', e.target.value)} placeholder="e.g., Home, Office" className={inputClass} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#181818]">Address</label>
            <Input value={formState.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Street 123, Downtown" className={inputClass} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#181818]">Country</label>
              <Input value={formState.country} onChange={(e) => handleChange('country', e.target.value)} placeholder="United States" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#181818]">State</label>
              <Input value={formState.state} onChange={(e) => handleChange('state', e.target.value)} placeholder="Pennsylvania" className={inputClass} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#181818]">City</label>
              <Input value={formState.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="Philadelphia" className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#181818]">Zip Code</label>
              <Input value={formState.zipCode} onChange={(e) => handleChange('zipCode', e.target.value)} placeholder="12345" className={inputClass} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium text-[#181818]">Select Location on Map</div>
            <div className="relative h-72 overflow-hidden rounded-2xl border border-[#005864] bg-[#E8F7F7]">
              <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                <MapClickHandler />
                {formState.lat !== null && formState.lng !== null && (
                  <Marker position={[formState.lat, formState.lng]} icon={defaultIcon}>
                    <Popup>Selected location</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#E5E5E5] bg-white p-3">
                <div className="text-[12px] uppercase text-[#005864]">Latitude</div>
                <div className="mt-1 text-base font-medium text-[#181818]">{formState.latitude || '--'}</div>
              </div>
              <div className="rounded-xl border border-[#E5E5E5] bg-white p-3">
                <div className="text-[12px] uppercase text-[#005864]">Longitude</div>
                <div className="mt-1 text-base font-medium text-[#181818]">{formState.longitude || '--'}</div>
              </div>
            </div>
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="mt-6 w-full rounded-xl bg-[#005864] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004550] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Saving...' : 'Save Address'}
        </button>
      </DialogContent>
    </Dialog>
  )
}
