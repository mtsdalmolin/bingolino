export const getTomorrowDate = () => {
  const today = new Date();
  const tomorrowStartDate = new Date(
    `${today.getFullYear()}-${today.getMonth() + 1}-${
      today.getDate() + 1
    } 00:00:00`
  );
  return tomorrowStartDate;
};
