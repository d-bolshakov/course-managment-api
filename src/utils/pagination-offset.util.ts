export const getPaginationOffset = (page: number, limit: number = 10) =>
  (page - 1) * limit;
