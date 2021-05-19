from flask import Flask, request, jsonify, redirect, render_template, url_for, json
from flask_bcrypt import Bcrypt, check_password_hash
from flask_httpauth import HTTPBasicAuth
from marshmallow import ValidationError
from backend.models import Session, User, Course, Request, Role, RequestStatus
from flask_login import login_user, LoginManager, login_required, logout_user, current_user
from backend.schemas import UserSchema, CourseSchema, RequestSchema


app = Flask(__name__, template_folder="templates", static_folder="templates/styles")
auth = HTTPBasicAuth()
bcrypt = Bcrypt(app)
s = Session()

app.secret_key = "bfjkdnjkdfbfbkejnelkfnlekk"

login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    user = s.query(User).get(user_id)
    if user is not None:
        return user


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        user_data = request.json
        username = user_data['email']
        password = user_data['password']

        user = s.query(User).filter(User.email == username).one_or_none()
        if user is not None:
            if username and password:
                if check_password_hash(user.password, password):
                    login_user(user)
                    return {"message": "You are log in!"}


@app.route('/')
def index():
    return render_template("base.html")


@app.route('/profile')
def profile():
    tutor_name = {}
    course_request = {}
    roles = {"tutor": Role.tutor, "student": Role.student}
    status = {"sent": RequestStatus.placed, "approved": RequestStatus.approved, "disapproved": RequestStatus.delivered}
    if current_user.role == Role.tutor:
        courses = s.query(Course).filter(Course.tutor_id == current_user.id)
        for course in courses:
            requests = s.query(Request).filter(Request.course_id == course.id)
            for request in requests:
                course_request[request.id] = course.name
    else:
        courses = s.query(Course).filter(Course.students.any(User.id == current_user.id))
        requests = s.query(Request).filter(Request.student_id == current_user.id)
    for course in courses:
        tutor = s.query(User).filter(User.id == current_user.id).one_or_none()
        tutor_name[current_user.id] = tutor.name
    courses = CourseSchema(many=True).dump(courses)
    user = UserSchema().dump(current_user)
    requests = RequestSchema(many=True).dump(requests)

    return jsonify(user=user, requests=requests, courses=courses)
    # return render_template('profile.html', courses=courses, roles=roles, requests=requests,
    #                       status=status, course_request=course_request)


@app.route('/users_list', methods=['GET'])
def show_all_users():
    users = s.query(User).all()
    return jsonify(UserSchema(many=True).dump(users))


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/user', methods=['POST'])
def create_user():
    autoinc = len(s.query(User).all())
    user_data = request.json
    user_schema = UserSchema()
    parsed = {
        'id': autoinc + 1,
        'email': user_data['email'],
        'name': user_data['name'],
        'surname': user_data['surname'],
        'password': bcrypt.generate_password_hash(user_data['password']).decode('utf-8'),
        'age': user_data['age'],
        'role': user_data['role']
    }

    user = user_schema.load(parsed)
    s.add(user)
    s.commit()
    return 'User is created!'


@app.route('/user/<user_id>', methods=["GET"])
def show_user(user_id):
    user = s.query(User).filter(User.id == user_id).one_or_none()

    user_schema = UserSchema(exclude=['password'])
    user_res = user_schema.dump(user)
    return jsonify({'student': user_res})


@app.route('/user/<user_id>/update', methods=['PUT'])
def update_user(user_id):
    user_data = request.json
    user_schema = UserSchema()
    user = s.query(User).filter(User.id == user_id).one_or_none()

    try:
        user_schema.dump(user)
    except ValidationError as err:
        return 'invalid id', 400
    if user is None:
        return 'The user doesn`t exist', 404

    if current_user.email != user.email:
        return 'You don`t have a permission to update this user!', 401

    parsed = {
        "id": user.id,
        "email": user_data['email'],
        "name": user_data['name'],
        "surname": user_data['surname'],
        "age": user_data["age"],

    }

    data = user_schema.load(parsed)

    user.name = data.name
    user.surname = data.surname
    user.email = data.email
    user.age = data.age
    s.commit()
    return user_schema.dump(user)


@app.route('/user/<user_id>/delete', methods=["DELETE"])
def delete_user(user_id):
    user = s.query(User).filter(User.id == user_id).one_or_none()
    if user is None:
        return 'The tutor doesn`t exist', 400
    if current_user.email != user.email:
        return 'You don`t have a permission to delete this tutor!', 401
    s.delete(user)
    s.commit()
    return redirect(url_for("create_user"))


































@app.route('/courses', methods=['GET', 'POST'])
def show_all_courses():
    courses = s.query(Course).all()
    return render_template("courses.html", courses=courses)


@app.route('/courses/<course_id>')
def show_all_courses_ajax(course_id):
    course = s.query(Course).filter(Course.id == course_id).one_or_none()
    return {"name": course.name, "student_number": course.student_number, "description": course.description}


