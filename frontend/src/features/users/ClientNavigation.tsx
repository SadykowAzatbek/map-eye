import ProfileEdit from './components/ProfileEdit.tsx';
import { useOpenEditProfile } from '../../components/UI/AppToolbar/components/UseOpenEditProfile.tsx';
import {Box, CircularProgress, Grid, Typography} from '@mui/material';
import InstitutionCardInfo from '../institutions/components/InstitutionCardInfo.tsx';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { selectInstitutions, selectLoadingInstitutions } from '../institutions/institutionSlice.ts';
import { useEffect } from 'react';
import { getInstitutions } from '../institutions/institutionsThunk.ts';

const ClientNavigation = () => {
  const isOpen = useOpenEditProfile((state) => state.isOpen);
  const dispatch = useAppDispatch();
  const myInstitutions = useAppSelector(selectInstitutions);
  const myInstitutionsLoading = useAppSelector(selectLoadingInstitutions);

  useEffect(() => {
    const getInstitutionFetch = async () => {
      dispatch(getInstitutions());
    }

    void getInstitutionFetch();
  }, [dispatch]);

  console.log(myInstitutions);

  return (
    <Box className="container" sx={{ marginTop: "100px", position: "relative" }}>
      {isOpen && (<ProfileEdit />)}
      <Typography component="div" variant="h3">
        <b>Мое заведение</b>
      </Typography>
      <Grid container display="flex" flexWrap="wrap" gap={5}>
        {myInstitutions.map((institution) => (
          <Grid item xs={4} key={institution._id}>
            {!myInstitutionsLoading ?
              <InstitutionCardInfo institutions={institution} />
              : <CircularProgress />}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ClientNavigation;
