import React, { ChangeEvent } from 'react';
import { TextField, Tooltip } from '@mui/material';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import Search from '../../../components/Searchs/Search.tsx';
import { LocationTypes } from '../../../types/types.Location.ts';
import { EstablishmentForm, searchTable } from '../../../types/types.Establishments';

interface Props {
  state: EstablishmentForm;
  location: null | LocationTypes;
  inputChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
  isLocationUpdateLoading: boolean;
  searchResult: searchTable[];
  onClickAddress: (address: string, lat: number, lon: number) => void;
}

const AddressSearch: React.FC<Props> = ({
  state,
  inputChangeHandler,
  location,
  isLocationUpdateLoading,
  searchResult,
  onClickAddress,
}) => {
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <TextField
          fullWidth
          required
          label="Адрес заведение (номер здании, улица)"
          name="address"
          type="text"
          autoComplete="off"
          value={state.address}
          onChange={inputChangeHandler}
          error={
            state.address.trim() === '' && state.address.includes(' ') ||
            state.address !== '' && state.coordinates.every(elem => elem === 0)
          }
          helperText={
            state.address.trim() === '' && state.address.includes(' ')
              ? 'Поле не должно быть пустым или содержать только пробелы!'
              : state.address !== '' && state.coordinates.every(elem => elem === 0)
                ? 'Введите достоверный адрес'
                : ''
          }
          disabled={
            !location ||
            location?.city === '' ||
            isLocationUpdateLoading
          }
        />
        <Tooltip
          title={
            location && location.city ?
              `Ваше заведение в городе ${location.city}? Иначе поменяйте страну и/или город в правом верхнем углу`
              : 'Добавьте страну или/и город. Это можно сделать в правом верхнем углу'
          }
          sx={{ border: '2px solid #000', ml: 1, mt: 2, borderRadius: 2 }}
        >
          <PriorityHighIcon />
        </Tooltip>
      </div>
      {searchResult.map((elem, i) => (
        elem.displayName !== state.address &&
        <Search key={i} displayName={elem.displayName} onClick={() => onClickAddress(elem.displayName, parseFloat(elem.lat), parseFloat(elem.lon))}/>
      ))}
    </div>
  );
};

export default AddressSearch;
