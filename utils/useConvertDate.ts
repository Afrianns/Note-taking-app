export const useConvertDate = (date: Date) => {
  const toDate = new Date(date);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${toDate.getDate()} ${months[toDate.getMonth()]} ${toDate.getFullYear()}`;
};
