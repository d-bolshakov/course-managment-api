import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { Role, User } from "../../entities/User.entity.js";
import { hash } from "bcryptjs";
import { Subject } from "../../entities/Subject.entity.js";

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const subjectRepository = dataSource.getRepository(Subject);
    const subjectsCount = await subjectRepository.count();
    const users = [];
    for (let i = 1; i < subjectsCount + 11; i++) {
      users.push({
        firstName: `user${i}`,
        lastName: `user${i}test`,
        email: `user${i}@test.com`,
        isEmailConfiirmed: true,
        password: await hash(`user${i}pass`, 3),
        role: i < subjectsCount ? Role.TEACHER : Role.STUDENT,
      });
    }
    const repository = dataSource.getRepository(User);
    await repository.insert(users);
  }
}
