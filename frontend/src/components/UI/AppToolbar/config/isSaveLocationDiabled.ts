import { CountryTypes, LocationTypes } from '../../../../types/types.Location.ts';

export const isSaveDisabled = (
  isLocationUpdateLoading: boolean,
  locationData: LocationTypes,
  region: CountryTypes[],
  cities: { name: string }[],
): boolean => {
  return (
    isLocationUpdateLoading ||
    locationData.location === '' ||
    region.length === 0 ||
    !region.some(item =>
      item.translations.rus.common.toLowerCase().includes(locationData.location.toLowerCase())
    ) ||
    locationData.city === '' ||
    cities.length === 0 ||
    !cities.some(item =>
      item.name.toLowerCase().includes(locationData.city.toLowerCase())
    )
  );
};
