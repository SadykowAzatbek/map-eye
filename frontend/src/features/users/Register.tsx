import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  IconButton,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  selectRegisterError,
  selectRegisterLoading,
  setRegisterError,
} from './usersSlice';
import { register } from './usersThunks';
import { appRoutes, regEx } from '../../utils/constants';
import InputAdornment from '@mui/material/InputAdornment';
import { RegisterMutation } from '../../types/types.User';

const initialState: RegisterMutation = {
  email: '',
  password: '',
  displayName: '',
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectRegisterError);
  const loading = useAppSelector(selectRegisterLoading);

  const [state, setState] = useState<RegisterMutation>(initialState);
  const [showPass, setShowPass] = useState(false);
  const [passLabel, setPassLabel] = useState<string>(
    'Длина пароля должна быть не менее 8 символов',
  );
  const [passIsValid, setPassIsValid] = useState<boolean | undefined>(
    undefined,
  );
  const [emailIsValid, setEmailIsValid] = useState<boolean>(true);
  const [emailLabel, setEmailLabel] = useState<string>('');

  const getFieldError = (fieldName: string) => {
    try {
      return error?.errors[fieldName].message;
    } catch {
      return undefined;
    }
  };

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => {
      if (name === 'password' && value.length >= 8) {
        setPassIsValid(true);
        setPassLabel('Подходящий пароль');
      }

      return { ...prevState, [name]: value };
    });
  };

  const isFormValid = () => {
    return (
      state.email && state.password
    );
  };

  const handleClickShowPassword = () => setShowPass((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  useEffect(() => {
    dispatch(setRegisterError(null));
  }, [dispatch]);

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (state.password.length >= 1 && state.password.length < 8) {
        setPassLabel('Пароль слишком короткий!');
        setPassIsValid(false);
        return;
      }

      if (regEx.test(state.email)) {
        setEmailIsValid(true);
      } else if (!regEx.test(state.email) && state.email !== '') {
        setEmailLabel('Неверный формат электронной почты!');
        setEmailIsValid(false);
        return;
      }

      await dispatch(register(state)).unwrap();
      navigate(appRoutes.home);
      setState(initialState);
    } catch (e) {
      setEmailIsValid(false);
      setEmailLabel('Такой пользователь уже существует!');
      console.error(e);
    }
  };

  return (
    <Container component="main">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 15,
        }}
      >
        <Typography component="h1" variant="h5">
          Регистрация
        </Typography>
        <Box
          component="form"
          onSubmit={submitFormHandler}
          sx={{ mt: 3, width: '100%' }}
        >
          <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Grid item xs={7}>
              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                value={state.email}
                placeholder="email@email.com"
                autoComplete="new-email"
                onChange={inputChangeHandler}
                error={Boolean(getFieldError('email') || !emailIsValid)}
                helperText={
                  getFieldError('email') ? getFieldError('email') : emailLabel
                }
                sx={{
                  '.MuiFormHelperText-root': {
                    color: emailIsValid ? 'inherit' : '#d32f2f',
                  },
                }}
              />
            </Grid>
            <Grid item xs={7}>
              <TextField
                fullWidth
                required
                name="displayName"
                label="Отображаемое имя"
                type="text"
                value={state.displayName}
                onChange={inputChangeHandler}
              />

            </Grid>
            <Grid item xs={7}>
              <TextField
                fullWidth
                required
                name="password"
                label="Пароль"
                type={showPass ? 'text' : 'password'}
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
                value={state.password}
                autoComplete="new-password"
                onChange={inputChangeHandler}
                error={Boolean(
                  getFieldError('password') || passIsValid === false,
                )}
                helperText={
                  getFieldError('password')
                    ? getFieldError('password')
                    : passLabel
                }
                sx={{
                  '.MuiFormHelperText-root': {
                    color: passIsValid ? 'primary.main' : 'inherit',
                  },
                }}
              />
            </Grid>
            <Grid
              container
              item
              direction="column"
              justifyContent="center"
              lg={12}
            >
              <Grid item>
              </Grid>
              <Grid item textAlign="center">
                <LoadingButton
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1 }}
                  disableElevation
                  disabled={!isFormValid() || loading}
                  loading={loading}
                >
                  Зарегистрироваться
                </LoadingButton>
              </Grid>
              <Grid item textAlign="center">
                <Link
                  component={RouterLink}
                  to={appRoutes.login}
                  variant="body2"
                >
                  Уже зарегистрированы? Войти
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
export default Register;