import { useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Grid,
  styled,
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
import '../../../component.css';
import {
  selectLocation,
  selectLocationLoading,
  selectUpdateLocationLoading
} from '../../../features/maps/locationSlice.ts';
import { getMyLocationThunk } from '../../../features/maps/locationThunk.ts';
import OpenEditProfileMenu from './OpenEditProfileMenu.tsx';
import CreateLocation from './components/CreateLocation.tsx';
import NavMenu from './NavMenu.tsx';

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
  const locationSelect = useAppSelector(selectLocation);
  const isLoading = useAppSelector(selectLocationLoading);
  const isLocationUpdateLoading = useAppSelector(selectUpdateLocationLoading);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(getMyLocationThunk(user._id));
    }
  }, [user, dispatch]);

  if (user === undefined) {
    return null;
  }

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav"
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

            {location.pathname === appRoutes.createEstablishment && (
              <CreateLocation
                isLoading={isLoading}
                isLocationUpdateLoading={isLocationUpdateLoading}
                locationSelect={locationSelect}
              />
            )}

            {location.pathname === '/' && user && <NavMenu />}
            {location.pathname === appRoutes.profile && user && <OpenEditProfileMenu />}
            {user && location.pathname === '/' ? (
              <UserMenu user={user} />
            ) : (
              location.pathname === '/' && <GuestMenu />
            )}
          </Grid>
        </Toolbar>
      </AppBar>
      <DrawerMenu open={mobileOpen} toggleDrawer={handleDrawerToggle} />
    </Box>
  );
};

export default AppToolbar;
