const changeFrom = (fromDollarRate: number) => (toDollarRate: number): number =>
  fromDollarRate / toDollarRate;

const changeValue = (fromDollarRate: number) => (toDollarRate: number) => (
  amount: number,
): number => (1 / changeFrom(fromDollarRate)(toDollarRate)) * amount;

const changeValue3 = (
  fromDollarRate: number,
  toDollarRate: number,
  amount: number,
): number => changeValue(fromDollarRate)(toDollarRate)(amount);

const change = (dollarRate: number) => (amount: number): number =>
  (1 / dollarRate) * amount;

// eslint-disable-next-line import/prefer-default-export
export { change, changeFrom, changeValue, changeValue3 };
