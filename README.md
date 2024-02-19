# Table of Contents

- [Description](#description)
- [Running the app](#running-the-app)
- [Endpoints](#endpoints)
  - [Authorization](#authorization)
    - [POST /auth/registration](#post-authregistration)
    - [POST /auth/login](#post-authlogin)
    - [GET /auth/logout](#get-authlogout)
  - [Users](#users)
    - [GET /users](#get-users)
    - [GET /users/:id](#get-usersid)
    - [PUT /users/:id](#put-usersid)
    - [DELETE /users/:id](#delete-usersid)
  - [Students](#students)
    - [POST /students](#post-students)
    - [GET /students/](#get-students)
    - [GET /students/:id](#get-studentsid)
    - [DELETE /students/:id](#delete-studentsid)
    - [GET /students/:id/courses](#get-studentsidcourses)
    - [GET /students/:id/assignments](#get-studentsidassignments)
    - [GET /students/:id/submissions](#get-studentsidsubmissions)
  - [Teachers](#teachers)
    - [POST /teachers](#post-teachers)
    - [GET /teachers/](#get-teachers)
    - [GET /teachers/:id](#get-teachersid)
    - [PUT /teachers/:id](#put-teachersid)
    - [DELETE /teachers/:id](#delete-teachersid)
    - [GET /teachers/:id/courses](#get-teachersidcourses)
    - [GET /teachers/:id/assignments](#get-teachersidassignments)
    - [GET /teachers/:id/submissions](#get-teachersidsubmissions)
  - [Subjects](#subjects)
    - [POST /subjects](#post-subjects)
    - [GET /subjects](#get-subjects)
    - [GET /subjects/:id](#get-subjectsid)
    - [PATCH /subjects/:id](#patch-subjectsid)
    - [DELETE /subjects/:id](#delete-subjectsid)
  - [Courses](#courses)
    - [POST /courses](#post-courses)
    - [GET /courses](#get-courses)
    - [GET /courses/:id](#get-coursesid)
    - [PATCH /courses/:id](#patch-coursesid)
    - [DELETE /courses/:id](#delete-coursesid)
  - [Course enrollments](#course-enrollments)
    - [POST /courses/:courseId/enrollments](#post-coursescourseidenrollments)
    - [GET /courses/:courseId/enrollments](#get-coursescourseidenrollments)
    - [GET /courses/:courseId/enrollments/:enrollmentId](#get-coursescourseidenrollmentsenrollmentid)
    - [PATCH /courses/:courseId/enrollments/:enrollmentId](#patch-coursescourseidenrollmentsenrollmentid)
    - [DELETE /courses/:courseId/enrollments/:enrollmentId](#delete-coursescourseidenrollmentsenrollmentid)
  - [Assignments](#assignnments)
    - [POST /assignments](#post-assignments)
    - [GET /assignments](#get-assignments)
    - [GET /assignments/:id](#get-assignmentsid)
    - [PATCH /assignments/:id](#patch-assignmentsid)
    - [DELETE /assignments/:id](#delete-assignmentsid)
  - [Submissions](#submissions)
    - [POST /submissions](#post-submissions)
    - [GET /submissions](#get-submissions)
    - [GET /submissions/:id](#get-submissionsid)
    - [PATCH /submissions/:id](#patch-submissionsid)
    - [DELETE /submissions/:id](#delete-submissionsid)
  - [Submission review](#submission-reviews)
    - [POST /submissions/:submissionId/review](#post-submissionssubmissionidreview)
  - [Files](#files)
    - [GET /files/:id](#get-filesid)

# Description

API for managing educational courses, enrollments to the courses, assignments
and students’ submissions of assignments.

# Running the app

To run the app in development environment run:

```bash
$ docker-compose -f docker-compose.dev.yml up
```

# Endpoints

## Authorization

### POST /auth/registration

Registration of a new user.

The body of the request:

```json
{
    "firstName": string,
    "lastName": string,
    "email": string,
    "password": string
}
```

Returns the created user and a cookie with session id:

```json
{
    "id": number,
    "firstName": string,
    "lastName": string,
    "email": string,
    "isEmailConfirmed": boolean,
    "role": null,
}
```

<hr/>

### POST /auth/login

Logging in.

The body of the request:

```json
{
    "email": string,
    "password": string
}
```

Returns the user and a cookie with session id:

```json
{
    "id": number,
    "firstName": string,
    "lastName": string,
    "email": string,
    "isEmailConfirmed": boolean,
    "role": string or null,
    "studentProfile": {
        "id": number
    },
    "teacherProfile": {
        "id": number
    }
}
```

"studentProfile" and "teacherProfile" will be present in the response only if the user has a corresponding role profile.

<hr/>

### GET /auth/logout

Logging out. Requires a cookie with session id.

<hr/>

## Users

### GET /users/

Getting a list of users. Available only for the users with the "admin" role. Accepts following query parameters for filtering:

```json
{
    "page": number,
    "role": string,
    "emailConfirmed": boolean
}
```

Returns a list of users and a count of records matching applied filters:

```json
{
    "users": [
        {
            "id": number,
            "firstName": string,
            "lastName": string,
            "email": string,
            "isEmailConfirmed": boolean,
            "role": string,
            "studentProfile": {
                "id": number
            },
            "teacherProfile": {
                "id": number
            }
        }
    ],
    "count": number
}
```

<hr/>

### GET /users/:id

Getting a user by it's id. Also supports "me" as an id key and returns the current user's data. Available only for the user with the same id.

Returns the user with a given id:

```json
{
    "id": number,
    "firstName": string,
    "lastName": string,
    "email": string,
    "isEmailConfirmed": boolean,
    "role": string or null,
    "studentProfile": {
        "id": number
    },
    "teacherProfile": {
        "id": number
    }
}
```

<hr/>

### PUT /users/:id

Updating a user. Also supports "me" as an id key. Available only for the user with the same id.

The body of the request:

```json
{
    "firstName": string,
    "lastName": string,
    "email": string,
}
```

Returns the updated user:

```json
{
    "id": number,
    "firstName": string,
    "lastName": string,
    "email": string,
    "isEmailConfirmed": boolean,
    "role": string or null,
    "studentProfile": {
        "id": number
    },
    "teacherProfile": {
        "id": number
    }
}
```

<hr/>

### DELETE /users/:id

Deleting a user. Also supports "me" as an id key. Available only for the user with the same id.

<hr/>

## Students

### POST /students/

Creating a student profile. Requires a cookie with session id.

Returns the created student:

```json
{
    "id": number,
    "userId": number,
    "firstName": string,
    "lastName": string,
    "email": string,
}
```

### GET /students/

Getting a list of students. Accepts "page" query parameter for pagination.

Returns a list of students and a count of records:

```json
{
    "students": [
        {
            "id": number,
            "userId": number,
            "firstName": string,
            "lastName": string,
            "email": string,
        }
    ],
    "count": number
}
```

<hr/>

### GET /students/:id

Getting a student by his id.

Returns a student with a given id:

```json
{
    "id": number,
    "userId": number,
    "firstName": string,
    "lastName": string,
    "email": string,
}
```

<hr/>

### DELETE /students/:id

Deleting a student profile. Available only for the user with corresponding student profile.

### GET /students/:id/courses

Getting a list of courses the student is enrolled to. Accepts folowing query parameters for filtering:

```json
{
    "page": number,
    "subjectId": number,
    "teacherId": number,
    "status": string
}
```

**"status"** can be either a "past", "active" or "future" and is used to filter the courses that have already finished, the ongoing courses and the courses which haven't started yet.

Returns a list of courses and a count of records matching applied filters:

```json
{
    "courses": [
        {
            "id": number,
            "title": string,
            "teacher": {
                "id": number,
                "firstName": string,
                "lastName": string,
            },
            "subject": {
                "id": number,
                "title": string,
            },
        }
    ],
    "count": number
}
```

<hr/>

### GET /students/:id/assignments

Getting a list of assignments for the courses the student is enrolled to. Available only to the user with corresponding student profile. Accepts folowing query parameters for filtering:

```json
{
    "page": number,
    "courseId": number,
    "status": string,
    "completion": string
}
```

**"status"** can be either an "active" or "inactive" and is used to filter the assignments the deadline for which either has already passed or not yet.
**"completion"** can be either a "complete" or "incomplete". "complete" is used to get only those assignments which the student made a submission for and that submission was successfully reviewed by the teacher. “incomplete” is used to get only those assignments which the student didn’t submit or the submission was rejected.

Returns a list of assignments and a count of records matching applied filters:

```json
{
    "assignments": [
        {
            "id": number,
            "title": string,
            "course": {
                "id": number,
                "title": string
            }
        }
    ],
    "count": number
}
```

<hr/>

### GET /students/:id/submissions

Getting a list of submissions of the assignments for the student. Available only to the user with corresponding student profile. Accepts folowing query parameters for filtering:

```json
{
    "page": number,
    "courseId": number,
    "assignmentId": number,
    "status": string
}
```

**"status"** can be either a "submitted", "accepted" or "rejected" and is used to filter the submissions which have not been reviewed yet or were either accepted or rejected.

Returns a list of submissions and a count of records matching applied filters:

```json
{
    "submissions": [
        {
            "id": number,
            "reviewId": number or null,
            "assignment": {
                "id": number,
                "course": {
                    "id": number,
                    "title": string,
                },
            },
            "student": {
                "id": number,
                "firstName": string,
                "lastName": string,
            },
        }
    ],
    "count": number
}
```

<hr/>

## Teachers

### POST /teachers/

Creating a teacher profile. Requires a cookie with session id.

The body of the request:

```json
{
    "subjectIds": number[],
}
```

Returns the created teacher:

```json
{
    "id": number,
    "userId": number,
    "firstName": string,
    "lastName": string,
    "email": string,
    "subjects": [
        {
            "id": number,
            "title": string
        }
    ]
}
```

### GET /teachers/

Getting a list of teachers. Accepts following query parameters for filtering:

```json
{
    "page": number,
    "subjectId": number or number[],
}
```

Returns a list of teachers and a count of records matching applied filters:

```json
{
    "teachers": [
        {
            "id": number,
            "userId": number,
            "firstName": string,
            "lastName": string,
            "subjects": [
                {
                    "id": number,
                    "title": string
                }
            ]
        }
    ],
    "count": number
}
```

<hr/>

### GET /teachers/:id

Getting a teacher by his id.

Returns a teacher with a given id:

```json
{
    "id": number,
    "userId": number,
    "firstName": string,
    "lastName": string,
    "email": string,
    "subjects": [
        {
            "id": number,
            "title": string
        }
    ]
}
```

<hr/>

### PUT /teachers/:id

Updating a teacher profile. Available only for the user with corresponding teacher profile.

The body of the request:

```json
{
    "subjectIds": number[],
}
```

Returns the updated teacher:

```json
{
    "id": number,
    "userId": number,
    "firstName": string,
    "lastName": string,
    "email": string,
    "subjects": [
        {
            "id": number,
            "title": string
        }
    ]
}
```

<hr/>

### DELETE /teachers/:id

Deleting a teacher profile. Available only for the user with corresponding teacher profile.

### GET /teachers/:id/courses

Getting a list of courses of the teacher. Accepts folowing query parameters for filtering:

```json
{
    "page": number,
    "subjectId": number,
    "status": string
}
```

**"status"** can be either a "past", "active" or "future" and is used to filter the courses that have already finished, the ongoing courses and the courses which haven't started yet.

Returns a list of courses and a count of records matching applied filters:

```json
{
    "courses": [
        {
            "id": number,
            "title": string,
            "teacher": {
                "id": number,
                "firstName": string,
                "lastName": string,
            },
            "subject": {
                "id": number,
                "title": string,
            },
        }
    ],
    "count": number
}
```

<hr/>

### GET /teachers/:id/assignments

Getting a list of assignments for the courses of the teacher. Available only to the user with corresponding teacher profile. Accepts folowing query parameters for filtering:

```json
{
    "page": number,
    "courseId": number,
    "status": string,
}
```

**"status"** can be either an "active" or "inactive" and is used to filter the assignments the deadline for which either has already passed or not yet.

Returns a list of assignments and a count of records matching applied filters:

```json
{
    "assignments": [
        {
            "id": number,
            "title": string,
            "course": {
                "id": number,
                "title": string
            }
        }
    ],
    "count": number
}
```

<hr/>

### GET /teachers/:id/submissions

Getting a list of submissions of the assignments of the teacher. Available only to the user with corresponding teacher profile. Accepts folowing query parameters for filtering:

```json
{
    "page": number,
    "courseId": number,
    "assignmentId": number,
    "status": string
}
```

**"status"** can be either a "submitted", "accepted" or "rejected" and is used to filter the submissions which have not been reviewed yet or were either accepted or rejected.

Returns a list of submissions and a count of records matching applied filters:

```json
{
    "submissions": [
        {
            "id": number,
            "reviewId": number or null,
            "assignment": {
                "id": number,
                "course": {
                    "id": number,
                    "title": string,
                },
            },
            "student": {
                "id": number,
                "firstName": string,
                "lastName": string,
            },
        }
    ],
    "count": number
}
```

<hr/>

## Subjects

### POST /subjects/

Creating a subject. Available only for the users with the the "teacher" role.

The body of the request:

```json
{
    "title": string,
}
```

Returns the created subject:

```json
{
    "id": number,
    "title": string
}
```

<hr/>

### GET /subjects/

Getting a list of subjects. Accepts "page" query parameter for pagination.

Returns a list of subjects and a count of records:

```json
{
    "subjects": [
        {
            "id": number,
            "title"
        }
    ],
    "count": number
}
```

<hr/>

### GET /subjects/:id

Getting a subject by it's id.

Returns a subject with a given id:

```json
{
    "id": number,
    "title": string
}
```

<hr/>

### PATCH /subjects/:id

Updating a subject title. Available only for the users with the "admin" role.

The body of the request:

```json
{
    "title": string,
}
```

Returns the updated subject:

```json
{
    "id": number,
    "title": string
}
```

<hr/>

### DELETE /subjects/:id

Deleting a subject. Available only for the users with the "admin" role.

<hr/>

## Courses

### POST /courses/

Creating a course. Requires a cookie with session id. Available only for the users with the "teacher" role.

The body of the request:

```json
{
    "title": string,
    "subjectId": number,
    "maxStudents": number,
    "startsAt": ISO8601 date string,
    "endsAt": ISO8601 date string
}
```

**"subjectId"** should be on the teacher's subjects list.

Returns the created course:

```json
{
    "id": number,
    "title": string,
    "subject": {
        "id": number,
        "title": string,
    },
    "startsAt": ISO8601 date string,
    "endsAt": ISO8601 date string,
    "teacher": {
        "id": number,
        "firstName": string,
        "lastName": string,
    },
}
```

### GET /courses/

Getting a list of courses. Accepts following query parameters for filtering:

```json
{
    "page": number,
    "subjectId": number,
    "teacherId": number,
    "status": string
}
```

**"status"** can be either a "past", "active" or "future" and is used to filter the courses that have already finished, the ongoing courses and the courses which haven't started yet.

Returns a list of courses and a count of records matching applied filters:

```json
{
    "courses": [
        {
            "id": number,
            "title": string,
            "subject": {
                "id": number,
                "title": string,
            },
            "teacher": {
                "id": number,
                "firstName": string,
                "lastName": string,
            },
        }
    ],
    "count": number
}
```

<hr/>

### GET /courses/:id

Getting a course by it's id.

Returns a course with a given id:

```json
{
    "id": number,
    "title": string,
    "subject": {
        "id": number,
        "title": string,
    },
    "startsAt": ISO8601 date string,
    "endsAt": ISO8601 date string,
    "teacher": {
        "id": number,
        "firstName": string,
        "lastName": string,
    },
}
```

<hr/>

### PATCH /courses/:id

Updating a course. Available only for the teacher of the course.

The body of the request:

```json
{
    "title": string,
    "subjectId": number,
    "maxStudents": number,
    "startsAt": ISO8601 date string,
    "endsAt": ISO8601 date string
}
```

Returns the updated course:

```json
{
    "id": number,
    "title": string,
    "subject": {
        "id": number,
        "title": string,
    },
    "startsAt": ISO8601 date string,
    "endsAt": ISO8601 date string,
    "teacher": {
        "id": number,
        "firstName": string,
        "lastName": string,
    },
}
```

<hr/>

### DELETE /courses/:id

Deleting a course. Available only for the teacher of the course.

<hr/>

## Course enrollments

### POST /courses/:courseId/enrollments

Creating an application for an enrollment to the course. Available only for the users with the "student" role.

Returns the created enrollment with 'applied' status:

```json
{
    "id": number,
    "courseId": number,
    "studentId": number,
    "status": "applied",
    "changedAt": ISO8601 date string
}
```

<hr/>

### GET /courses/:courseId/enrollments

Getting a list of enrollments to the course. Available only to the teacher of the course. Accepts folowing query parameters for filtering:

```json
{
    "page": number,
    "status": string,
}
```

**"status"** can be either an "applied", "invited" or "enrolled".

Returns a list of enrollments and a count of records matching applied filters:

```json
{
    "enrollments": [
        {
            "id": number,
            "courseId": number,
            "studentId": number,
            "status": string,
            "changedAt": ISO8601 date string
        }
    ],
    "count": number
}
```

<hr/>

### GET /courses/:courseId/enrollments/:enrollmentId

Getting an enrollment by it's id. Available only to the teacher of the course.

Returns an enrollment with a given id:

```json
{
    "id": number,
    "courseId": number,
    "studentId": number,
    "status": string,
    "changedAt": ISO8601 date string
}
```

<hr/>

### PATCH /courses/:courseId/enrollments/:enrollmentId

Confirming the student's enrollment to the course and updating the enrollment's status. Available only to the teacher of the course.

The body of the request:

```json
{
  "status": "enrolled"
}
```

Returns the updated enrollment:

```json
{
    "id": number,
    "courseId": number,
    "studentId": number,
    "status": "enrolled",
    "changedAt": ISO8601 date string
}
```

<hr/>

### DELETE /courses/:courseId/enrollments/:enrollmentId

Deleting an enrollment. Available only to the student.

<hr/>

## Assignnments

### POST /assignments/

Creating an assignment. Available only for the users with the "teacher" role.

Supports file uploads so should be a "multipart/form-data" request with following fields:

| Field      |        Type         |
| ---------- | :-----------------: |
| courseId   |       number        |
| title      |       string        |
| text       |       string        |
| deadline   | ISO8601 date string |
| attachment |        file         |

Can contain multiple **attachments**.
Course with **"courseId"** should be on the teacher's courses list.

Returns the created assignment:

```json
{
    "id": number,
    "title": string,
    "text": string,
    "deadline": ISO8601 date string,
    "createdAt": ISO8601 date string,
    "attachments": {
        "id": number,
        "fileId": string,
    },
    "course": {
        "id": number,
        "title": string,
    },
}
```

<hr/>

### GET /assignments/

Getting a list of assignments for a course. Requires **"courseId"** query parameter. Available only to the teacher of the course and students enrolled to the course. Accepts following query parameters for filtering:

```json
{
    "page": number,
    "status": string,
    "courseId": number
}
```

**"status"** can be either an "active" or "inactive" and is used to filter the assignments the deadline for which either has already passed or not yet.

Returns a list of assignments and a count of records matching applied filters:

```json
{
    "assignments": [
        {
            "id": number,
            "title": string,
            "course": {
                "id": number,
                "title": string
            }
        }
    ],
    "count": number
}
```

<hr/>

### GET /assignments/:id

Getting an assignment by it's id. Available only to the teacher of the course and students enrolled to the course.

Returns an assignment with a given id:

```json
{
    "id": number,
    "title": string,
    "text": string,
    "deadline": ISO8601 date string,
    "createdAt": ISO8601 date string,
    "attachments": {
        "id": number,
        "fileId": string,
    },
    "course": {
        "id": number,
        "title": string,
    },
}
```

<hr/>

### PATCH /assignments/:id

Updating an assignment. Available only for the teacher of the course.

Supports uploading new attachments so should be a "multipart/form-data" request with following fields:

| Field                |        Type         |
| -------------------- | :-----------------: |
| courseId             |       number        |
| title                |       string        |
| text                 |       string        |
| deadline             | ISO8601 date string |
| deletedAttachmentIds |      number[]       |
| attachment           |        file         |

Returns the updated assignment:

```json
{
    "id": number,
    "title": string,
    "text": string,
    "deadline": ISO8601 date string,
    "createdAt": ISO8601 date string,
    "attachments": {
        "id": number,
        "fileId": string,
    },
    "course": {
        "id": number,
        "title": string,
    },
}
```

<hr/>

### DELETE /assignments/:id

Deleting an assignment. Available only for the teacher of the course.

<hr/>

## Submissions

### POST /submissions/

Creating a submission for an assignment. Available only for the students enrolled to the course.

Supports file uploads so should be a "multipart/form-data" request with following fields:

| Field        |  Type  |
| ------------ | :----: |
| assignmentId | number |
| text         | string |
| comment      | string |
| attachment   |  file  |

Can contain multiple **attachments**.
Assignment with **"assignmentId"** should be on the student's assignments list.

Returns the created submission:

```json
{
    "id": number,
    "text": string,
    "comment": string,
    "createdAt": ISO8601 date string,
    "assignment": {
        "id": number,
        "title": string
    },
    "studentId": number,
    "attachments": {
        "id": number,
        "fileId": string,
    }
}
```

<hr/>

### GET /submissions/

Getting a list of submissions of an assignment. Requires **"assignemntId"** query parameter. Available only to the teacher of the course Accepts following query parameters for filtering:

```json
{
    "page": number,
    "courseId": number,
    "assignmentId": number,
    "status": string
}
```

**"status"** can be either a "submitted", "accepted" or "rejected" and is used to filter the submissions which have not been reviewed yet or were either accepted or rejected.

Returns a list of submissions and a count of records matching applied filters:

```json
{
    "submissions": [
        {
            "id": number,
            "reviewId": number or null,
            "assignment": {
                "id": number,
                "course": {
                    "id": number,
                    "title": string,
                },
            },
            "student": {
                "id": number,
                "firstName": string,
                "lastName": string,
            },
        }
    ],
    "count": number
}
```

<hr/>

### GET /submissions/:id

Getting a submission by it's id. Available only to the teacher of the course and the student who created the submission.

Returns an assignment with a given id:

```json
{
    "id": number,
    "text": string,
    "comment": string,
    "createdAt": ISO8601 date string,
    "assignment": {
        "id": number,
        "title": string
    },
    "studentId": number,
    "review": {
          "id": number,
          "status": string,
          "createdAt": ISO8601 date string,
          "comment": string,
          "mark": {
            "id": number,
            "mark": number,
          },
        },
    "attachments": {
        "id": number,
        "fileId": string,
    }
}
```

<hr/>

### PATCH /submissions/:id

Updating a submission. Available only for the student who created the submission.

Supports uploading new attachments so should be a "multipart/form-data" request with following fields:

| Field                |   Type   |
| -------------------- | :------: |
| text                 |  string  |
| comment              |  string  |
| deletedAttachmentIds | number[] |
| attachment           |   file   |

Can contain multiple **attachments**.

Returns the updated submission:

```json
{
    "id": number,
    "text": string,
    "comment": string,
    "createdAt": ISO8601 date string,
    "assignment": {
        "id": number,
        "title": string
    },
    "studentId": number,
    "review": {
          "id": number,
          "status": string,
          "createdAt": ISO8601 date string,
          "comment": string,
          "mark": {
            "id": number,
            "mark": number,
          },
        },
    "attachments": {
        "id": number,
        "fileId": string,
    }
}
```

<hr/>

### DELETE /submissions/:id

Deleting a submission. Available only for the student who created the submission.

<hr/>

## Submission reviews

### POST /submissions/:submissionId/review

Creating a review for the submission. Available only for the teacher who created the assignment the submission was created for.

The body of the request:

```json
{
    "status": string,
    "comment": string,
    "mark": number
}
```

**"status"** can be either a "accepted" or "rejected".
**"mark"** should be present only if the "status" is "accepted".

Returns the created review:

```json
{
    "id": number,
    "status": string,
    "comment": string,
    "markId": number,
    "createdAt": ISO8601 date string
}
```

<hr/>

## Files

### GET /files/:id

Getting a file by it's id. Available only to the users who have access to the file. If the file refers to an assignment - it's available only to the teacher of the course and students enrolled to the course. If the file refers to a submission - it's available only to the student who created the submission and the teacher of the course. Accepts "download" query parameter with boolean value for downloading the file, otherwise returns a read stream with the contents of the file.
