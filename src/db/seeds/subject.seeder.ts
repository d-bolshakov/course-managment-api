import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import { Subject } from "../../entities/Subject.entity.js";

export default class SubjectSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const repository = dataSource.getRepository(Subject);
    await repository.insert([
      { title: "English" },
      { title: "Spanish" },
      { title: "French" },
      { title: "Java" },
      { title: "Rust" },
      { title: "Python" },
      { title: "Math" },
      { title: "Physics" },
      { title: "Chemistry" },
      { title: "History" },
      { title: "Biology" },
      { title: "Sociology" },
      { title: "Economics" },
      { title: "Computer science" },
      { title: "Databases" },
      { title: "Hardware" },
    ]);
  }
}
