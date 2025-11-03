import { useAppSelector } from '../../../app/hooks.ts';
import { Box, Typography } from '@mui/material';
import { selectLocation } from '../../maps/locationSlice.ts';
import { EstablishmentApi, WorkSchedule } from '../../../types/types.Establishments';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import dayjs from 'dayjs';

interface Props {
  establishments: EstablishmentApi;
}

const EstablishmentCardInfo: React.FC<Props> = ({ establishments }) => {
  const myLocation = useAppSelector(selectLocation);

  const phoneInfo = establishments.phoneNumber[0];
  const social = phoneInfo.socialMedia;

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

  const schedule = establishments.schedule;

  const isStandardSchedule = (schedule: WorkSchedule[]) => {
    const weekdays = schedule.slice(0, 5);
    const weekend = schedule.slice(5, 7);

    return weekdays.every(day => day.open) && weekend.every(day => !day.open);
  };

  const daily = establishments.schedule.every((day) => day.open); // ежедневно
  const weekdays = isStandardSchedule(establishments.schedule); // будни

  const openDays = schedule.filter((day) => day.open); // открытые дни

  const hours24 = openDays.every((day) => day.twentyFourHours); // круглосуточно
  const checkWorkTime = openDays.every(
    (day) =>
      day.start === openDays[0].start && day.finish === openDays[0].finish, // проверка на совпадаение времени
  );

  //Проверка рабочих дней в ряд, по возможности и выходные если шо
  //Проверка на случайные рабочие дни с одинаковыми рабочими часами

  return (
    <Box sx={{ border: '1px solid #000', p: 3, m: 2, borderRadius: '1rem', cursor: 'pointer', height: '100%' }}>
      <Typography component="h6" variant="h5">
        {establishments.name}
      </Typography>

      <Typography component="div">
        {establishments.address.replace(`${myLocation?.location}`, '')}
      </Typography>

      <Typography component="div" display="flex" mb={2} borderBottom="1px solid #000" borderColor="gray">
        {Array.from({ length: stars }, (_, i) => (
          <StarIcon key={`star-${i}`} />
        ))}

        {hasHalfStar && <StarHalfIcon key="half-star" />}

        {Array.from({ length: voidStars }, (_, i) => (
          <StarBorderIcon key={`void-${i}`} />
        ))}

        <div style={{ marginLeft: 5, marginTop: 2 }}>
          <b>{rating > 0 && rating.toFixed(1)}</b>
        </div>
      </Typography>

      <Typography component="div">
        {`${establishments.description.split(' ', 20).join(' ')}${
          establishments.description.length > 100 ? '...' : ''
        }`}
      </Typography>

      <Typography component="div">
        <div className="social-media-style" style={{ borderBottom: '1px solid grey' }}>
          Тел: +{phoneInfo.number}
          {social && social.map((item) => (
            item.theres && (<img src={item.logo} alt={item.name} key={item.name} style={{ marginLeft: '4px' }} />)
          ))}
        </div>
      </Typography>

      <Typography component="div" display="flex" mt={1} mb={1} pb={1} borderBottom="1px solid grey" gap={1}>
        <WatchLaterIcon />
        <div>
          {
            daily ?
            `Ежедневно: ${hours24 ?
              'круглосуточно' :
              checkWorkTime &&
              `с ${dayjs(schedule[0].start).format('HH:mm')} до ${dayjs(schedule[0].finish).format('HH:mm')}`}` :

            weekdays ?
            `По будням: ${hours24 ?
              'круглосуточно' :
              checkWorkTime &&
              `с ${dayjs(schedule[0].start).format('HH:mm')} до ${dayjs(schedule[0].finish).format('HH:mm')}`}` :

              schedule.map((day) => (
                <div key={day.day}>
                  {day.day}:
                  {
                    checkWorkTime &&
                    ' с ' + dayjs(day.start).format('HH:mm') + ' до ' + dayjs(day.finish).format('HH:mm')
                  }
                </div>
              ))
          }
        </div>
      </Typography>

      <Typography component="div">
        <span style={{ background: '#7a7979', color: '#ffffff', padding: '2px 5px', borderRadius: '4px' }}>
          {establishments.reviews ? `Отзывы и оценки: ${establishments.reviews}` : 'Отзывов пока нет'}
        </span>
      </Typography>

      <Typography component="div">
        <b>
          Одобрен:
          {establishments.approved ?
            <span style={{ color: '#008000' }}> одобрена</span> :
            <span style={{ color: '#FF0000' }}> нет</span>}
        </b>
      </Typography>
    </Box>
  );
};

export default EstablishmentCardInfo;