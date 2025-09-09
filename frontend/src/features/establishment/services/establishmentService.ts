import axiosApi from '../../../utils/axiosApi';
import { searchTable } from '../../../types/types.Establishments';

export const searchStreetService = async (
  location: string,
  city: string,
  address: string
): Promise<searchTable[]> => {
  const response = await axiosApi.get(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      `${location},${city},${address}`
    )}&format=json`
  );

  return response.data
    .filter((elem: { addresstype: string }) => elem.addresstype === 'building')
    .map((elem: { display_name: string; lat: string; lon: string }) => {
      const parts = elem.display_name.split(',').map((part) => part.trim());
      const shortAddress = parts.slice(0, 3).join(', ');

      return {
        displayName: shortAddress,
        lat: elem.lat,
        lon: elem.lon,
      };
    });
};
