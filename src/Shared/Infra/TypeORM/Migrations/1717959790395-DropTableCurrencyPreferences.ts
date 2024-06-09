import { MigrationInterface, QueryRunner } from 'typeorm';

class DropTableCurrencyPreferences1717959790395 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('currency_preferences', 'currency_id');
    await queryRunner.dropForeignKey('currency_preferences', 'user_id');
    await queryRunner.dropTable('currency_preferences');
  }

  public async down(): Promise<void> {
    throw new Error("Migration's `down` method is not implemented.");
  }
}

export default DropTableCurrencyPreferences1717959790395;
