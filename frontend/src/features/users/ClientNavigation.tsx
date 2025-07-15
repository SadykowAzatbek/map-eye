import ProfileEdit from './components/ProfileEdit.tsx';
import { useOpenEditProfile } from '../../components/UI/AppToolbar/components/UseOpenEditProfile.tsx';
import { Typography } from '@mui/material';
import InstitutionCardInfo from '../institutions/components/InstitutionCardInfo.tsx';

const ClientNavigation = () => {
const isOpen = useOpenEditProfile((state) => state.isOpen);

  return (
    <div className="container" style={{ marginTop: "100px", position: "relative" }}>
      {isOpen && (<ProfileEdit />)}
      <Typography component="div" variant="h3">
        <b>Мое заведение</b>
      </Typography>
      <div>
        <InstitutionCardInfo />
      </div>
    </div>
  );
};

export default ClientNavigation;
