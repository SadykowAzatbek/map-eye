import { useAppSelector } from '../../../app/hooks.ts';
import { Box, Typography } from '@mui/material';
import { selectLocation } from '../../maps/locationSlice.ts';
import { EstablishmentApi } from '../../../types/types.Establishments';
import StarIcon from '@mui/icons-material/Star';
// import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface Props {
  establishments: EstablishmentApi;
}

const EstablishmentCardInfo: React.FC<Props> = ({ establishments }) => {
  const myLocation = useAppSelector(selectLocation);

  const phoneInfo = establishments.phoneNumber[0];
  const social = phoneInfo.socialMedia?.[0];

  const ratingArrStar = Array.from({ length: establishments.rating }, (_, i) => i + 1);
  const voidStar = Array.from({ length: 5 - ratingArrStar.length }, (_, i) => i + 1);

  return (
    <Box sx={{ border: "1px solid #000", p: 3, m: 2 }}>
      <Typography component="h6" variant="h5">
        {establishments.name}
      </Typography>

      <Typography component="div">
        {establishments.address.replace(`${myLocation?.location}`, '')}
      </Typography>

      <Typography component="div">
        {`${establishments.description.split(' ', 14).join(' ')}${establishments.description.length > 100 ? '...' : ''}`}
      </Typography>

      <Typography component="div">
        <div className="social-media-style" style={{ border: "1px solid #000" }}>
          +{phoneInfo?.number}
          {social && (
            <img src={social.logo} alt={social.name} />
          )}
        </div>
      </Typography>

      <Typography component="div" display="flex">
        {ratingArrStar.map((item) => (
          <div key={item}>
            <StarIcon />
          </div>
        ))}
        {voidStar.map((item) => (
          <div key={item}>
            <StarBorderIcon />
          </div>
        ))}
        <div style={{ marginLeft: 5, marginTop: 2 }}>
          {establishments.rating > 0 && establishments.rating}
        </div>
      </Typography>
    </Box>
  );
};

export default EstablishmentCardInfo;