import React, {useEffect, useState} from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import FileInput from '../../../components/FileInput/FileInput.tsx';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {useAppSelector} from '../../../app/hooks.ts';
import {selectUser} from '../usersSlice.ts';

const ProfileEdit = () => {
  const user = useAppSelector(selectUser);

  const [userData, setUserData] = useState({
    email: '',
    displayName: '',
    image: '',
  });

  useEffect(() => {
    if (user) {
      setUserData((prevState) => ({
        ...prevState,
        email: user.email,
        displayName: user.displayName,
        image: user.image,
      }));
    }
  }, [user]);

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
  };

  return (
    <Box component="form" onSubmit={handleSubmit} className="opening-edit-profile-window">
      <TextField
        required
        label="Email"
        name="email"
        type="email"
        value={userData.email}
        placeholder="email@email.com"
      />
      <TextField
        required
        label="Отображаемое имя"
        name="displayName"
        type="text"
        value={userData.displayName}
      />
      <Typography component="div" sx={{ display: "flex", alignItems: "center" }}>
        <AddAPhotoIcon fontSize="large" />
        <FileInput name="file" label="Загрузить аватар" onChange={fileInputChangeHandler} />
      </Typography>

      <Button type="submit">
        Изменить
      </Button>
    </Box>
  );
};

export default ProfileEdit;