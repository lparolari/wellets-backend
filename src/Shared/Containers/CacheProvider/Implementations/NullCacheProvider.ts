/* eslint-disable @typescript-eslint/no-unused-vars */

import ICacheProvider from '../Models/ICacheProvider';

class NullCacheProvider implements ICacheProvider {
  public async save<T>(key: string, value: T, expires = 2 * 60): Promise<void> {
    // Do nothing
  }

  public async find<T>(key: string): Promise<T | null> {
    return null;
  }

  public async delete(key: string): Promise<void> {
    // Do nothing
  }

  public async deleteByPrefix(prefix: string): Promise<void> {
    // Do nothing
  }
}

export default NullCacheProvider;
