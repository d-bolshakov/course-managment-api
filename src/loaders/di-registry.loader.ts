import { Lifecycle, container } from "tsyringe";
import { AuthController } from "../controllers/auth.controller.js";
import { UserRepository } from "../repositories/user.repository.js";
import { UserService } from "../core/services/user.service.js";
import type { IUserService } from "../core/services/interfaces/user-service.interface.js";
import type { IUserRepository } from "../repositories/interfaces/user-repository.interface.js";
import type { IStudentRepository } from "../repositories/interfaces/student-repository.interface.js";
import { StudentRepository } from "../repositories/student.repository.js";
import type { IStudentService } from "../core/services/interfaces/student-service.interface.js";
import { StudentService } from "../core/services/student.service.js";
import { StudentController } from "../controllers/student.controller.js";
import type { ITeacherRepository } from "../repositories/interfaces/teacher-repository.interface.js";
import { TeacherRepository } from "../repositories/teacher.repository.js";
import type { ITeacherService } from "../core/services/interfaces/teacher-service.interface.js";
import { TeacherService } from "../core/services/teacher.service.js";
import { TeacherController } from "../controllers/teacher.controller.js";
import type { ISubjectRepository } from "../repositories/interfaces/subject-repository.interface.js";
import { SubjectRepository } from "../repositories/subject.repository.js";
import type { ISubjectService } from "../core/services/interfaces/subject-service.interface.js";
import { SubjectService } from "../core/services/subject.service.js";
import { SubjectController } from "../controllers/subject.controller.js";
import type { ICourseRepository } from "../repositories/interfaces/course-repository.interface.js";
import { CourseRepository } from "../repositories/course.repository.js";
import type { ICourseService } from "../core/services/interfaces/course-service.interface.js";
import { CourseService } from "../core/services/course.service.js";
import { CourseController } from "../controllers/course.controller.js";
import type { IEnrollmentRepository } from "../repositories/interfaces/enrollment-repository.interface.js";
import { EnrollmentRepository } from "../repositories/enrollment.repository.js";
import type { IEnrollmentService } from "../core/services/interfaces/enrollment-service.interface.js";
import { EnrollmentService } from "../core/services/enrollment.service.js";
import { EnrollmentController } from "../controllers/enrollment.controller.js";
import type { IAssignmentRepository } from "../repositories/interfaces/assignment-repository.interface.js";
import { AssignmentRepository } from "../repositories/assignment.repository.js";
import type { IAssignmentService } from "../core/services/interfaces/assignment-service.interface.js";
import { AssignmentService } from "../core/services/assignment.service.js";
import { AssignmentController } from "../controllers/assignment.controller.js";
import type { ISubmissionRepository } from "../repositories/interfaces/submission-repository.interface.js";
import { SubmissionRepository } from "../repositories/submission.repository.js";
import type { ISubmissionService } from "../core/services/interfaces/submission-service.interface.js";
import { SubmissionService } from "../core/services/submission.service.js";
import { SubmissionController } from "../controllers/submission.controller.js";
import type { ITeacherSubjectRepository } from "../repositories/interfaces/teacher-subject-repository.interface.js";
import { TeacherSubjectRepository } from "../repositories/teacher-subject.repository.js";
import type { IAssignmentAttachmentRepository } from "../repositories/interfaces/assignment-attachment-repository.interface.js";
import { AssignmentAttachmentRepository } from "../repositories/assignment-attachment.repository.js";
import type { ISubmissionAttachmentRepository } from "../repositories/interfaces/submission-attachment-repository.interface.js";
import { SubmissionAttachmentRepository } from "../repositories/submission-attachment.repository.js";
import type { IReviewRepository } from "../repositories/interfaces/review-repository.interface.js";
import { ReviewRepository } from "../repositories/review.repository.js";
import type { IReviewService } from "../core/services/interfaces/review-service.interface.js";
import { ReviewService } from "../core/services/review.service.js";
import type { IMarkRepository } from "../repositories/interfaces/mark-repository.interface.js";
import { MarkRepository } from "../repositories/mark.repository.js";
import type { IMarkService } from "../core/services/interfaces/mark-service.interface.js";
import { MarkService } from "../core/services/mark.service.js";
import type { IFileMetadataRepository } from "../repositories/interfaces/file-metadata-repository.interface.js";
import { FileMetadataRepository } from "../repositories/file-metadata.repository.js";
import type { IFileStorageRepository } from "../repositories/interfaces/file-storage-repository.interface.js";
import { FileStorageRepository } from "../repositories/file-storage.repository.js";
import type { IFileService } from "../core/services/interfaces/file-service.interface.js";
import { FileService } from "../core/services/file.service.js";
import type { IAttachmentService } from "../core/services/interfaces/attachment-service.interface.js";
import { AssignmentAttachmentService } from "../core/services/assignment-attachment.service.js";
import { SubmissionAttachmentService } from "../core/services/submission-attachment.service.js";
import { UserController } from "../controllers/user.controller.js";
import { FileController } from "../controllers/file.controller.js";

