import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

class UpdateTableWalletsAddColumnDescription1699107293264
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'wallets',
      new TableColumn({
        name: 'description',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(): Promise<void> {
    throw new Error("Migration's `down` method is not implemented.");
  }
}

export default UpdateTableWalletsAddColumnDescription1699107293264;
