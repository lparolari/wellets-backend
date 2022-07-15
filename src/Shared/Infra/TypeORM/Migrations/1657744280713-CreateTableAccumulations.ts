import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export default class CreateTableAccumulations1657744280713
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'accumulations',
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
            name: 'strategy',
            type: 'varchar',
          },
          {
            name: 'quote',
            type: 'decimal',
          },
          {
            name: 'entries',
            type: 'integer',
          },
          {
            name: 'every',
            type: 'interval',
          },
          {
            name: 'portfolio_id',
            type: 'uuid',
          },
          {
            name: 'planned_start',
            type: 'timestamp',
          },
          {
            name: 'planned_end',
            type: 'timestamp',
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
      'accumulations',
      new TableForeignKey({
        name: 'accumulations__portfolios__portfolio_id',
        columnNames: ['portfolio_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'portfolios',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(): Promise<void> {
    throw new Error("Migration's `down` method is not implemented.");
  }
}
