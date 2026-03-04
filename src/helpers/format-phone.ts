export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  const ddd = digits.slice(0, 2);
  const remainder = digits.slice(2);

  if (remainder.length <= 4) {
    return `(${ddd}) ${remainder}`;
  }

  if (remainder.length <= 9) {
    return `(${ddd}) ${remainder.slice(0, remainder.length - 4)}-${remainder.slice(-4)}`;
  }

  return `(${ddd}) ${remainder.slice(0, 5)}-${remainder.slice(5, 9)}`;
};
