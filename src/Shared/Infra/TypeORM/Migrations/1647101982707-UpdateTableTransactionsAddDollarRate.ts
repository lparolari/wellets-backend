import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class UpdateTableTransactionsAddDollarRate1647101982707
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'dollar_rate',
        type: 'decimal',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transactions', 'dollar_rate');
  }
}
