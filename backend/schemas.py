from marshmallow import Schema, fields, post_load, validate
from backend.models import User, Course, Request


class UserSchema(Schema):
    id = fields.Int(required=True)
    name = fields.Str()
    surname = fields.Str()
    email = fields.Email()
    password = fields.Str()
    age = fields.Int()
    role = fields.Str(validate=validate.OneOf(["student", "tutor"]))

    @post_load
    def user_create(self, data, **kwargs):
        return User(**data)


class CourseSchema(Schema):
    id = fields.Int(required=True)
    student_number = fields.Int()
    name = fields.Str()
    tutor_email = fields.Int()
    description = fields.Str()
    students = fields.List(fields.Nested(UserSchema(only=["email"])))

    @post_load
    def course_create(self, data, **kwargs):
        return Course(**data)


class RequestSchema(Schema):
    id = fields.Int(required=True)
    status = fields.Str(validate = validate.OneOf(["placed", "approved", "disapproved"]))
    student_email = fields.Str()
    course_id = fields.Int()

    @post_load
    def request_create(self, data, **kwargs):
        return Request(**data)