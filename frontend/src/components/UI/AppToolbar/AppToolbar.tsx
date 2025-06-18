import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  debounce,
  Grid,
  styled,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import UserMenu from './UserMenu';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/users/usersSlice';
import { NavLink, useLocation } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import GuestMenu from './GuestMenu';
import { appRoutes } from '../../../utils/constants.ts';
import iconAddInstitutions from '../../../../public/createLocation.png';
import iconSearch from '../../../../public/searchIcon.png';
import '../../../component.css';
import {
  selectLocation,
  selectLocationLoading,
  selectUpdateLocationLoading
} from '../../../features/maps/locationSlice.ts';
import { LocationTypes } from '../../../types/types.Location.ts';
import axiosApi from '../../../utils/axiosApi.ts';
import {
  changeMyLocationThunk,
  createMyLocationThunk,
  getMyLocationThunk
} from '../../../features/maps/locationThunk.ts';
import Search from '../../Searchs/Search.tsx';

const Link = styled(NavLink)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit',
  },
});

type countryTypes = {
  altSpellings: string[];
  name: {
    common: string;
  };
  translations: {
    rus: {
      common: string;
    }
  }
  flags: {
    svg: string;
  }
}

const AppToolbar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const locationSelect = useAppSelector(selectLocation); //получем местоположение
  const isLoading = useAppSelector(selectLocationLoading);
  const isLocationUpdateLoading = useAppSelector(selectUpdateLocationLoading);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationBlock, setLocationBlock] = useState(false); //открывает и закрывает "Добавить (регион, город)"
  const [locationData, setLocationData] = useState<LocationTypes>({
    location: '',
    city: '',
    altSpellings: [],
  });
  const [region, setRegion] = useState<countryTypes[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [cities, setCities] = useState<{ name: string }[]>([]);
  const [isFocusedCity, setIsFocusedCity] = useState(false);

  useEffect(() => {
    // Провереям если есть пользователь то отправляется запрос
    if (user) {
      dispatch(getMyLocationThunk(user._id));
    }
  }, [user, dispatch]);

  // Callback для получении до 10 стран по первым введенным буквам
  const getCountry = useCallback(async (query: string) => {
    if (query.includes(' ')) { // Защита от отправки пустого запроса
      return;
    }
    const response = await axiosApi.get<countryTypes[]>(`https://restcountries.com/v3.1/name/${query}`);
    const filterData = response.data
      .filter(country => country.translations.rus.common.includes(query)) // Получаем страны с похожими начальными названиями
      .slice(0, 9); // Ограничиваем результат массива до 9

    setRegion(filterData); // Задаем состояние
  }, [setRegion]);

  const debounceGetCountry = useRef(debounce(getCountry, 300)).current;

  useEffect(() => {
    const regions = async () => {
      // При изменении ключа location выполняется функция getCountry для получении 10 стран
      if (locationData.location) {
        await debounceGetCountry(locationData.location);

        setLocationData((prevState) => ({
          ...prevState,
          altSpellings: [],
          city: '',
        }));

        // сбрасывает список городов
        setCities((prevState) => (prevState.slice(0, 0)));

        // Если location равна хотя бы одному из списка стран, то его данные сохраняются
        region.some((item) => (
          item.translations.rus.common === locationData.location &&
            setLocationData((prevState) => ({
              ...prevState,
              location: item.translations.rus.common,
              altSpellings: item.altSpellings,
            }))
        ));
      }
    };
    void regions();
  }, [locationData.location, dispatch]);

  const getCitiesList = useCallback(async (query: string, altSpelling: string) => {
    if (query.includes(' ')) {
      return;
    }
    const response = await axiosApi.get(
      `https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=${altSpelling}&format=json`
    );

    const cities = response.data.filter((city: { addresstype: string }) => city.addresstype === 'city' || city.addresstype === 'town');

    setCities(cities);
  }, [locationData, setCities]);

  const debouncedCityList = useRef(debounce(getCitiesList, 300)).current;

  useEffect(() => {
    const fetchUrl = async () => {
      if (locationData.city) await debouncedCityList(locationData.city, locationData.altSpellings[0]);
    };

    void fetchUrl();
  }, [locationData.city]);

  if (user === undefined) {
    return null;
  }

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleRegionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLocationData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Задает название для location после нажатие на одну из списков стран
  const onClickCountry = (value: string, countryCode: string[]) => {
    setLocationData((prevState) => ({
      ...prevState,
      location: value,
      altSpellings: countryCode,
    }));
  };

  const onClickCity = (value: string) => {
    setLocationData((prevState) => ({
      ...prevState,
      city: value,
    }));
  };

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();

    if (!locationSelect) {
      dispatch(createMyLocationThunk({ locationData: locationData, locationId: locationSelect }));
    } else {
      if (locationSelect._id)
        dispatch(changeMyLocationThunk({ locationData: locationData, locId: locationSelect._id }));
    }
    setLocationBlock(false);

    setTimeout(() => {
      if (user) {
        dispatch(getMyLocationThunk(user._id));
      }
    }, 500);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          backgroundColor: user ? 'transparent' : '',
          boxShadow: user ? 'none' : '',
          color: !user ? '#fff' : '',
        }}
      >
        <Toolbar>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link
                to={appRoutes.home}
                sx={{
                  background: user && "#fff",
                  p: "12px",
                  borderRadius: 2,
                  boxShadow: user && "1px 1px 1px 1px rgba(34, 60, 80, 0.3)",
                  fontSize: "18px",
                }}
              >
                Map eye
              </Link>
            </Typography>
            {location.pathname === '/institution/create' && (
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
                        sx={{background: '#fff' }}
                      />
                      {isFocused && (
                        <div style={{position: "absolute", width: "100%", background: "#fff"}}>
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
                            sx={{background: '#fff'}}
                            disabled={isLoading || locationData.location === ''}
                            error={!cities.some(item => item.name.toLowerCase().includes(locationData.city.toLocaleLowerCase()))}
                            helperText={
                              !cities.some(item => item.name.toLowerCase().includes(locationData.city.toLocaleLowerCase())) &&
                              'введите название города'
                            }
                          />
                          {isFocusedCity && (
                            <div style={{position: 'absolute', width: '100%', background: '#fff'}}>
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
                        disabled={
                          isLocationUpdateLoading ||
                          locationData.location === '' ||
                          region.length === 0 ||
                          !region.some(item => item.translations.rus.common.toLowerCase().includes(locationData.location.toLowerCase())) || // хотя бы 1 из списка должно совпадать
                          locationData.city === '' ||
                          cities.length === 0 ||
                          !cities.some(item => item.name.toLowerCase().includes(locationData.city.toLocaleLowerCase())) // точно так же как и с странами
                        }
                      >
                        сохранить {isLocationUpdateLoading && (<CircularProgress sx={{ml: 1}}/>)}
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
            )}
            {location.pathname === '/' && user && (
              <Box sx={{ mr: 2, display: "flex", gap: 1 }}>
                <Typography className="main-nav" component="div">
                  <Link to={appRoutes.profile} sx={{ mt: 1 }}>
                    <img
                      src={iconSearch}
                      alt="Error photo"
                      title="Поиск"
                      style={{
                        width: "25px",
                        height: "25px",
                      }}
                    />
                  </Link>
                  <Link to={appRoutes.createInstitution} sx={{mt: 1, mr: 1}}>
                    <img
                      src={iconAddInstitutions}
                      alt="Error photo"
                      title="Создать заведение"
                      style={{
                        width: "25px",
                        height: "25px",
                      }}
                    />
                  </Link>
                </Typography>
              </Box>
            )}
            {user && location.pathname === '/' ? <UserMenu user={user}/> : location.pathname === '/' && <GuestMenu />}
          </Grid>
        </Toolbar>
      </AppBar>
      <DrawerMenu open={mobileOpen} toggleDrawer={handleDrawerToggle} />
    </Box>
  );
};

export default AppToolbar;
