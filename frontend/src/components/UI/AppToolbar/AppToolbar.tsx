import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  AppBar,
  Box, Button,
  CssBaseline,
  Grid,
  styled, TextField,
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
import { selectLocation, selectLocationLoading } from '../../../features/maps/locationSlice.ts';
import { LocationTypes } from '../../../types/types.Location.ts';
import axiosApi from '../../../utils/axiosApi.ts';
import {
  changeMyLocationThunk,
  createMyLocationThunk,
  getMyLocationThunk
} from '../../../features/maps/locationThunk.ts';

const Link = styled(NavLink)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit',
  },
});

type countryTypes = {
  name: {
    common: string;
  };
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationBlock, setLocationBlock] = useState(false); //открывает и закрывает "Добавить (регион, город)"
  const [locationData, setLocationData] = useState<LocationTypes>({
    location: '',
    city: '',
  });
  const [region, setRegion] = useState<countryTypes[]>([]);

  console.log(region);
  console.log(locationSelect);

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

  // Функция для получении до 10 стран по первым введенным буквам
  const getCountry = async (query: string) => {
    const response = await axiosApi.get<countryTypes[]>(`https://restcountries.com/v3.1/name/${query}`);
    const filterData = response.data
      .filter(country => country.name.common.includes(query)) // Получаем страны с похожими начальными названиями
      .slice(0, 9); // Ограничиваем результат массива до 9

    setRegion(filterData); // Задаем состояние
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const regions = async () => {
      // Провереям если есть пользователь то отправляется запрос
      if (user) {
        dispatch(getMyLocationThunk(user._id));
      }
      // При изминении ключа location выполняется функция getCountry
      if (locationData.location) {
        await getCountry(locationData.location);
      }
    }
    void regions();
  }, [user, dispatch]); // убрал locationData из зависимостей, чтобы при изменении состояние не отправлял вновь запросы на сервер

  const handleCreateLocation = () => {

    // Если locationSelect равен null то отправляется запрос на создание местоположении
    if (!locationSelect) {
      dispatch(createMyLocationThunk({ locationData: locationData, locationId: locationSelect }));
      // Иначе  задать новое состояние
    } else {
      setLocationData(locationSelect);
    }
  };

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();

    setLocationBlock(false);
    if (locationData._id) {
      dispatch(changeMyLocationThunk({ locationData: locationData, locId: locationData._id }));
    }
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
                  <>
                    <TextField
                      label="Страна"
                      name="location"
                      type="text"
                      value={locationData.location}
                      onChange={handleRegionChange}
                      sx={{ background: '#fff' }}
                    />
                    <TextField
                      label="Город"
                      name="city"
                      type="text"
                      value={locationData.city}
                      onChange={handleRegionChange}
                      sx={{ background: '#fff' }}
                      disabled={locationData.location === ''}
                    />
                    <Button type="submit">сохранить</Button>
                  </>
                ) : (
                  <Typography
                    component="div"
                    className="main-nav"
                    onClick={async () => {
                      setLocationBlock(true);
                      handleCreateLocation();
                    }}
                    sx={{ cursor: "pointer", p: 1 }}
                  >
                    {!locationSelect ? 'Добавить (регион, город)' : 'Изменить (регион, город)'}
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
            {user && location.pathname === '/' ? <UserMenu user={user}/> : location.pathname === '/' && <GuestMenu/>}
          </Grid>
        </Toolbar>
      </AppBar>
      <DrawerMenu open={mobileOpen} toggleDrawer={handleDrawerToggle}/>
    </Box>
  );
};

export default AppToolbar;
