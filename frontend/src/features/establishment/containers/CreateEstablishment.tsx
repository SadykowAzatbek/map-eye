import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Box,
  debounce, Tooltip, CircularProgress,
} from '@mui/material';
import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Establishment, searchTable } from '../../../types/types.Establishments';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts';
import { createEstablishment } from '../EstablishmentThunk.ts';
import axiosApi from '../../../utils/axiosApi.ts';
import SocialMediaPhoneNumber from '../components/SocialMediaPhoneNumber.tsx'; // Стили для PhoneInput
import phone from '../../../../public/2121.png';
import whatsapp from '../../../../public/whatsapp.png';
import telegram from '../../../../public/telegram.png';
import facebook from '../../../../public/facebook.png';
import instagram from '../../../../public/instagram.png';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { selectLocation, selectLocationLoading, selectUpdateLocationLoading } from '../../maps/locationSlice.ts';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useNavigate } from 'react-router-dom';
import { selectCreateIsLoadingEstablishments } from '../EstablishmentSlice.ts';
import ClearIcon from '@mui/icons-material/Clear';
import LockIcon from '@mui/icons-material/Lock';
import AddressSearch from '../components/AddressSearch.tsx';

const CreateEstablishment = () => {
  const locationSelect = useAppSelector(selectLocation);
  const isLocationLoading = useAppSelector(selectLocationLoading);
  const isLocationUpdateLoading = useAppSelector(selectUpdateLocationLoading);
  const isEstablishmentCreateLoading = useAppSelector(selectCreateIsLoadingEstablishments);
  const navigate = useNavigate();

  const defaultSocialMedia = [
    { name: 'phone', theres: true, logo: phone },
    { name: 'whatsapp', theres: false, logo: whatsapp },
    { name: 'telegram', theres: false, logo: telegram },
    { name: 'facebook', theres: false, logo: facebook },
    { name: 'instagram', theres: false, logo: instagram },
  ];

  const [state, setState] = useState<Establishment>({
    name: '',
    description: '',
    schedule: [
      { day: 'Понедельник', open: true, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
      { day: 'Вторник', open: true, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
      { day: 'Среда', open: true, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
      { day: 'Четверг', open: true, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
      { day: 'Пятница', open: true, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
      { day: 'Суббота', open: false, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
      { day: 'Воскресенье', open: false, start: dayjs('00:00', 'HH:mm'), finish: dayjs('00:00', 'HH:mm'), twentyFourHours: false },
      { day: 'Перерыв', open: false, start: dayjs('12:30', 'HH:mm'), finish: dayjs('13:30', 'HH:mm'), twentyFourHours: false },
    ],
    address: '',
    coordinates: [0, 0],
    phoneNumber: [
      {
        id: Date.now(),
        number: '',
        internationalCode: '',
        phoneError: false,
        socialOpen: false,
        socialMedia: defaultSocialMedia,
      },
    ],
  });

  const [searchResult, setSearchResult] = useState<searchTable[]>([]);
  console.log(state);
  console.log(searchResult);

  // Функция для получении списка улиц
  const searchStreet = useCallback(async (location: string, city: string, address: string) => {
    const response = await axiosApi.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${location},${city},${address}`)}&format=json`
    );
    const filterData = response.data
      .filter((elem: { addresstype: string }) => elem.addresstype === 'building')
      .map((elem: { display_name: string, lat: string, lon: string }) => {
        const parts = elem.display_name.split(',').map(part => part.trim()); // создает массив из строк, разделяя через запятую
        const shortAddress = parts.slice(0, 3).join(', ');

        return {
          displayName: shortAddress,
          lat: elem.lat,
          lon: elem.lon,
        }
      });

    setSearchResult(filterData);
  }, [locationSelect, setSearchResult]);

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

      searchResult.some((address) => (
        address.displayName === state.address &&
        setState((prevState) => ({
          ...prevState,
          address: address.displayName,
          coordinates: [parseFloat(address.lat), parseFloat(address.lon)],
        }))
      ));
    };

    void fetchUrl();
  }, [locationSelect, state.address, isLocationUpdateLoading]);

  const [everyoneTime, setEveryoneTime] = useState({
    start: dayjs('00:00', 'HH:mm'),
    finish: dayjs('00:00', 'HH:mm'),
  });

  const dispatch = useAppDispatch();

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
          i === index ? { ...item, [name]: value } : item
        ),
      }));
    }
  };

  const handleScheduleChange = (index: number) => {
    setState((prevState) => ({
      ...prevState,
      schedule: prevState.schedule.map((item, i) =>
        i === index ? { ...item, open: !item.open } : item // находит по индексу и изменяет булевое значение
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
          item.open ? { ...item, [name]: value } : item
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
            phoneError: isValid,
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
      phoneError: false,
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

    await dispatch(createEstablishment(state));
    navigate('/');
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
            state={state}
            location={locationSelect}
            inputChangeHandler={inputChangeHandler}
            isLocationUpdateLoading={isLocationUpdateLoading}
            searchResult={searchResult}
            onClickAddress={onClickAddress}
          />

          <div style={{ borderTop: "1px solid #ccc" }}>
            <Button
              type="button"
              onClick={addNewPhone}
              disabled={state.phoneNumber.length > 4}
              sx={{ mt: 1 }}
            >
              Добавить контакт +
            </Button>
            <div className="warning-phone-block">
              <b>При желании оставьте к первому контакту соц. сети, мы можем связаться с вами через них. В дальнейшем их можно изменить.</b>
            </div>
            {state.phoneNumber.map((elem, index) => (
              <div key={elem.id} className="phone-block">
                <PhoneInput
                  country={
                    isLocationLoading || !locationSelect?.altSpellings?.length
                      ? ''
                      : locationSelect.altSpellings[0].toLowerCase()
                  }
                  value={elem.number}
                  onChange={(value) => handlePhoneChange(value, index)}
                  enableSearch={true}
                  inputProps={{
                    className: `phone-input ${!elem.phoneError ? 'error-border' : 'phone-input'}`,
                  }}
                />
                {!elem.phoneError && elem.number && (
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
        </div>

        <div className="form-block">
          <Typography component="div" sx={{ mb: 3, ml: 'auto', mr: 'auto' }}><b>Задать общее время:</b></Typography>
          <div className="set-time-block">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Начало рабочего дня"
                value={everyoneTime.start}
                onChange={(value) => handleSetTimeEveryone('start', value)}
                ampm={false} //убирает 12 часавой формат времени
              />
              <TimePicker
                label="Конец рабочего дня"
                value={everyoneTime.finish}
                onChange={(value) => handleSetTimeEveryone('finish', value)}
                ampm={false}
              />
            </LocalizationProvider>
          </div>

          <Typography component="div" sx={{ mt: 3 }}><b>Рабочие дни:</b></Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {state.schedule.map((elem, index) => (
              <div key={elem.day} className="form-time">
                <FormControlLabel
                  key={elem.day}
                  control={
                    <Checkbox
                      checked={elem.open}
                      onChange={() => handleScheduleChange(index)}
                    />
                  }
                  label={elem.day + ':'}
                  sx={{ borderBottom: '1px solid #ccc', width: '50%' }}
                />
                {elem.open ? (
                  <div style={{ display: 'inline-block' }}>
                    <TimePicker
                      className="time-styles"
                      label="Начало"
                      value={elem.start}
                      onChange={(value) => handleTimeChange(index, 'start', value)}
                      ampm={false}
                      disabled={elem.twentyFourHours}
                    />
                    <TimePicker
                      className="time-styles"
                      label="Конец"
                      value={elem.finish}
                      onChange={(value) => handleTimeChange(index, 'finish', value)}
                      ampm={false}
                      disabled={elem.twentyFourHours}
                    />
                    {elem.day !== 'Перерыв' ?
                      <div className="twenty-hours">
                        Круглосуточно:
                        <Checkbox
                          checked={elem.twentyFourHours}
                          onChange={() => handleTwentyHoursChange(index)}
                        />
                      </div> :
                      ''
                    }
                  </div>
                ) : elem.day === 'Перерыв' ? (
                  'Без перерыва'
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    Закрыто <LockIcon />
                  </div>
                )}
              </div>
            ))}
          </LocalizationProvider>
        </div>

        <div className="establishment-btn">
          <Button
            type="submit"
            disabled={
              state.name.trim() === '' ||
              state.address.trim() === '' ||
              state.schedule.every(item => !item.open) ||
              state.schedule.filter(item => item.open).some(
                item =>
                  item.twentyFourHours ? false :
                    !dayjs(item.start, 'HH:mm', true).isValid() ||
                    !dayjs(item.finish, 'HH:mm', true).isValid()
              ) ||
              state.coordinates.every(elem => elem === 0) ||
              state.phoneNumber.some(elem => !elem.phoneError) ||
              isEstablishmentCreateLoading ||
              !searchResult.some(item => item.displayName.toLowerCase() === state.address.toLowerCase())
            }
          >
            Отправить {isEstablishmentCreateLoading ? (<CircularProgress sx={{ ml: 2 }} />) : ''}
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default CreateEstablishment;