@app.route('/course', methods=['GET', 'POST'])
def create_course():
    if not current_user.is_authenticated:
        return "Please, log in!"
    if current_user.role == Role.student:
        return "You don`t have permissions to create course!"
    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')

        if (s.query(Course).filter(Course.name == name).one_or_none() is not None):
            return redirect(url_for('create_course'))
        course = Course(name=name, description=description, student_number=0, tutor_id=current_user.id)

        s.add(course)
        s.commit()
        return redirect(url_for('profile'))
    return render_template("add_course.html")


@app.route('/course/<course_id>/update', methods=["GET", 'POST'])
def update_course(course_id):
    if not current_user.is_authenticated:
        return "Please, log in!"
    if current_user.role == Role.student:
        return "You don`t have permissions to create course!"
    course = s.query(Course).filter(Course.id == course_id).one_or_none()
    if request.method == "POST":
        course_schema = CourseSchema()

        name = request.form.get('name')
        description = request.form.get('description')

        try:
            course_schema.dump(course)
        except ValidationError as err:
            return 'invalid id', 400
        if course is None:
            return 'The course doesn`t exist', 404

        if current_user.id != course.tutor_id:
            return 'You don`t have a permission to update this course!', 401

        course.name = name
        course.description = description
        s.commit()
        return redirect(url_for('profile'))
    return render_template('edit_course.html', course=course)


@app.route('/course/<course_id>/delete', methods=['GET'])
def delete_course(course_id):
    if not current_user.is_authenticated:
        return "Please, log in!"
    if current_user.role == Role.student:
        return "You don`t have permissions to create course!"
    course = s.query(Course).filter(Course.id == course_id).one_or_none()
    tutor = s.query(User).filter(User.id == course.tutor_id).one_or_none()
    if course is None:
        return 'The course doesn`t exist', 400
    if current_user.email != tutor.email:
        return 'You don`t have a permission to delete this course!', 401
    s.delete(course)
    s.commit()
    return redirect(url_for("profile"))


@app.route('/user/request', methods=["GET", 'POST'])
def create_request():
    if not current_user.is_authenticated:
        return "Please, log in!"
    if current_user.role == Role.tutor:
        return "You don`t have permissions to create request!"

    if request.method == 'POST':
        student = s.query(User).filter(User.id == current_user.id).one_or_none()

        if student is None:
            return 'The student doesn`t exist', 400
        if current_user.email != student.email:
            return 'You don`t have a permission to delete this course!', 401

        course_name = request.form.get("name")
        course = s.query(Course).filter(Course.name == course_name).one_or_none()

        if course is None:
            return 'The course doesn`t exist', 400
        if course.student_number > 5:
            return 'You can not join this course', 500

        request_schema = RequestSchema()

        new_request = Request(course_id=course.id, student_id=current_user.id, status='placed')

        old_requests = s.query(Request).filter(Request.student_id == current_user.id).filter(Request.course_id == course.id)

        if old_requests is None:
            return 'This request has been sent earlier. Wait for approving', 400

        s.add(new_request)
        s.commit()
        return redirect(url_for("profile"))
    return render_template("add_request.html")


@app.route('/user/approve_request/<request_id>', methods=['GET'])
def approve_request(request_id):
    if not current_user.is_authenticated:
        return "Please, log in!"
    if current_user.role == Role.student:
        return "You don`t have permissions to approve request!"

    tutor = s.query(User).filter(User.id == current_user.id).one_or_none()
    if tutor is None:
        return 'The tutor doesn`t exist', 400

    student_request = s.query(Request).filter(Request.id == request_id).one_or_none()
    if student_request is None:
        return 'The request doesn`t exist', 400

    if current_user.email != tutor.email:
        return 'You don`t have a permission to approve(disapprove) the request!', 401

    student_request.status = 'approved'

    student = s.query(User).filter(User.id == student_request.student_id).one_or_none()

    current_course = s.query(Course).filter(Course.id == student_request.course_id).one_or_none()

    if int(current_course.tutor_id) != int(tutor.id):
        return 'You don`t have a permission to approve the request!', 401

    course = s.query(Course).filter(Course.id == student_request.course_id).one_or_none()
    course.student_number = course.student_number + 1
    course.students.append(student)

    s.commit()
    return redirect(url_for("profile"))


@app.route('/user/disapprove_request/<request_id>', methods=["GET", 'POST'])
def disapprove_request(request_id):
    if not current_user.is_authenticated:
        return "Please, log in!"
    if current_user.role == Role.tutor:
        return "You don`t have permissions to create request!"
    if request.method == 'POST':
        tutor = s.query(User).filter(User.id == current_user.id).one_or_none()
        if tutor is None:
            return 'The tutor doesn`t exist', 400

        student_request = s.query(Request).filter(Request.id == request_id).one_or_none()
        if student_request is None:
            return 'The request doesn`t exist', 400

        if auth.current_user() != tutor.email:
            return 'You don`t have a permission to approve(disapprove) the request!', 401

        student_request.status = 'delivered'

        current_course = s.query(Course).filter(Course.id == student_request.course_id).one_or_none()

        if int(current_course.tutor_id) != int(tutor.id):
            return 'You don`t have a permission to approve the request!', 401

        s.commit()
        return redirect(url_for("profile"))
    return "Done!!!"


if __name__ == '__main__':
    app.run(port='5003')
