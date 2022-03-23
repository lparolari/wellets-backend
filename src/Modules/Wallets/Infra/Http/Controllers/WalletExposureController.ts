import { Request, Response, NextFunction } from 'express';
import TransactionsRepository from 'Modules/Transactions/Infra/TypeORM/Repositories/TransactionsRepository';
import { container } from 'tsyringe';
import * as R from 'ramda';

// TODO: rename in wallet statistics controller
class WalletExposureController {
  public async exposure(
    request: Request,
    response: Response,
    _: NextFunction,
  ): Promise<Response> {
    const { wallet_id } = request.params;

    // const { id } = request.user;

    const repo = container.resolve(TransactionsRepository);
    console.log(wallet_id);

    const paginatedTransactions = await repo.findByWalletId({ wallet_id });
    const { transactions } = paginatedTransactions;

    const values = R.pluck('value', transactions);
    const dollarRates =
      // R.map(
      //   (x: number) => 1 / x,
      R.pluck('dollar_rate', transactions);
    // );

    console.log(values);
    console.log(dollarRates);

    // const outcomes = R.zipWith(
    //   (a: number, b: number) => a * b,
    //   values,
    //   dollarRates,
    // );

    const weightedDollarRates = R.zipWith(
      (a: number, b: number) => a * b,
      values,
      dollarRates,
    );

    const sum = R.sum(weightedDollarRates);
    const total = R.sum(values);

    const result = { mean: sum / total, real: 1 / (sum / total) };

    return response.json({ result });
    // // console.log(transactions);

    // console.log(transactions.length);

    // const number_of_bins = 10;
    // const dollar_rate_min = Math.min(...transactions.map(t => t.dollar_rate));
    // const dollar_rate_max = Math.max(...transactions.map(t => t.dollar_rate));
    // const step = (dollar_rate_max - dollar_rate_min) / number_of_bins;
    // console.log(step);
    // const bins = R.range(0, number_of_bins).map(i => ({
    //   low: dollar_rate_min + i * step - step / 2,
    //   high: dollar_rate_min + i * step + step / 2,
    //   val: dollar_rate_min + i * step,
    // }));

    // const binsNew = bins.map(b => ({
    //   ...b,
    //   vall: 1 / b.val,
    //   trans: R.filter(
    //     t => t.dollar_rate >= b.low && t.dollar_rate <= b.high,
    //     transactions,
    //   ),
    // }));

    // // create 10 bins from max_dr to min_dr
    // const bins = [];
    // // eslint-disable-next-line no-plusplus
    // for (let i = 0; i < 10; i++) {
    //   bins.push(min_dr + ((max_dr - min_dr) / 10) * i);
    // }

    // // count how many transactions are in each bin
    // const bin_counts = [];
    // // eslint-disable-next-line no-plusplus
    // for (let i = 0; i < bins.length; i++) {
    //   bin_counts.push(0);
    // }

    // return response.json({ binsNew });
  }
}

export default WalletExposureController;
