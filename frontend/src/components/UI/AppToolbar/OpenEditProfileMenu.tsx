import React from 'react';
import { Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useOpenEditProfile } from './config/UseOpenEditProfile.tsx';
import { User } from '../../../types/types.User';

interface Props {
  user: User;
}

const OpenEditProfileMenu: React.FC<Props> = ({ user }) => {
  const toggleOpen = useOpenEditProfile((state) => state.toggleOpen);
  const isOpen = useOpenEditProfile((state) => state.isOpen);

  return (
    <>
      <Typography
        component="div"
        className="main-nav"
        sx={{ cursor: "pointer", p: 1 }}
        onClick={toggleOpen}
      >
        {!isOpen ? `Редактировать` : `Отменить`}
        {!isOpen &&
          (!user.image ?
              <AccountCircleIcon />
              : <img
                src={'http://localhost:8000/' + user.image}
                alt="Аватарка"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
          )
        }
      </Typography>
    </>
  )
};

export default OpenEditProfileMenu;