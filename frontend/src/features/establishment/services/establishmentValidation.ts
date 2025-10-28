import dayjs from 'dayjs';
import { EstablishmentForm, searchTable } from '../../../types/types.Establishments';

export const isEstablishmentFormInvalid = (
  state: EstablishmentForm,
  searchResult: searchTable[],
  isLoading: boolean
): boolean => {
  return (
    state.name.trim() === '' ||
    state.address.trim() === '' ||
    state.schedule.every((item) => !item.open) ||
    state.schedule
      .filter((item) => item.open)
      .some(
        (item) =>
          item.twentyFourHours
            ? false
            : !dayjs(item.start, 'HH:mm', true).isValid() ||
            !dayjs(item.finish, 'HH:mm', true).isValid()
      ) ||
    state.coordinates.every((elem) => elem === 0) ||
    state.phoneNumber.some((elem) => !elem.isValidPhone) ||
    isLoading ||
    searchResult.some(
      (item) => item.displayName.toLowerCase() !== state.address.toLowerCase()
    )
  );
};
