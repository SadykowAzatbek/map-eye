import { Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useOpenEditProfile } from './components/UseOpenEditProfile.tsx';

const OpenEditProfileMenu = () => {
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
        {!isOpen && (<AccountCircleIcon />)}
      </Typography>
    </>
  )
};

export default OpenEditProfileMenu;