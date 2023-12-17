export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

export const getDateWithOffset = (offset: number) => {
  const date = new Date(
    new Date().setDate(new Date().getDate() + offset)
  ).toISOString();
  return new Date(`${date.split("T")[0]}T10:00:00.000Z`);
};
