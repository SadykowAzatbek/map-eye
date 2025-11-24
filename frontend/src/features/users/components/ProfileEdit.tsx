import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import FileInput from '../../../components/FileInput/FileInput.tsx';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectUser, selectUserEditLoading } from '../usersSlice.ts';
import { profileEditThunk } from '../usersThunks.ts';
import { useNavigate } from 'react-router-dom';
import { useOpenEditProfile } from '../../../components/UI/AppToolbar/config/UseOpenEditProfile.tsx';

const ProfileEdit = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userEditLoading = useAppSelector(selectUserEditLoading);
  const navigate = useNavigate();
  const toggleOpen = useOpenEditProfile((state) => state.toggleOpen);

  const [userData, setUserData] = useState({
    email: '',
    displayName: '',
    image: null,
  });

  useEffect(() => {
    if (user) {
      setUserData((prevState) => ({
        ...prevState,
        email: user.email,
        displayName: user.displayName,
      }));
    }
  }, [user]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files) {
      setUserData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user)
      dispatch(profileEditThunk(userData));

    navigate('/');
  };

  return (
    <div>
      <div onClick={toggleOpen} className="profile-edit-gray-background" />
        <Box component="form" onSubmit={handleSubmit} className="opening-edit-profile-window">
          <TextField
            required
            label="Email"
            name="email"
            type="email"
            value={userData.email}
            onChange={inputChangeHandler}
            placeholder="email@email.com"
          />
          <TextField
            required
            label="Отображаемое имя"
            name="displayName"
            type="text"
            value={userData.displayName}
            onChange={inputChangeHandler}
          />
          <Typography component="div" display="flex" alignItems="center" gap={1}>
            <AddAPhotoIcon fontSize="large" />
            <FileInput name="image" label="Загрузить аватар" onChange={fileInputChangeHandler} />
          </Typography>

          <Button type="submit">
            Изменить {userEditLoading && <CircularProgress />}
          </Button>
        </Box>
    </div>
  );
};

export default ProfileEdit;