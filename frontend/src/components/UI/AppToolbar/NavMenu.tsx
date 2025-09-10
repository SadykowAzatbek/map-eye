import { Box, styled, Typography } from '@mui/material';
import { appRoutes } from '../../../utils/constants.ts';
import iconSearch from '../../../../public/searchIcon.png';
import iconAddEstablishments from '../../../../public/createLocation.png';
import { NavLink } from 'react-router-dom';

const Link = styled(NavLink)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit',
  },
});

const NavMenu = () => {
  return (
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
        <Link to={appRoutes.createEstablishment} sx={{ mt: 1, mr: 1 }}>
          <img
            src={iconAddEstablishments}
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
  );
};

export default NavMenu;