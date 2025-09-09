import {
  TextField,
  Button,
  Typography,
  Box,
  debounce,
  CircularProgress,
} from '@mui/material';
import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { EstablishmentForm, searchTable } from '../../../types/types.Establishments';
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { createEstablishment } from '../EstablishmentThunk.ts';
import { selectLocation, selectLocationLoading, selectUpdateLocationLoading } from '../../maps/locationSlice.ts';
import 'react-phone-input-2/lib/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useNavigate } from 'react-router-dom';
import { selectCreateIsLoadingEstablishments } from '../EstablishmentSlice.ts';
import AddressSearch from '../components/AddressSearch.tsx';
import PhoneBlock from '../components/PhoneBlock.tsx';
import ScheduleBlock from '../components/ScheduleBlock.tsx';
import { initialEstablishmentState } from '../config/initialEstablishmentState.ts';
import { defaultSocialMedia } from '../config/socialMedia.ts';
import { searchStreetService } from '../services/establishmentService.ts';
import { isEstablishmentFormInvalid } from '../services/establishmentValidation.ts';

const CreateEstablishment = () => {
  const dispatch = useAppDispatch();
  const locationSelect = useAppSelector(selectLocation);
  const isLocationLoading = useAppSelector(selectLocationLoading);
  const isLocationUpdateLoading = useAppSelector(selectUpdateLocationLoading);
  const isEstablishmentCreateLoading = useAppSelector(selectCreateIsLoadingEstablishments);
  const navigate = useNavigate();

  const [state, setState] = useState<EstablishmentForm>(initialEstablishmentState);
  const [searchResult, setSearchResult] = useState<searchTable[]>([]);
  console.log(state);
  console.log(searchResult);

  // Функция для получении списка улиц
  const searchStreet = useCallback(async (location: string, city: string, address: string) => {
    const filterData = await searchStreetService(location, city, address);
    setSearchResult(filterData);
  }, []);

  const debouncedSearchStreet = useRef(debounce(searchStreet, 300)).current;

  useEffect(() => {
    const fetchUrl = async () => {
      if (locationSelect) {
        if (state.address.trim() !== '') await debouncedSearchStreet(locationSelect.location, locationSelect.city, state.address);

        // Если место заведение изменено, то адрес сбрасывается
        if (isLocationUpdateLoading) {
          setState((prevState) => ({
            ...prevState,
            address: '',
            coordinates: [0, 0],
          }));
        }
      }

      const found = searchResult.find((address) => address.displayName === state.address);
      if (found) {
        setState((prevState) => ({
          ...prevState,
          address: found.displayName,
          coordinates: [parseFloat(found.lat), parseFloat(found.lon)],
        }));
      }
    };

    void fetchUrl();
  }, [locationSelect, state.address, isLocationUpdateLoading]);

  const [everyoneTime, setEveryoneTime] = useState({
    start: dayjs('00:00', 'HH:mm'),
    finish: dayjs('00:00', 'HH:mm'),
  });

  const inputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTimeChange = (index: number, name: 'start' | 'finish', value: Dayjs | null) => {
    if (value) {
      setState((prevState) => ({
        ...prevState,
        schedule: prevState.schedule.map((item, i) =>
          i === index ? { ...item, [name]: value } : item,
        ),
      }));
    }
  };

  const handleScheduleChange = (index: number) => {
    setState((prevState) => ({
      ...prevState,
      schedule: prevState.schedule.map((item, i) =>
        i === index ? { ...item, open: !item.open } : item,
      ),
    }));
  };

  const handleSetTimeEveryone = (name: 'start' | 'finish', value: Dayjs | null) => {
    if (value) {
      setEveryoneTime((prevState) => ({
        ...prevState,
        [name]: value,
      }));

      setState((prevState) => ({
        ...prevState,
        schedule: prevState.schedule.map((item) =>
          item.open ? { ...item, [name]: value } : item,
        ),
      }));
    }
  };

  // При нажатии на одно из списка адресов выполняется функция сохранение данных
  const onClickAddress = (address: string, lat: number, lon: number) => {
    setState((prevState) => ({
      ...prevState,
      address: address,
      coordinates: [lat, lon],
    }));
  };

  const handlePhoneChange = (value: string, index: number) => {
    const phoneNumber = parsePhoneNumberFromString(value.startsWith('+') ? value : '+' + value);

    const isValid = phoneNumber?.isValid() ?? false; // проверка валидности номера
    const countryCode = phoneNumber?.country?.toLowerCase() || ''; // iso код страны (A2)

    setState((prevState) => ({
      ...prevState,
      phoneNumber: prevState.phoneNumber.map((item, i) =>
        i === index
          ? {
            ...item,
            number: value,
            internationalCode: countryCode,
            isValidPhone: isValid,
          }
          : item,
      ),
    }));
  };

  // Добавляет новое поле для телефона
  const addNewPhone = () => {
    const newNumberPhone = {
      id: Date.now(), // Устанавливаем уникальный id
      number: '',
      internationalCode: '',
      isValidPhone: false,
      socialOpen: false,
      socialMedia: defaultSocialMedia,
    };

    setState((prevState)=> ({
      ...prevState,
     phoneNumber: [...prevState.phoneNumber, newNumberPhone]
    }));
  };

  const deletePhone = (id: number) => {
    setState((prevState) => ({
      ...prevState,
      phoneNumber: prevState.phoneNumber.filter((phone) => phone.id !== id),
    }));
  };

  const openSocialList = (index: number) => {
    setState((prevState) => ({
      ...prevState,
      phoneNumber: prevState.phoneNumber.map((item, i) =>
        i === index ? { ...item, socialOpen: !item.socialOpen } : item
      )
    }));
  };

  const selectedSocialMedia = (phoneIndex: number, socialIndex: number) => {
    setState((prevState) => ({
      ...prevState,
      phoneNumber: prevState.phoneNumber.map((phone, i) =>
        i === phoneIndex ? {
          ...phone,
          socialMedia: phone.socialMedia.map((social, j) =>
            j === socialIndex ? { ...social, theres: !social.theres } : social
          ),
        } : phone
      ),
    }));
  };

  const handleTwentyHoursChange = (index: number) => {
    setState((prevState) => ({
      ...prevState,
      schedule: prevState.schedule.map((item, i) =>
        i === index ? { ...item, twentyFourHours: !item.twentyFourHours } : item
      ),
    }));
  };

  const formSubmitHandler = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await dispatch(createEstablishment(state)).unwrap();
      navigate('/');
    } catch (e) {
      console.error('Ошибка при создании заведения:', e);
    }

  };

  return (
    <div className="container">
      <Box
        onSubmit={formSubmitHandler}
        component="form"
        className="establishment-form"
      >
        <div className="main-form">
          <Typography component="div" variant="h5" sx={{ borderBottom: "1px solid #ccc" }}><b>Мое заведение:</b></Typography>
          <TextField
            required
            label="Название заведение"
            name="name"
            type="text"
            value={state.name}
            onChange={inputChangeHandler}
            error={state.name.trim() === '' && state.name.includes(' ')} // Выводит ошибку если строка состоит из пробелов
            helperText={
              state.name.trim() === '' && state.name.includes(' ')
                ? 'Поле не должно быть пустым или содержать только пробелы!'
                : ''
            }
          />

          <TextField
            label="Описание (например, что представляет из себя ваше заведение)"
            name="description"
            multiline //input становится textarea
            rows={8} //Кол-во видимых строк
            variant="outlined"
            value={state.description}
            onChange={inputChangeHandler}
          />

          <AddressSearch
            address={state.address}
            coordinates={state.coordinates}
            location={locationSelect}
            inputChangeHandler={inputChangeHandler}
            isLocationUpdateLoading={isLocationUpdateLoading}
            searchResult={searchResult}
            onClickAddress={onClickAddress}
          />

          <PhoneBlock
            phoneNumber={state.phoneNumber}
            addNewPhone={addNewPhone}
            isLocationLoading={isLocationLoading}
            location={locationSelect}
            handlePhoneChange={handlePhoneChange}
            openSocialList={openSocialList}
            selectedSocialMedia={selectedSocialMedia}
            deletePhone={deletePhone}
          />
        </div>

        <div className="form-block">
          <ScheduleBlock
            everyoneTime={everyoneTime}
            handleSetTimeEveryone={handleSetTimeEveryone}
            schedule={state.schedule}
            handleScheduleChange={handleScheduleChange}
            handleTimeChange={handleTimeChange}
            handleTwentyHoursChange={handleTwentyHoursChange}
          />
        </div>

        <div className="establishment-btn">
          <Button
            type="submit"
            disabled={isEstablishmentFormInvalid(state, searchResult, isEstablishmentCreateLoading)}
          >
            Отправить {isEstablishmentCreateLoading && <CircularProgress sx={{ ml: 2 }} />}
          </Button>

        </div>
      </Box>
    </div>
  );
};

export default CreateEstablishment;
