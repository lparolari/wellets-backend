import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class UpdateTableAccumulations1660077268601
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'accumulations',
      'accumulations__wallets__wallet_id__fk',
    );

    await queryRunner.dropColumn('accumulations', 'wallet_id');

    await queryRunner.addColumn(
      'accumulations',
      new TableColumn({
        name: 'asset_id',
        type: 'uuid',
      }),
    );

    await queryRunner.createForeignKey(
      'accumulations',
      new TableForeignKey({
        name: 'accumulations__assets__asset_id__fk',
        columnNames: ['asset_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'assets',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(): Promise<void> {
    throw new Error("Migration's `down` method is not implemented.");
  }
}
