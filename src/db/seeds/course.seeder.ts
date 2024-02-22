import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { Teacher } from "../entities/Teacher.entity.js";
import { Course } from "../entities/Course.entity.js";
import { getDateWithOffset, getRandomInt } from "./utils";

export default class CourseSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const teacherRepository = dataSource.getRepository(Teacher);
    const teachers = await teacherRepository.find({
      relations: { subjects: true },
    });
    const courses = [];
    for (let i = 0; i < teachers.length; i++) {
      for (let j = -7; j <= 8; j += 5) {
        const course = new Course();
        course.title = `course ${i + 1} ${j + 1}`;
        course.subject = teachers[i].subjects[getRandomInt(0, 2)];
        course.maxStudents = getRandomInt(30, 50);
        course.startsAt = getDateWithOffset(j);
        course.endsAt = getDateWithOffset(j + 14);
        course.teacher = teachers[i];
        courses.push(course);
      }
    }
    const repository = dataSource.getRepository(Course);
    await repository.save(courses);
  }
}
