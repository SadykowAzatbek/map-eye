import { useAppSelector } from '../../../app/hooks.ts';
import { Box, Typography } from '@mui/material';
import { selectLocation } from '../../maps/locationSlice.ts';
import { InstitutionTypes } from '../../../types/types.Institution';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface Props {
  institutions: InstitutionTypes;
}

const InstitutionCardInfo: React.FC<Props> = ({ institutions }) => {
  const myLocation = useAppSelector(selectLocation);

  const phoneInfo = institutions.phoneNumber[0];
  const social = phoneInfo.socialMedia?.[0];

  const ratingArrStar = Array.from({ length: institutions.rating }, (_, i) => i + 1);
  const voidStar = Array.from({ length: 5 - ratingArrStar.length }, (_, i) => i + 1);

  return (
    <Box sx={{ border: "1px solid #000", p: 3, m: 2 }}>
      <Typography component="h6" variant="h5">
        {institutions.name}
      </Typography>

      <Typography component="div">
        {institutions.address.replace(`${myLocation?.location}`, '')}
      </Typography>

      <Typography component="div">
        {`${institutions.description.split(' ', 8).join(' ')}${institutions.description.length > 50 ? '...' : ''}`}
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
        {ratingArrStar.map(() => (
          <div>
            <StarIcon />
          </div>
        ))}
        {voidStar.map(() => (
          <div>
            <StarBorderIcon />
          </div>
        ))}
        <div style={{ marginLeft: 5, marginTop: 2 }}>
          {institutions.rating > 0 && institutions.rating}
        </div>
      </Typography>
    </Box>
  );
};

export default InstitutionCardInfo;