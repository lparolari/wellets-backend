import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

class UpdateCurrenciesCascadeDelete1699117511615 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('wallets', 'currency_id');
    await queryRunner.dropForeignKey('currency_preferences', 'currency_id');
    await queryRunner.dropForeignKey('assets', 'currency_id');

    await queryRunner.createForeignKey(
      'wallets',
      new TableForeignKey({
        name: 'currency_id',
        columnNames: ['currency_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'currencies',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'currency_preferences',
      new TableForeignKey({
        name: 'currency_id',
        columnNames: ['currency_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'currencies',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'assets',
      new TableForeignKey({
        name: 'currency_id',
        columnNames: ['currency_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'currencies',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(): Promise<void> {
    throw new Error("Migration's `down` method is not implemented.");
  }
}

export default UpdateCurrenciesCascadeDelete1699117511615;
