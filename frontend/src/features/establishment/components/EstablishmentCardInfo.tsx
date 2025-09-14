import { useAppSelector } from '../../../app/hooks.ts';
import { Box, Typography } from '@mui/material';
import { selectLocation } from '../../maps/locationSlice.ts';
import { EstablishmentApi } from '../../../types/types.Establishments';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface Props {
  establishments: EstablishmentApi;
}

const EstablishmentCardInfo: React.FC<Props> = ({ establishments }) => {
  const myLocation = useAppSelector(selectLocation);

  const phoneInfo = establishments.phoneNumber[0];
  const social = phoneInfo.socialMedia?.[0];

  const rating = establishments.rating;
  const fullStars = Math.floor(rating); // целая часть
  const decimal = rating - fullStars; // дробная часть

  let stars = fullStars;
  let hasHalfStar = false;

  if (decimal >= 0.7) {
    stars += 1;
  } else if (decimal >= 0.3) {
    hasHalfStar = true;
  }

  const voidStars = 5 - stars - (hasHalfStar ? 1 : 0);

  return (
    <Box sx={{ border: '1px solid #000', p: 3, m: 2 }}>
      <Typography component="h6" variant="h5">
        {establishments.name}
      </Typography>

      <Typography component="div">
        {establishments.address.replace(`${myLocation?.location}`, '')}
      </Typography>

      <Typography component="div">
        {`${establishments.description.split(' ', 14).join(' ')}${
          establishments.description.length > 100 ? '...' : ''
        }`}
      </Typography>

      <Typography component="div">
        <div className="social-media-style" style={{ border: '1px solid #000' }}>
          +{phoneInfo?.number}
          {social && <img src={social.logo} alt={social.name} />}
        </div>
      </Typography>

      <Typography component="div" display="flex">
        {Array.from({ length: stars }, (_, i) => (
          <StarIcon key={`star-${i}`} />
        ))}

        {hasHalfStar && <StarHalfIcon key="half-star" />}

        {Array.from({ length: voidStars }, (_, i) => (
          <StarBorderIcon key={`void-${i}`} />
        ))}

        <div style={{ marginLeft: 5, marginTop: 2 }}>
          {rating > 0 && rating.toFixed(1)}
        </div>
      </Typography>
    </Box>
  );
};

export default EstablishmentCardInfo;