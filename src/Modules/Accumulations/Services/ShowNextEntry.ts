import { add, isAfter } from 'date-fns';
import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';
import Transaction from 'Modules/Transactions/Infra/TypeORM/Entities/Transaction';
import GetUserPreferredCurrencyService from 'Modules/Users/Services/GetUserPreferredCurrencyService';
import IWalletsRepository from 'Modules/Wallets/Repositories/IWalletsRepository';
import { reduce, repeat } from 'ramda';
import AppError from 'Shared/Errors/AppError';
import { changeValue3 } from 'Shared/Helpers/converter';
import { container, inject, injectable } from 'tsyringe';
import Accumulation from '../Infra/TypeORM/Entities/Accumulation';
import IAccumulationsRepository from '../Repositories/IAccumulationsRepository';

type AccumulationEntry = {
  date: Date;
  amount: number;
  entry: number;
  current: number;
  target: number;
};

const getNextEntryDate = async ({
  plan,
  entries,
}: {
  plan: Accumulation;
  entries: Transaction[];
}) => {
  const now = new Date();

  const nEntries = entries.length;
  const hasStarted = isAfter(now, plan.planned_start);
  const hasPreviousEntries = nEntries !== 0;

  if (!hasPreviousEntries && hasStarted) return now;
  if (!hasPreviousEntries) return plan.planned_start;
  return reduce(
    (acc, elem) => add(acc, elem),
    plan.planned_start,
    repeat(plan.every, nEntries),
  );
};

const predictNextEntry = async ({
  sourceCurrency,
  targetCurrency,
  plan,
  entries,
}: {
  sourceCurrency: Currency;
  targetCurrency: Currency;
  plan: Accumulation;
  entries: Transaction[];
}): Promise<AccumulationEntry> => {
  const accumulationValue = reduce(
    (x, y) => x + y,
    0,
    entries.map(e => e.value),
  );

  const accumulationCountervalue = changeValue3(
    sourceCurrency.dollar_rate,
    targetCurrency.dollar_rate,
    accumulationValue,
  );

  const entryNumber = entries.length + 1;

  const targetCountervalue = plan.quote * entryNumber;
  const entryCountervalue = targetCountervalue - accumulationCountervalue;

  return {
    entry: entryNumber,
    amount: entryCountervalue,
    current: accumulationCountervalue,
    target: targetCountervalue,
    date: await getNextEntryDate({
      plan,
      entries,
    }),
  };
};

@injectable()
class ShowNextEntryService {
  constructor(
    @inject('WalletsRepository')
    private walletsRepository: IWalletsRepository,

    @inject('AccumulationsRepository')
    private accumulationsRepository: IAccumulationsRepository,
  ) {}

  public async execute({
    userId,
    accumulationId,
  }: {
    userId: string;
    accumulationId: string;
  }): Promise<AccumulationEntry> {
    const getUserPreferredCurrency = container.resolve(
      GetUserPreferredCurrencyService,
    );

    const accumulation = await this.accumulationsRepository.findById(
      accumulationId,
    );

    if (!accumulation) {
      throw new AppError('Accumulation plan not found!', 404);
    }

    const wallet = await this.walletsRepository.findById(
      accumulation.wallet_id,
    );

    if (!wallet || wallet.user_id !== userId || !wallet.currency) {
      throw new AppError('Accumulation plan not found!!', 404);
    }

    const sourceCurrency = wallet.currency;
    const targetCurrency = await getUserPreferredCurrency.execute({
      user_id: userId,
    });

    return predictNextEntry({
      sourceCurrency,
      targetCurrency,
      plan: accumulation,
      entries: accumulation.entries,
    });
  }
}

export default ShowNextEntryService;
