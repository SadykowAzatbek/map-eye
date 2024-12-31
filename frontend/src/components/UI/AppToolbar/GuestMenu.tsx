import React from 'react';
import { Button, Grid } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { appRoutes } from '../../../utils/constants.ts';

const GuestMenu: React.FC = () => {
  return (
    <Grid item>
      <Button component={NavLink} to={appRoutes.register} color="inherit">
        Регистрация
      </Button>
      <Button component={NavLink} to={appRoutes.login} color="inherit">
        Войти
      </Button>
    </Grid>
  );
};

export default GuestMenu;
