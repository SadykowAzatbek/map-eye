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
import { selectLocation } from '../../../features/maps/locationSlice.ts';
import { getMyLocationThunk } from '../../../features/maps/locationThunk.ts';
import { LocationTypes } from '../../../types/types.Location.ts';
import axiosApi from '../../../utils/axiosApi.ts';

const Link = styled(NavLink)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit',
  },
});

const AppToolbar = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const locationSelect = useAppSelector(selectLocation); //получем местоположение
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationBlock, setLocationBlock] = useState(false); //открывает и закрывает "Добавить (регион, город)"
  const [locationData, setLocationData] = useState<LocationTypes>({
    location: '',
    city: '',
  });

  const [region, setRegion] = useState();

  if (user === undefined) {
    return null;
  }

  console.log(locationSelect);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchUrl = async () => {
      if (user?._id && locationSelect) {
        dispatch(getMyLocationThunk(user._id));
      }
    };

    void fetchUrl();
  }, [dispatch]);

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

  const getCountry = async (query: string) => {
    const response = await axiosApi.get<{ name: { common: string } }[]>(`https://restcountries.com/v3.1/name/${query}`);
    const filterData = response.data
      .filter(country => country.name.common.includes(query)) // Получаем страны с похожими начальными названиями
      .slice(0, 9); // Ограничиваем результат массива до 9
    console.log(filterData);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const regions = async () => {
      if (locationData.location) {
        await getCountry(locationData.location);
      }
    }
    void regions();
  }, [locationData.location]);

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();

    setLocationBlock(false);
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
                  <Typography component="div" className="main-nav" onClick={() => setLocationBlock(true)} sx={{ cursor: "pointer", p: 1 }}>
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
