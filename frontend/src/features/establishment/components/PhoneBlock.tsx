import { Button, Tooltip } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SocialMediaPhoneNumber from './SocialMediaPhoneNumber.tsx';
import ClearIcon from '@mui/icons-material/Clear';
import { PhoneMethod } from '../../../types/types.Establishments';
import React from 'react';
import { LocationTypes } from '../../../types/types.Location.ts';

interface Props {
  phoneNumber: PhoneMethod[];
  addNewPhone: () => void;
  isLocationLoading: boolean;
  location: null | LocationTypes;
  handlePhoneChange: (value: string, index: number) => void;
  openSocialList: (index: number) => void;
  selectedSocialMedia: (phoneInx: number, socialInx: number) => void;
  deletePhone: (index: number) => void;
}

const PhoneBlock: React.FC<Props> = ({
  phoneNumber,
  addNewPhone,
  isLocationLoading,
  location,
  handlePhoneChange,
  openSocialList,
  selectedSocialMedia,
  deletePhone,
}) => {
  return (
    <div style={{ borderTop: "1px solid #ccc" }}>
      <Button
        type="button"
        onClick={addNewPhone}
        disabled={phoneNumber.length > 4}
        sx={{ mt: 1 }}
      >
        Добавить контакт +
      </Button>
      <div className="warning-phone-block">
        <b>При желании оставьте к первому контакту соц. сети, мы можем связаться с вами через них. В дальнейшем их можно изменить.</b>
      </div>
      {phoneNumber.map((elem, index) => (
        <div key={elem.id} className="phone-block">
          <PhoneInput
            country={
              isLocationLoading || !location?.altSpellings?.length
                ? ''
                : location.altSpellings[0].toLowerCase()
            }
            value={elem.number}
            onChange={(value) => handlePhoneChange(value, index)}
            enableSearch={true}
            inputProps={{
              className: `phone-input ${!elem.isValidPhone ? 'error-border' : 'phone-input'}`,
            }}
          />
          {!elem.isValidPhone && elem.number && (
            <span style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
                  Введите верный формат телефона
                </span>
          )}
          <Tooltip title={ elem.socialOpen ? 'Скрыть' : 'Добавить соцсети'}>
            <div
              onClick={() => openSocialList(index)}
              className={!elem.socialOpen ? 'open-close-style open-close-margin' : 'open-close-style open-close-new-margin'}
            >
              {elem.socialOpen ?
                <KeyboardArrowLeftIcon /> :
                <KeyboardArrowRightIcon />
              }
            </div>
          </Tooltip>
          {elem.socialOpen && <div className="main-social-block">
            {elem.socialMedia.map((socialItem, i) => (
              <SocialMediaPhoneNumber
                key={i}
                name={socialItem.name}
                logo={socialItem.logo}
                open={elem.socialOpen}
                selected={() => selectedSocialMedia(index, i)}
                selectClass={{ background: socialItem.theres ? '#32CD32' : '' }}
              />
            ))}
          </div>}
          <Button
            type="button"
            sx={{
              color: "#656565",
              '&:hover': {
                color: "#000"
              }
            }}
            onClick={() => deletePhone(elem.id)}
          >
            <ClearIcon />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PhoneBlock;
