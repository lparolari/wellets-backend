import ICurrenciesRatesDTO from '../../DTOs/ICurrenciesRatesDTO';
import INomicsCurrency from './INomicsCurrency';

type INomicsCurrencies = INomicsCurrency[];

function convertToCurrenciesRates(
  currencies: INomicsCurrencies,
): ICurrenciesRatesDTO {
  const rates: ICurrenciesRatesDTO = {};

  currencies.forEach((currency: INomicsCurrency) => {
    rates[currency.id] = 1 / Number.parseFloat(currency.price);
  });

  return rates;
}

export default convertToCurrenciesRates;
