'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

interface AddAddressDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (address: AddressData) => void
  isPending?: boolean
  initialData?: AddressData & { lat?: number | null; lng?: number | null }
  title?: string
}

const addressSchema = z.object({
  label: z.string().min(1, 'Label is required').max(30, 'Label must be at most 30 characters'),
  address: z.string().min(1, 'Address is required').max(50, 'Address must be at most 50 characters'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().optional().or(z.literal('')),
  city: z.string().min(1, 'City is required'),
  zipCode: z.string().min(1, 'Zip Code is required').regex(/^\d+$/, 'Zip code must contain only digits'),
  latitude: z.string().min(1, 'Please select a location on the map'),
  longitude: z.string().min(1, 'Please select a location on the map'),
})

type AddressFormData = z.infer<typeof addressSchema>

const emptyForm: AddressFormData = {
  label: '',
  address: '',
  country: '',
  state: '',
  city: '',
  zipCode: '',
  longitude: '',
  latitude: '',
}

const loadGoogleMapsScript = (callback: () => void) => {
  if (typeof window === 'undefined') return;
  if ((window as any).google) {
    callback();
    return;
  }
  const existingScript = document.getElementById('google-maps-script');
  if (existingScript) {
    existingScript.addEventListener('load', callback);
    return;
  }
  const script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDTtKExKUXYOVHPTRUIrd_uSH9j940rDcI&libraries=places';
  script.id = 'google-maps-script';
  script.async = true;
  script.defer = true;
  script.onload = () => callback();
  document.body.appendChild(script);
};

function parseAddressComponents(components: any[]) {
  let streetNumber = '';
  let route = '';
  let city = '';
  let state = '';
  let country = '';
  let zipCode = '';

  for (const component of components) {
    const types = component.types;
    if (types.includes('street_number')) {
      streetNumber = component.long_name;
    } else if (types.includes('route')) {
      route = component.long_name;
    } else if (types.includes('locality') || types.includes('sublocality_level_1')) {
      city = component.long_name;
    } else if (types.includes('administrative_area_level_1')) {
      state = component.long_name;
    } else if (types.includes('country')) {
      country = component.long_name;
    } else if (types.includes('postal_code')) {
      zipCode = component.long_name;
    }
  }

  const streetAddress = [streetNumber, route].filter(Boolean).join(' ');
  return {
    address: streetAddress || '',
    city,
    state,
    country,
    zipCode: zipCode.replace(/\D/g, ''), // Ensure zip contains only digits
  };
}

export function AddAddressDialog({ open, onOpenChange, onSave, isPending, initialData, title = 'Add Address' }: AddAddressDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: emptyForm,
  })

  const watchLatitude = watch('latitude')
  const watchLongitude = watch('longitude')
  const watchLat = watchLatitude ? parseFloat(watchLatitude) : null
  const watchLng = watchLongitude ? parseFloat(watchLongitude) : null

  const mapRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const mapInstanceRef = React.useRef<any>(null);
  const markerInstanceRef = React.useRef<any>(null);
  const autocompleteInstanceRef = React.useRef<any>(null);
  const initialSnappedRef = React.useRef(false);

  React.useEffect(() => {
    if (!open) {
      initialSnappedRef.current = false;
    }
  }, [open]);

  React.useEffect(() => {
    if (open) {
      reset(
        initialData
          ? {
            label: initialData.label,
            address: initialData.address,
            country: initialData.country,
            state: initialData.state,
            city: initialData.city,
            zipCode: initialData.zipCode,
            latitude: initialData.latitude,
            longitude: initialData.longitude,
          }
          : emptyForm
      )

      loadGoogleMapsScript(() => {
        setIsLoaded(true);
      });
    }
  }, [open, initialData, reset])

  const updateFromPlace = (place: any, lat: number, lng: number) => {
    if (!place.address_components) return;

    const parsed = parseAddressComponents(place.address_components);

    setValue('latitude', lat.toFixed(6), { shouldValidate: true });
    setValue('longitude', lng.toFixed(6), { shouldValidate: true });

    if (parsed.address) setValue('address', parsed.address.substring(0, 50), { shouldValidate: true });
    if (parsed.city) setValue('city', parsed.city, { shouldValidate: true });
    if (parsed.state) setValue('state', parsed.state, { shouldValidate: true });
    if (parsed.country) setValue('country', parsed.country, { shouldValidate: true });
    if (parsed.zipCode) setValue('zipCode', parsed.zipCode, { shouldValidate: true });
  };

  const geocodeLatLng = (lat: number, lng: number) => {
    const google = (window as any).google;
    if (!google) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
      if (status === 'OK' && results && results[0]) {
        updateFromPlace(results[0], lat, lng);
      }
    });
  };

  React.useEffect(() => {
    if (!isLoaded || !open) return;

    const timer = setTimeout(() => {
      if (!mapRef.current) return;

      const google = (window as any).google;
      if (!google) return;

      const initialLat = watchLat ?? 40.74;
      const initialLng = watchLng ?? -73.98;
      const center = { lat: initialLat, lng: initialLng };

      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom: watchLat ? 16 : 12,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      });
      mapInstanceRef.current = map;

      const marker = new google.maps.Marker({
        position: center,
        map,
        draggable: true,
      });
      markerInstanceRef.current = marker;

      // trigger resize so map fills container correctly
      google.maps.event.trigger(map, 'resize');
      map.setCenter(center);

      if (searchInputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
          types: ['address'],
        });
        autocompleteInstanceRef.current = autocomplete;

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry || !place.geometry.location) return;

          const newLat = place.geometry.location.lat();
          const newLng = place.geometry.location.lng();

          map.setCenter({ lat: newLat, lng: newLng });
          map.setZoom(16);
          marker.setPosition({ lat: newLat, lng: newLng });

          updateFromPlace(place, newLat, newLng);
        });
      }

      map.addListener('click', (e: any) => {
        if (!e.latLng) return;
        const clickedLat = e.latLng.lat();
        const clickedLng = e.latLng.lng();

        setValue('latitude', clickedLat.toFixed(6), { shouldValidate: true });
        setValue('longitude', clickedLng.toFixed(6), { shouldValidate: true });

        marker.setPosition({ lat: clickedLat, lng: clickedLng });
        geocodeLatLng(clickedLat, clickedLng);
      });

      marker.addListener('dragend', () => {
        const pos = marker.getPosition();
        if (!pos) return;
        const draggedLat = pos.lat();
        const draggedLng = pos.lng();

        setValue('latitude', draggedLat.toFixed(6), { shouldValidate: true });
        setValue('longitude', draggedLng.toFixed(6), { shouldValidate: true });

        geocodeLatLng(draggedLat, draggedLng);
      });
    }, 200); // ← wait for dialog animation to finish

    return () => clearTimeout(timer);
  }, [isLoaded, open]);

  React.useEffect(() => {
    if (isLoaded && open && mapInstanceRef.current && markerInstanceRef.current && watchLat && watchLng && !initialSnappedRef.current) {
      const center = { lat: watchLat, lng: watchLng };
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(16);
      markerInstanceRef.current.setPosition(center);
      initialSnappedRef.current = true;
    }
  }, [isLoaded, open, watchLat, watchLng]);

  const onSubmit = (data: AddressFormData) => {
    onSave({
      label: data.label,
      address: data.address,
      country: data.country,
      state: data.state ? data.state : "",
      city: data.city,
      zipCode: data.zipCode,
      latitude: data.latitude,
      longitude: data.longitude,
    })
    reset(emptyForm)
  }

  const inputClass = 'h-12 w-full rounded-xl border border-[#005864] bg-white px-4 py-3 text-sm text-[#1C1C1C] placeholder:text-[rgba(24,24,24,0.6)] focus:outline-none'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="relative w-full max-w-131.25! fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] h-[80%] overflow-y-auto rounded-xl bg-[#F8F8F8] p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <DialogTitle className="text-[28px] font-semibold text-[#181818]">{title}</DialogTitle>
        </div>

        <div className="mt-6 space-y-4">
          {/* Autocomplete Search input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#181818]">Search Location</label>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for your address..."
              className={inputClass}
            />
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium text-[#181818]">Select Location on Map</div>
            <div
              className="relative rounded-2xl border border-[#005864] bg-[#E8F7F7]"
              style={{ height: "288px" }}  // ← remove overflow-hidden
            >
              {!isLoaded ? (
                <div className="flex h-full w-full items-center justify-center text-sm text-[#005864] font-medium">
                  Loading Google Maps...
                </div>
              ) : (
                <div ref={mapRef} style={{ height: "288px", width: "100%" }} />
              )}
            </div>
            {(errors.latitude || errors.longitude) && (
              <p className="text-red-500 text-xs">Please select a location on the map.</p>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#E5E5E5] bg-white p-3">
                <div className="text-[12px] uppercase text-[#005864]">Latitude</div>
                <div className="mt-1 text-base font-medium text-[#181818]">{watchLatitude || '--'}</div>
              </div>
              <div className="rounded-xl border border-[#E5E5E5] bg-white p-3">
                <div className="text-[12px] uppercase text-[#005864]">Longitude</div>
                <div className="mt-1 text-base font-medium text-[#181818]">{watchLongitude || '--'}</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#181818]">Label</label>
            <Input
              {...register('label')}
              maxLength={30}
              placeholder="e.g., Home, Office"
              className={inputClass}
            />
            {errors.label && <p className="text-red-500 text-xs">{errors.label.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#181818]">Address</label>
            <Input
              {...register('address')}
              maxLength={50}
              placeholder="Street 123, Downtown"
              className={inputClass}
            />
            {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#181818]">Country</label>
              <Input {...register('country')} placeholder="United States" className={inputClass} />
              {errors.country && <p className="text-red-500 text-xs">{errors.country.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#181818]">State</label>
              <Input {...register('state')} placeholder="Pennsylvania" className={inputClass} />
              {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#181818]">City</label>
              <Input {...register('city')} placeholder="Philadelphia" className={inputClass} />
              {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#181818]">Zip Code</label>
              <Input
                {...register('zipCode')}
                maxLength={6}
                inputMode="numeric"
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '')
                }}
                placeholder="12345"
                className={inputClass}
              />
              {errors.zipCode && <p className="text-red-500 text-xs">{errors.zipCode.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-6 w-full rounded-xl bg-[#005864] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004550] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
