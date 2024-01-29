import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { Role, User } from "../../entities/User.entity.js";
import { Student } from "../../entities/Student.entity.js";

export default class StudentSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const userRepository = dataSource.getRepository(User);
    const studentUsers = await userRepository.find({
      where: { role: Role.STUDENT },
    });

    const repository = dataSource.getRepository(Student);
    const students: Student[] = [];
    studentUsers.map((user: User) => {
      const student = new Student();
      student.user = user;
      students.push(student);
    });
    await repository.save(students);
  }
}
