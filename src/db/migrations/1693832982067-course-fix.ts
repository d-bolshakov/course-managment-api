import { MigrationInterface, QueryRunner } from "typeorm";

export class CourseFix1693832982067 implements MigrationInterface {
    name = 'CourseFix1693832982067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" RENAME COLUMN "endsdAt" TO "endsAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" RENAME COLUMN "endsAt" TO "endsdAt"`);
    }

}
