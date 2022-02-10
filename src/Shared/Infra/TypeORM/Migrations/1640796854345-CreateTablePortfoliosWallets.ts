import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateTablePortfoliosWallets1640796854345
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'portfolios_wallets',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'portfolio_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'wallet_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'portfolios_wallets',
      new TableForeignKey({
        name: 'portfolio_id',
        columnNames: ['portfolio_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'portfolios',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'portfolios_wallets',
      new TableForeignKey({
        name: 'wallet_id',
        columnNames: ['wallet_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'wallets',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('portfolios_wallets', 'portfolio_id');
    await queryRunner.dropForeignKey('portfolios_wallets', 'wallet_id');
    await queryRunner.dropTable('portfolios_wallets');
  }
}