const registerRepositories = () => {
  container.register<IUserRepository>(
    "user-repository",
    { useClass: UserRepository },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<IStudentRepository>(
    "student-repository",
    { useClass: StudentRepository },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<ITeacherRepository>(
    "teacher-repository",
    { useClass: TeacherRepository },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<ITeacherSubjectRepository>(
    "teacher-subject-repository",
    { useClass: TeacherSubjectRepository },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<ISubjectRepository>(
    "subject-repository",
    { useClass: SubjectRepository },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<ICourseRepository>(
    "course-repository",
    { useClass: CourseRepository },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<IEnrollmentRepository>(
    "enrollment-repository",
    { useClass: EnrollmentRepository },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<IAssignmentRepository>(
    "assignment-repository",
    { useClass: AssignmentRepository },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<IAssignmentAttachmentRepository>(
    "assignment-attachment-repository",
    { useClass: AssignmentAttachmentRepository },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<ISubmissionRepository>(
    "submission-repository",
    { useClass: SubmissionRepository },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<ISubmissionAttachmentRepository>(
    "submission-attachment-repository",
    { useClass: SubmissionAttachmentRepository },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<IReviewRepository>(
    "review-repository",
    { useClass: ReviewRepository },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<IMarkRepository>(
    "mark-repository",
    { useClass: MarkRepository },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<IFileMetadataRepository>(
    "file-metadata-repository",
    { useClass: FileMetadataRepository },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<IFileStorageRepository>(
    "file-storage-repository",
    { useClass: FileStorageRepository },
    { lifecycle: Lifecycle.Singleton }
  );
};

const registerServices = () => {
  container.register<IUserService>(
    "user-service",
    { useClass: UserService },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<IStudentService>(
    "student-service",
    { useClass: StudentService },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<ITeacherService>(
    "teacher-service",
    { useClass: TeacherService },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<ISubjectService>(
    "subject-service",
    { useClass: SubjectService },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<ICourseService>(
    "course-service",
    { useClass: CourseService },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<IEnrollmentService>(
    "enrollment-service",
    { useClass: EnrollmentService },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<IAssignmentService>(
    "assignment-service",
    { useClass: AssignmentService },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<IAttachmentService>(
    "assignment-attachment-service",
    { useClass: AssignmentAttachmentService },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<ISubmissionService>(
    "submission-service",
    { useClass: SubmissionService },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<IAttachmentService>(
    "submission-attachment-service",
    { useClass: SubmissionAttachmentService },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<IReviewService>(
    "review-service",
    { useClass: ReviewService },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<IMarkService>(
    "mark-service",
    { useClass: MarkService },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<IFileService>(
    "file-service",
    { useClass: FileService },
    { lifecycle: Lifecycle.Singleton }
  );
};

const registerControllers = () => {
  container.register<AuthController>(
    "auth-controller",
    { useClass: AuthController },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<StudentController>(
    "student-controller",
    { useClass: StudentController },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<TeacherController>(
    "teacher-controller",
    { useClass: TeacherController },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<SubjectController>(
    "subject-controller",
    { useClass: SubjectController },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<CourseController>(
    "course-controller",
    { useClass: CourseController },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<EnrollmentController>(
    "enrollment-controller",
    { useClass: EnrollmentController },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<AssignmentController>(
    "assignment-controller",
    { useClass: AssignmentController },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<SubmissionController>(
    "submission-controller",
    { useClass: SubmissionController },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<UserController>(
    "user-controller",
    { useClass: UserController },
    { lifecycle: Lifecycle.Singleton }
  );
  container.register<FileController>(
    "file-controller",
    { useClass: FileController },
    { lifecycle: Lifecycle.Singleton }
  );
};

export const setupContainer = () => {
  registerRepositories();
  registerServices();
  registerControllers();
};
