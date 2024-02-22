import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { Role, User } from "../entities/User.entity.js";
import { Teacher } from "../entities/Teacher.entity.js";
import { Subject } from "../entities/Subject.entity.js";

export default class TeacherSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    const subjectRepository = dataSource.getRepository(Subject);
    const teacherUsers = await userRepository.find({
      where: { role: Role.TEACHER },
    });
    const subjects = await subjectRepository.find();
    const teachers: Teacher[] = [];
    for (let i = 0; i < teacherUsers.length; i++) {
      const teacher = new Teacher();
      teacher.user = teacherUsers[i];
      const subjectId1 = i;
      const subjectId2 =
        i < subjects.length / 2
          ? subjects.length / 2 + i
          : i - subjects.length / 2;
      teacher.subjects = [subjects[subjectId1], subjects[subjectId2]];
      teachers.push(teacher);
    }
    const repository = dataSource.getRepository(Teacher);
    await repository.save(teachers);
  }
}
