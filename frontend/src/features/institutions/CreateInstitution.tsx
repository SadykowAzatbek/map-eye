import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
  Box,
  debounce, Tooltip,
} from '@mui/material';
import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Institution } from '../../types/types.Institution';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../app/hooks.ts';
import { createInstitution } from './institutionsThunk.ts';
import axiosApi from '../../utils/axiosApi.ts';
import Search from '../../components/Searchs/Search.tsx';
import SocialMediaPhoneNumber from './components/SocialMediaPhoneNumber.tsx'; // Стили для PhoneInput
import phone from '../../../public/2121.png';
import whatsapp from '../../../public/whatsapp.png';
import telegram from '../../../public/telegram.png';
import facebook from '../../../public/facebook.png';
import instagram from '../../../public/instagram.png';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import { selectLocation, selectLocationLoading, selectUpdateLocationLoading } from '../maps/locationSlice.ts';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useNavigate } from 'react-router-dom';


interface searchTable {
  displayName: string;
  lat: string;
  lon: string;
}

const CreateInstitution = () => {
  const locationSelect = useAppSelector(selectLocation);
  const isLocationLoading = useAppSelector(selectLocationLoading);
  const isLocationUpdateLoading = useAppSelector(selectUpdateLocationLoading);
  const navigate = useNavigate();

  const defaultSocialMedia = [
    { name: 'phone', theres: true, logo: phone },
    { name: 'whatsapp', theres: false, logo: whatsapp },
    { name: 'telegram', theres: false, logo: telegram },
    { name: 'facebook', theres: false, logo: facebook },
    { name: 'instagram', theres: false, logo: instagram },
  ];

  const [state, setState] = useState<Institution>({
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

  console.log(state);
  console.log(locationSelect);

  const [searchResult, setSearchResult] = useState<searchTable[]>([]);

  // Функция для получении списка улиц
  const searchStreet = useCallback(async (location: string, city: string, address: string) => {
    const response = await axiosApi.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${location},${city},${address}`)}&format=json`
    );
    const filterData = response.data
      .filter((elem: { addresstype: string }) => elem.addresstype === 'building')
      .map((elem) => ({
        displayName: elem.display_name,
        lat: elem.lat,
        lon: elem.lon,
      }));

    if (filterData.length > 2) {
      setState((prevState) => ({
        ...prevState,
        coordinates: [
          parseFloat(filterData[0].lat),
          parseFloat(filterData[0].lon),
        ],
      }));
    }
    setSearchResult(filterData);
  }, [locationSelect, setState, setSearchResult]);

  const debouncedSearchStreet = useRef(debounce(searchStreet, 300)).current;

  useEffect(() => {
    const fetchUrl = async () => {
      if (locationSelect) {
        if (state.address) await debouncedSearchStreet(locationSelect.location, locationSelect.city, state.address);
        if (isLocationUpdateLoading) {
          setState((prevState) => ({
            ...prevState,
            address: '',
          }));
        }
      }
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
      coordinates: [0, 0],
    }));
  };

  const handleTimeChange = (index: number, name: 'start' | 'finish', value: Dayjs | null) => {
    if (value) {
      setState((prevState) => ({
        ...prevState,
        schedule: prevState.schedule.map((item, i) =>
          i === index ? {...item, [name]: value } : item
        ),
      }));
    }
  };

  const handleScheduleChange = (index: number) => {
    setState((prevState) => ({
      ...prevState,
      schedule: prevState.schedule.map((item, i) =>
        i === index ? { ...item, open: !item.open } : item // находит по индексу и изменяет содержимое ключа open на противоположное
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
          : item
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

    await dispatch(createInstitution(state));
    navigate('/');
  };

  return (
    <>
    <Box
      onSubmit={formSubmitHandler}
      component="form"
      className="institution-form"
    >
      <div className="form-block main-form">
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

        <div>
          <div style={{ display: 'flex' }}>
            <TextField
              fullWidth
              required
              label="Адрес заведение (номер здании, улица)"
              name="address"
              type="text"
              value={state.address}
              onChange={inputChangeHandler}
              error={state.address.trim() === '' && state.address.includes(' ')}
              helperText={
                state.address.trim() === '' && state.address.includes(' ')
                  && 'Поле не должно быть пустым или содержать только пробелы!' ||
                state.coordinates[0] === 0 && 'Введите достоверный адрес'
              }
              disabled={
                !locationSelect ||
                locationSelect?.city === '' ||
                isLocationUpdateLoading
              }
            />
            <Tooltip
              title={
                locationSelect && locationSelect.city ?
                  `Ваше заведение в городе ${locationSelect.city}? Если нет, то поменяйте страну или/и город в правом верхнем углу`
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

        <div>
          <Button type="button" onClick={addNewPhone}>Добавить номер телефона +</Button>
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
                countryCodeEditable={false}
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
              <Button type="button" onClick={() => deletePhone(elem.id)}>Удалить</Button>
            </div>
          ))}
        </div>
      </div>

      <div className="form-block">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Typography component="div" sx={{mb: 3}}>Задать время рабочим дням:</Typography>
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

          <Typography component="div" sx={{mt: 3}}>Рабочие дни:</Typography>
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
                />
                {elem.open ? (
                  <div style={{display: 'inline-block'}}>
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
                  'Закрыто'
                )}
              </div>
            ))}
          </LocalizationProvider>
      </div>

      <div className="institution-btn">
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
              )
            }
          >
            Отправить
          </Button>
        </div>
    </Box>
    </>
  );
};

export default CreateInstitution;
