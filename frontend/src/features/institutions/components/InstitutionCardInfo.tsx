import { useAppSelector } from '../../../app/hooks.ts';
import { Box, Typography } from '@mui/material';
import { selectLocation } from '../../maps/locationSlice.ts';
import { InstitutionTypes } from '../../../types/types.Institution';

interface Props {
  institutions: InstitutionTypes;
}

const InstitutionCardInfo: React.FC<Props> = ({ institutions }) => {
  const myLocation = useAppSelector(selectLocation);

  const phoneInfo = institutions.phoneNumber[0];
  const social = phoneInfo.socialMedia?.[0];

  return (
    <Box sx={{ border: "1px solid #000", p: 3 }}>
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
    </Box>
  );
};

export default InstitutionCardInfo;