import { container, injectable } from 'tsyringe';

import Currency from 'Modules/Currencies/Infra/TypeORM/Entities/Currency';
import ShowUserSettingsService from './ShowUserSettingsService';

interface IRequest {
  user_id: string;
}

@injectable()
class GetUserPreferredCurrencyService {
  public async execute({ user_id }: IRequest): Promise<Currency> {
    const showUserSettings = container.resolve(ShowUserSettingsService);

    const userSettings = await showUserSettings.execute({ user_id });

    return userSettings.currency;
  }
}

export default GetUserPreferredCurrencyService;
