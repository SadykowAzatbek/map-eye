import ProfileEdit from './components/ProfileEdit.tsx';
import { useOpenEditProfile } from '../../components/UI/AppToolbar/components/UseOpenEditProfile.tsx';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import EstablishmentCardInfo from '../establishment/components/EstablishmentCardInfo.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectEstablishments, selectLoadingEstablishments } from '../establishment/EstablishmentSlice.ts';
import { useEffect } from 'react';
import { getEstablishment } from '../establishment/EstablishmentThunk.ts';

const ClientNavigation = () => {
  const isOpen = useOpenEditProfile((state) => state.isOpen);
  const dispatch = useAppDispatch();
  const myEstablishments = useAppSelector(selectEstablishments);
  const myEstablishmentsLoading = useAppSelector(selectLoadingEstablishments);

  useEffect(() => {
    const getEstablishmentFetch = async () => {
      dispatch(getEstablishment());
    }

    void getEstablishmentFetch();
  }, [dispatch]);

  return (
    <Box className="container" sx={{ marginTop: "100px", position: "relative" }}>
      {isOpen && (<ProfileEdit />)}
      <Typography component="div" variant="h3">
        <b>Мое заведение</b>
      </Typography>
      <Grid container alignItems="stretch" spacing={2}>
        {myEstablishments.map((establishment) => (
          <Grid item xs={6} key={establishment._id}>
            {!myEstablishmentsLoading ?
              <EstablishmentCardInfo establishments={establishment} />
              : <CircularProgress />}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ClientNavigation;
