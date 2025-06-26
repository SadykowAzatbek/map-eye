import React, { useState } from 'react';
import {Box, Button, TextField, Typography} from '@mui/material';
import FileInput from '../../../components/FileInput/FileInput.tsx';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

const ProfileEdit = () => {
  const [userData, setUserData] = useState({
    email: '',
    displayName: '',
    image: '',
  });
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
        value=""
        placeholder="email@email.com"
      />
      <TextField
        required
        label="Отображаемое имя"
        name="displayName"
        type="text"
        value=""
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