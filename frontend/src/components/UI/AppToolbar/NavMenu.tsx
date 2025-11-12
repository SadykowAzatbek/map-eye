import { Box, styled, Tooltip, Typography } from '@mui/material';
import { appRoutes } from '../../../utils/constants.ts';
import SearchIcon from '@mui/icons-material/Search';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
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
          <Tooltip title="ПОИСК">
            <SearchIcon />
          </Tooltip>
        </Link>
        <Link to={appRoutes.createEstablishment} sx={{ mt: 1, mr: 1 }}>
          <Tooltip title="СОЗДАТЬ ЗАВЕДЕНИЕ">
            <AddLocationAltIcon />
          </Tooltip>
        </Link>
      </Typography>
    </Box>
  );
};

export default NavMenu;