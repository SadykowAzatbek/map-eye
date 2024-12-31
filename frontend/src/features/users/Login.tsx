import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Container,
  Grid,
  IconButton,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { appRoutes, regEx } from '../../utils/constants';

import { login } from './usersThunks';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  selectLoginError,
  selectLoginLoading,
  setLoginError,
} from './usersSlice';
import { LoginMutation } from '../../types/types.User';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectLoginError);
  const loading = useAppSelector(selectLoginLoading);

  const [state, setState] = useState<LoginMutation>({
    email: '',
    password: '',
  });

  const [showPass, setShowPass] = useState(false);
  const [emailIsValid, setEmailIsValid] = useState<boolean>(true);
  const [emailLabel, setEmailLabel] = useState<string>('');

  const handleClickShowPassword = () => setShowPass((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (regEx.test(state.email)) {
        setEmailIsValid(true);
      } else if (!regEx.test(state.email) && state.email !== '') {
        setEmailLabel('Неверный формат электронной почты!');
        setEmailIsValid(false);
        return;
      }

      await dispatch(login(state)).unwrap();
      navigate(appRoutes.home);
    } catch (e) {
      setEmailIsValid(false);
      setEmailLabel('Неверный e-mail или пароль, пожалуйста повторите!');
      console.error(e);
    }
  };

  useEffect(() => {
    dispatch(setLoginError(null));
  }, [dispatch]);

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 7 }}>
      <Grid container alignItems="center">
        <Grid item xs={12}>
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Войти в личный кабинет
            </Typography>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error" sx={{ mt: 3, width: '100%' }}>
                  {error.message}
                </Alert>
              </Grid>
            )}

            <Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Email"
                    name="email"
                    type="email"
                    value={state.email}
                    placeholder="email@email.com"
                    autoComplete="current-email"
                    onChange={inputChangeHandler}
                    error={!emailIsValid}
                    helperText={emailLabel}
                    sx={{
                      '.MuiFormHelperText-root': {
                        color: emailIsValid ? 'inherit' : '#d32f2f',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="password"
                    label="Пароль"
                    type={showPass ? 'text' : 'password'}
                    fullWidth
                    autoComplete="current-password"
                    value={state.password}
                    onChange={inputChangeHandler}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPass ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} textAlign="center">
                <LoadingButton
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1 }}
                  disableElevation
                  disabled={loading}
                  loading={loading}
                >
                  Войти
                </LoadingButton>
              </Grid>
              <Grid item xs={12} textAlign="center">
                <Link
                  component={RouterLink}
                  to={appRoutes.register}
                  variant="body2"
                >
                  Еще нет аккаунта? Регистрация
                </Link>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;