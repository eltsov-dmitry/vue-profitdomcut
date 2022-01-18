export const getFlatStatus = (status) => {
  switch (status) {
    case 'Свободна':
      return 'free';
    case 'Бронь':
      return 'order';
    case 'Договор':
    case 'Выданы ключи':
      return 'contract';
    default:
      return null;
  }
};
