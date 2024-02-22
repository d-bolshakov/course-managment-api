import { MigrationInterface, QueryRunner } from "typeorm";

export class Entities1693684417403 implements MigrationInterface {
    name = 'Entities1693684417403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."enrollment_status_enum" AS ENUM('applied', 'invited', 'enrolled')`);
        await queryRunner.query(`CREATE TABLE "enrollment" ("id" SERIAL NOT NULL, "status" "public"."enrollment_status_enum" NOT NULL DEFAULT 'applied', "changedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "courseId" integer NOT NULL, "studentId" integer NOT NULL, CONSTRAINT "PK_7e200c699fa93865cdcdd025885" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, CONSTRAINT "REL_b35463776b4a11a3df3c30d920" UNIQUE ("userId"), CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'teacher', 'student')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying(30) NOT NULL, "lastName" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "isEmailConfirmed" boolean NOT NULL DEFAULT false, "password" character varying(100) NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'student', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subject" ("id" SERIAL NOT NULL, "title" character varying(30) NOT NULL, CONSTRAINT "PK_12eee115462e38d62e5455fc054" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teacher" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, CONSTRAINT "REL_4f596730e16ee49d9b081b5d8e" UNIQUE ("userId"), CONSTRAINT "PK_2f807294148612a9751dacf1026" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "course" ("id" SERIAL NOT NULL, "title" character varying(30) NOT NULL, "maxStudents" integer NOT NULL, "startsAt" TIMESTAMP WITH TIME ZONE NOT NULL, "endsdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "teacherId" integer, CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session" ("expiredAt" bigint NOT NULL, "id" character varying(255) NOT NULL, "json" text NOT NULL, "destroyedAt" TIMESTAMP, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_28c5d1d16da7908c97c9bc2f74" ON "session" ("expiredAt") `);
        await queryRunner.query(`CREATE TABLE "teacher_subject" ("teacherId" integer NOT NULL, "subjectId" integer NOT NULL, CONSTRAINT "PK_d684f35909860165fa3f80fa12b" PRIMARY KEY ("teacherId", "subjectId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_22041399178113c9f08915f65a" ON "teacher_subject" ("teacherId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d45dd4ef36ee9d722e23b9da31" ON "teacher_subject" ("subjectId") `);
        await queryRunner.query(`ALTER TABLE "enrollment" ADD CONSTRAINT "FK_d1a599a7740b4f4bd1120850f04" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollment" ADD CONSTRAINT "FK_5ce702e71b98cc1bb37b81e83d8" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_b35463776b4a11a3df3c30d920a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teacher" ADD CONSTRAINT "FK_4f596730e16ee49d9b081b5d8e5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "course" ADD CONSTRAINT "FK_3e002f760e8099dd5796e5dc93b" FOREIGN KEY ("teacherId") REFERENCES "teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teacher_subject" ADD CONSTRAINT "FK_22041399178113c9f08915f65af" FOREIGN KEY ("teacherId") REFERENCES "teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "teacher_subject" ADD CONSTRAINT "FK_d45dd4ef36ee9d722e23b9da312" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teacher_subject" DROP CONSTRAINT "FK_d45dd4ef36ee9d722e23b9da312"`);
        await queryRunner.query(`ALTER TABLE "teacher_subject" DROP CONSTRAINT "FK_22041399178113c9f08915f65af"`);
        await queryRunner.query(`ALTER TABLE "course" DROP CONSTRAINT "FK_3e002f760e8099dd5796e5dc93b"`);
        await queryRunner.query(`ALTER TABLE "teacher" DROP CONSTRAINT "FK_4f596730e16ee49d9b081b5d8e5"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_b35463776b4a11a3df3c30d920a"`);
        await queryRunner.query(`ALTER TABLE "enrollment" DROP CONSTRAINT "FK_5ce702e71b98cc1bb37b81e83d8"`);
        await queryRunner.query(`ALTER TABLE "enrollment" DROP CONSTRAINT "FK_d1a599a7740b4f4bd1120850f04"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d45dd4ef36ee9d722e23b9da31"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_22041399178113c9f08915f65a"`);
        await queryRunner.query(`DROP TABLE "teacher_subject"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_28c5d1d16da7908c97c9bc2f74"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "course"`);
        await queryRunner.query(`DROP TABLE "teacher"`);
        await queryRunner.query(`DROP TABLE "subject"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "student"`);
        await queryRunner.query(`DROP TABLE "enrollment"`);
        await queryRunner.query(`DROP TYPE "public"."enrollment_status_enum"`);
    }

}
