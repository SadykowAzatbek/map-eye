import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { logout } from '../../../features/users/usersThunks';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { User } from '../../../types/types.User';
import { appRoutes } from '../../../utils/constants.ts';

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const handleLogOut = async () => {
    navigate(appRoutes.login);
    await dispatch(logout());
  };

  return (
    <>
      <Stack direction="row" alignItems="center" sx={{
        background: "#fff",
        p: "0px 12px",
        borderRadius: 1,
        boxShadow: "1px 1px 1px 1px rgba(34, 60, 80, 0.3)",
      }}>
        <Typography
          id="username"
          color="inherit"
          onClick={handleClick}
          sx={{ cursor: "pointer" }}
        >
          {user.displayName}
        </Typography>
        <IconButton
          onClick={handleClick}
          sx={{ display: 'flex', gap: 1 }}
          disableRipple
        >
          <AccountCircleIcon sx={{ width: 24, height: 24 }} />
        </IconButton>
      </Stack>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        keepMounted
        sx={{ mt: 2 }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleLogOut}>Выйти</MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
