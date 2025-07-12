import ProfileEdit from './components/ProfileEdit.tsx';
import { useOpenEditProfile } from '../../components/UI/AppToolbar/components/UseOpenEditProfile.tsx';

const ClientNavigation = () => {
const isOpen = useOpenEditProfile((state) => state.isOpen);

  return (
    <div className="container" style={{ marginTop: "100px", position: "relative" }}>
      {isOpen && (<ProfileEdit />)}
    </div>
  );
};

export default ClientNavigation;