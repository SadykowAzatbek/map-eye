import React from 'react';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import LockIcon from '@mui/icons-material/Lock';
import CancelIcon from '@mui/icons-material/Cancel';
import { Dayjs } from 'dayjs';
import { BreakData, WorkSchedule } from '../../../types/types.Establishments';

interface Props {
  everyoneTime: { start: Dayjs, finish: Dayjs };
  handleSetTimeEveryone: (name: 'start' | 'finish', value: Dayjs | null) => void;
  breakData: BreakData;
  schedule: WorkSchedule[];
  handleScheduleChange: (index: number | null) => void;
  handleTimeChange: (index: number | null, name: 'start' | 'finish', value: Dayjs | null) => void;
  handleTwentyHoursChange: (index: number) => void;
}

const ScheduleBlock: React.FC<Props> = ({
  everyoneTime,
  handleSetTimeEveryone,
  breakData,
  schedule,
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
        <div>
          {schedule.map((elem, index) => (
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

                  <div className="twenty-hours">
                    Круглосуточно:
                    <Checkbox
                      checked={elem.twentyFourHours}
                      onChange={() => handleTwentyHoursChange(index)}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  Закрыто <LockIcon />
                </div>
              )}
            </div>
          ))}
          <div className="form-time">
            <FormControlLabel
              control={
                <Checkbox
                  checked={breakData.break}
                  onChange={() => handleScheduleChange(null)}
                />
              }
              label="Перерыв"
              sx={{ borderBottom: '1px solid #ccc', width: '50%' }}
            />
            {breakData.break ?
              (
                <div style={{ display: 'inline-block' }}>
                  <TimePicker
                    className="time-styles"
                    label="Начало"
                    value={breakData.start}
                    onChange={(value) => handleTimeChange(null, 'start', value)}
                    ampm={false}
                  />
                  <TimePicker
                    className="time-styles"
                    label="Конец"
                    value={breakData.finish}
                    onChange={(value) => handleTimeChange(null, 'finish', value)}
                    ampm={false}
                  />
                </div>
              ) : (
                <Typography component="div" display="flex" alignItems="center" gap={1}>
                  <span>Без перерыва</span>
                  <CancelIcon />
                </Typography>
              )
            }
          </div>
        </div>
      </LocalizationProvider>
    </>
  );
};

export default ScheduleBlock;
