import React from 'react';
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../../features/users/usersSlice';
import { logout } from '../../../features/users/usersThunks';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { appRoutes } from '../../../utils/constants.ts';

interface Props {
  open: boolean;
  toggleDrawer: React.MouseEventHandler;
  window?: () => Window;
}

const drawerWidth = 320;
const DrawerMenu: React.FC<Props> = ({ open, toggleDrawer, window }) => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isSmallScreen = useMediaQuery('(max-width:850px)');
  const isExtraSmallScreen = useMediaQuery('(max-width:599px)');
  const handleLogOut = async () => {
    navigate(appRoutes.login);
    await dispatch(logout());
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Drawer
      container={container}
      variant="temporary"
      open={open && isSmallScreen}
      onClose={toggleDrawer}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
        },
      }}
    >
      <Box onClick={toggleDrawer}>
        <Typography variant="h6" sx={{ mx: 2, my: 2 }}>
          TechGear Logistics
        </Typography>
        <Divider />
        <List>
          {user && (
            <>
              <Divider />
              {isExtraSmallScreen && (
                <ListItem disableGutters>
                  <ListItemButton
                    onClick={handleLogOut}
                    sx={{ borderRadius: 2 }}
                  >
                    <ListItemIcon>
                      <LogoutIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        fontSize: 16,
                        color: 'primary',
                      }}
                    >
                      Выйти
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              )}
            </>
          )}
          {!user && (
            <Stack direction="column" px={2} spacing={2} my={2}>
              <Button
                fullWidth
                component="a"
                href={appRoutes.register}
                variant="contained"
              >
                Регистрация
              </Button>
              <Button
                fullWidth
                component="a"
                href={appRoutes.login}
                variant="contained"
              >
                Войти
              </Button>
            </Stack>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default DrawerMenu;
