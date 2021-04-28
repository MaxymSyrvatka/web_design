from sqlalchemy.orm import backref
from sqlalchemy import *
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session, relationship
from flask_login import UserMixin
import enum

engine = create_engine("postgresql+psycopg2://postgres:ujhjljr2002@localhost:5432/postgres")

SessionFactory = sessionmaker(bind=engine)
Session = scoped_session(SessionFactory)
Base = declarative_base()


class RequestStatus(enum.Enum):
    placed = "sent"
    approved = "approved"
    delivered = "disapproved"


class Role(enum.Enum):
    tutor = "tutor"
    student = "student"


students_in_course = Table("students_in_course",
                       Base.metadata,
                       Column("student_id", Integer(), ForeignKey("users.id")),
                       Column("course_id", Integer(), ForeignKey("course.id")))


class User(UserMixin, Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    surname = Column(String)
    email = Column(String)
    password = Column(String)
    age = Column(String)
    role = Column(Enum(Role))
    courses = relationship('Course', secondary=students_in_course, lazy="subquery",
                            backref=backref("course", lazy=True))


class Course(Base):
    __tablename__ = "course"
    id = Column(Integer, primary_key=True)
    student_number = Column(Integer)
    name = Column(String)
    description = Column(Text)
    tutor_id = Column(Integer, ForeignKey(User.id))
    students = relationship(User, secondary=students_in_course, lazy="subquery",
                            backref=backref("course", lazy=True))


class Request(Base):
    __tablename__ = "request"
    id = Column(Integer, primary_key=True)
    status = Column(Enum(RequestStatus))
    student_id = Column(Integer, ForeignKey(User.id))
    course_id = Column(Integer, ForeignKey(Course.id))


Base.metadata.create_all(engine)
