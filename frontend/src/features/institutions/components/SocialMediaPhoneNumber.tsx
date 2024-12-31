import { Tooltip, Typography } from '@mui/material';
import React from 'react';

interface Props {
  logo: string;
  name: string;
  open: boolean;
  selected: () => void;
  selectClass: React.CSSProperties;
}

const SocialMediaPhoneNumber: React.FC<Props> = ({ logo, name, open, selected, selectClass }) => {
  return (
    <>
      <Tooltip title={name}>
        <Typography component="div" className="social-media-style" style={selectClass} onClick={selected}>
          <img alt={name} src={logo} className={`${!open && 'no-img'}`} />
        </Typography>
      </Tooltip>
    </>
  );
};

export default SocialMediaPhoneNumber;