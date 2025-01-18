import { useState } from 'react';
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
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/users/usersSlice';
import { NavLink, useLocation } from 'react-router-dom';
import DrawerMenu from './DrawerMenu';
import GuestMenu from './GuestMenu';
import { appRoutes } from '../../../utils/constants.ts';
import iconAddInstitutions from '../../../../public/createLocation.png';
import iconSearch from '../../../../public/searchIcon.png';
import '../../../component.css';
import {selectLocation} from '../../../features/maps/locationSlice.ts';

const Link = styled(NavLink)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit',
  },
});

const AppToolbar = () => {
  const user = useAppSelector(selectUser);
  const locationSelect = useAppSelector(selectLocation);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationBlock, setLocationBlock] = useState(false);
  const location = useLocation();

  if (user === undefined) {
    return null;
  }

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
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
              <Box component="form" sx={{ display: "flex", alignItems: "center", mt: 1, mr: 2 }}>
                {locationBlock ? (
                  <>
                    <TextField
                      label="Регион"
                      name="region"
                      type="text"
                      value={locationSelect.location}
                      sx={{ background: '#fff' }}
                    />
                    <TextField
                      label="Город"
                      name="city"
                      type="text"
                      value={locationSelect.city}
                      sx={{ background: '#fff' }}
                    />
                    <Button type="submit">сохранить</Button>
                  </>
                ) : (
                  <Typography component="div" className="main-nav" onClick={() => setLocationBlock(true)} sx={{ cursor: "default", p: 1 }}>
                    {/*изменить на Link и отправлять в профиль редактирование*/}
                    Изменить (регион, город)
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
