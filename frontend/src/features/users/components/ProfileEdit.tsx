import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import FileInput from '../../../components/FileInput/FileInput.tsx';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { selectUser, selectUserEditLoading } from '../usersSlice.ts';
import { profileEditThunk } from '../usersThunks.ts';
import { useNavigate } from 'react-router-dom';

const ProfileEdit = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userEditLoading = useAppSelector(selectUserEditLoading);
  const navigate = useNavigate();

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
    <div className="profile-edit-gray-background">
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
        <Typography component="div" sx={{ display: "flex", alignItems: "center" }}>
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