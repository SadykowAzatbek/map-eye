import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Box, Button, CircularProgress, debounce, TextField, Typography } from '@mui/material';
import Search from '../../../Searchs/Search.tsx';
import { CountryTypes, LocationTypes } from '../../../../types/types.Location.ts';
import { isSaveDisabled } from '../config/isSaveLocationDiabled.ts';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks.ts';
import { selectUser } from '../../../../features/users/usersSlice.ts';
import { initialLocationState } from '../config/initialLocationState.ts';
import { getCitiesService, getCountryService } from '../../../../services/locationService.ts';
import {
  changeMyLocationThunk,
  createMyLocationThunk,
  getMyLocationThunk
} from '../../../../features/maps/locationThunk.ts';

const CreateLocation: React.FC<{
  isLoading: boolean;
  isLocationUpdateLoading: boolean;
  locationSelect: LocationTypes | null;
}> = ({ isLoading, isLocationUpdateLoading, locationSelect }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const [locationBlock, setLocationBlock] = useState(false);
  const [locationData, setLocationData] = useState(initialLocationState);
  const [region, setRegion] = useState<CountryTypes[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [cities, setCities] = useState<{ name: string }[]>([]);
  const [isFocusedCity, setIsFocusedCity] = useState(false);

  // страны
  const getCountry = useCallback(async (query: string) => {
    if (!query.includes(' ')) {
      const country = await getCountryService(query);
      setRegion(country);
    }
  }, []);
  const debounceGetCountry = useRef(debounce(getCountry, 300)).current;

  useEffect(() => {
    if (locationData.location) {
      void debounceGetCountry(locationData.location);
      setLocationData((prev) => ({ ...prev, altSpellings: [], city: '' }));
      setCities([]);

      region.some((item) => (
        item.translations.rus.common === locationData.location &&
        setLocationData((prev) => ({
          ...prev,
          location: item.translations.rus.common,
          altSpellings: item.altSpellings,
        }))
      ));
    }
  }, [locationData.location]);

  // города
  const getCitiesList = useCallback(async (query: string, altSpelling: string) => {
    if (!query.includes(' ')) {
      const cities = await getCitiesService(query, altSpelling);
      setCities(cities);
    }
  }, []);
  const debouncedCityList = useRef(debounce(getCitiesList, 300)).current;

  useEffect(() => {
    if (locationData.city) {
      void debouncedCityList(locationData.city, locationData.altSpellings[0]);
    }
  }, [locationData.city]);

  // хэндлеры
  const handleRegionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocationData((prev) => ({ ...prev, [name]: value }));
  };

  const onClickCountry = (value: string, codes: string[]) => {
    setLocationData((prev) => ({ ...prev, location: value, altSpellings: codes }));
  };

  const onClickCity = (value: string) => {
    setLocationData((prev) => ({ ...prev, city: value }));
  };

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    if (!locationSelect) {
      dispatch(createMyLocationThunk({ locationData, locationId: locationSelect }));
    } else if (locationSelect._id) {
      dispatch(changeMyLocationThunk({ locationData, locId: locationSelect._id }));
    }
    setLocationBlock(false);

    setTimeout(() => {
      if (user) dispatch(getMyLocationThunk(user._id));
    }, 500);
  };
  return (
    <Box component="form" onSubmit={handleSubmitForm} sx={{ display: "flex", alignItems: "center", mt: 1, mr: 2 }}>
      {locationBlock ? (
        <div style={{ display: "flex" }}>
          <div style={{ position: "relative" }}>
            <TextField
              label="Страна"
              name="location"
              type="text"
              autoComplete="off"
              value={isLoading ? 'Загрузка...' : locationData.location}
              onChange={handleRegionChange}
              onFocus={() => setIsFocused(true)} // если в фокусе
              onBlur={() => setIsFocused(false)}
              disabled={isLoading}
              error={!region.some(item => item.translations.rus.common.toLowerCase().includes(locationData.location.toLowerCase()))}
              helperText={
                !region.some(item => item.translations.rus.common.toLowerCase().includes(locationData.location.toLowerCase())) &&
                'Страна не выбрана'
              }
              sx={{ background: '#fff' }}
            />
            {isFocused && (
              <div style={{ position: "absolute", width: "100%", background: "#fff" }}>
                {region.map((elem, i) => (
                  elem.translations.rus.common !== locationData.location &&
                  <Search
                    key={i}
                    displayName={elem.translations.rus.common}
                    onClick={() => onClickCountry(elem.translations.rus.common, elem.altSpellings)}
                    image={elem.flags.svg}
                  />
                ))}
              </div>
            )}
          </div>
          <div>
            <div style={{ display: "flex" }}>
              <div style={{ position: "relative" }}>
                <TextField
                  label="Город"
                  name="city"
                  type="text"
                  value={isLoading ? 'Загрузка...' : locationData.city}
                  onChange={handleRegionChange}
                  onFocus={() => setIsFocusedCity(true)}
                  onBlur={() => setIsFocusedCity(false)}
                  sx={{ background: '#fff' }}
                  disabled={isLoading || locationData.location === ''}
                  error={!cities.some(item => item.name.toLowerCase().includes(locationData.city.toLocaleLowerCase()))}
                  helperText={
                    !cities.some(item => item.name.toLowerCase().includes(locationData.city.toLocaleLowerCase())) &&
                    'введите название города'
                  }
                />
                {isFocusedCity && (
                  <div style={{ position: 'absolute', width: '100%', background: '#fff' }}>
                    {cities.map((elem, i) => (
                      elem.name !== locationData.city &&
                      <Search
                        key={i}
                        displayName={elem.name}
                        onClick={() => onClickCity(elem.name)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Button
              type="submit"
              disabled={isSaveDisabled(isLocationUpdateLoading, locationData, region, cities)}
            >
              сохранить {isLocationUpdateLoading && (<CircularProgress sx={{ ml: 1 }}/>)}
            </Button>
            <Button type="button" onClick={() => setLocationBlock(false)}>
              отмена
            </Button>
          </div>
        </div>
      ) : (
        <Typography
          component="div"
          className="main-nav"
          onClick={() => setLocationBlock(true)}
          sx={{ cursor: "pointer", p: 1 }}
        >
          {!locationSelect ? 'Добавить (страна, город)' : `Изменить (${locationSelect.location}, ${locationSelect.city})`}
        </Typography>
      )}
    </Box>
  );
};

export default CreateLocation;
