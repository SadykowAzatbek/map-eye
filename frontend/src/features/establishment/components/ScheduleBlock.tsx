import React from 'react';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LockIcon from '@mui/icons-material/Lock';
import { Dayjs } from 'dayjs';
import { EstablishmentForm } from '../../../types/types.Establishments';

interface Props {
  everyoneTime: { start: Dayjs, finish: Dayjs };
  handleSetTimeEveryone: (name: 'start' | 'finish', value: Dayjs | null) => void;
  state: EstablishmentForm;
  handleScheduleChange: (index: number) => void;
  handleTimeChange: (index: number, name: 'start' | 'finish', value: Dayjs | null) => void;
  handleTwentyHoursChange: (index: number) => void;
}

const ScheduleBlock: React.FC<Props> = ({
  everyoneTime,
  handleSetTimeEveryone,
  state,
  handleScheduleChange,
  handleTimeChange,
  handleTwentyHoursChange,
}) => {
  return (
    <>
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
    </>
  );
};

export default ScheduleBlock;
