import { EntityRepository, getRepository, Repository } from 'typeorm';

import IFindByUserIdDTO from '../../../DTOs/IFindByUserIdDTO';
import ICreateUserSettingsDTO from '../../../DTOs/ICreateUserSettingsDTO';
import IUserSettingsRepository from '../../../Repositories/IUserSettingsRepository';
import UserSettings from '../Entities/UserSettings';

@EntityRepository(UserSettings)
class UserSettingsRepository implements IUserSettingsRepository {
  private ormRepository: Repository<UserSettings>;

  constructor() {
    this.ormRepository = getRepository(UserSettings);
  }

  public async findById(id: string): Promise<UserSettings | undefined> {
    const userSettings = await this.ormRepository.findOne(id);

    return userSettings;
  }

  public async findByUserId({
    user_id,
  }: IFindByUserIdDTO): Promise<UserSettings | undefined> {
    const userSettings = await this.ormRepository.findOne({
      where: {
        user_id,
      },
      relations: ['currency'],
    });

    return userSettings;
  }

  public async create(data: ICreateUserSettingsDTO): Promise<UserSettings> {
    const userSettings = this.ormRepository.create(data);

    await this.ormRepository.save(userSettings);

    return userSettings;
  }

  public async save(userSettings: UserSettings): Promise<UserSettings> {
    await this.ormRepository.save(userSettings);

    return userSettings;
  }
}

export default UserSettingsRepository;
