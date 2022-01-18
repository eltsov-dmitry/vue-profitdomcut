const INTL_NUMBER_FORMAT = new Intl.NumberFormat('ru-RU');
export const currentFormat = (value) => {
  if (typeof value !== 'number') {
    value = Number.parseFloat(value);
  }

  return INTL_NUMBER_FORMAT.format(value);
};

