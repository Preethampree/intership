import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProviderFieldToUser1757481000000 implements MigrationInterface {
    name = 'AddProviderFieldToUser1757481000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "provider" character varying NOT NULL DEFAULT 'google'`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "provider"`);
    }
}
