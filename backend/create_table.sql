-- CREATE TABLE student(
-- --   id INTEGER,
--   name VARCHAR,
--   surname VARCHAR,
--   email VARCHAR,
--   password VARCHAR,
--   age INTEGER,
--   PRIMARY KEY (email)
-- );
-- CREATE TABLE tutor(
-- --  id INTEGER,
--   name VARCHAR,
--   surname VARCHAR,
--   email VARCHAR,
--   password VARCHAR,
--   age INTEGER,
--   PRIMARY KEY (email)
-- );
CREATE TABLE users(
  id SERIAL,
  name VARCHAR,
  surname VARCHAR,
  email VARCHAR,
  password VARCHAR,
  age INTEGER,
  role VARCHAR,
  PRIMARY KEY (id)
);

CREATE TABLE course(
  id SERIAL,
  name VARCHAR UNIQUE,
  tutor_id INTEGER,
  student_number INTEGER,
  description TEXT,
  PRIMARY KEY (id),
  FOREIGN KEY (tutor_id) REFERENCES users(id)

);
CREATE TABLE request(
  id SERIAL,
  student_id INTEGER,
  course_id INTEGER,
  tutor_id INTEGER,
  status VARCHAR,
  PRIMARY KEY (id),
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES course(id),
  FOREIGN KEY (tutor_id) REFERENCES users(id)
);

CREATE TABLE students_in_course(

--   student_id INTEGER,
  student_id INTEGER,
  course_id INTEGER,
  FOREIGN KEY (student_id) REFERENCES  users(id),
  FOREIGN KEY (course_id) REFERENCES course (id)
);


