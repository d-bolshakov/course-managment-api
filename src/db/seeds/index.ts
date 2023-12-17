import { runSeeders } from "typeorm-extension";
import { AppDataSource } from "../data-source";
import SubjectSeeder from "./subject.seeder";
import UserSeeder from "./user.seeder";
import StudentSeeder from "./student.seeder";
import TeacherSeeder from "./teacher.seeder";
import CourseSeeder from "./course.seeder";

(async () => {
  const dataSource = await AppDataSource.initialize();
  runSeeders(dataSource, {
    seeds: [
      SubjectSeeder,
      UserSeeder,
      StudentSeeder,
      TeacherSeeder,
      CourseSeeder,
    ],
    factories: ["src/db/factories/**/*{.ts,.js}"],
  });
})();
