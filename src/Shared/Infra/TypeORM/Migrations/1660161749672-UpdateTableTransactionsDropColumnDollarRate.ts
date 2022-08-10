import { MigrationInterface, QueryRunner } from 'typeorm';

export default class UpdateTableTransactionsDropColumnDollarRate1660161749672
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transactions', 'dollar_rate');
  }

  public async down(): Promise<void> {
    throw new Error("Migration's `down` method is not implemented.");
  }
}
