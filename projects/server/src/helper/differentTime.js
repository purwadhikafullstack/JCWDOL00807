const date = new Date();
const differentTime = (createdAtFromDataBase) => {
  //   return api + pathImage.slice(5);
  const createdAt = new Date(createdAtFromDataBase);
  const diffTime = Math.abs(date.getTime() - createdAt.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60));
};

module.exports = differentTime;
