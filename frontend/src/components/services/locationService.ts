import axiosApi from '../../utils/axiosApi.ts';
import { CountryTypes } from '../../types/types.Location.ts';

export const getCountryService = async (query: string) => {
  const response = await axiosApi.get<CountryTypes[]>(`https://restcountries.com/v3.1/name/${query}`);

  return response.data
    .filter(country => country.translations.rus.common.includes(query)) // Получаем страны с похожими начальными названиями
    .slice(0, 9); // Ограничиваем результат массива до 9
};

export const getCitiesService = async (query: string, altSpelling: string) => {
  const response = await axiosApi.get(
    `https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=${altSpelling}&format=json`
  );

  return response.data.filter((city: { addresstype: string }) => city.addresstype === 'city' || city.addresstype === 'town');
};
