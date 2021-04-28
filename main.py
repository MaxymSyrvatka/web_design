from flask import Flask, request, jsonify, session, redirect, render_template, url_for
from flask_bcrypt import Bcrypt, check_password_hash
from flask_httpauth import HTTPBasicAuth
from integer import Integer
from marshmallow import ValidationError
from models import Session, User, Course, Request, Role, RequestStatus
from flask_login import login_user, LoginManager, login_required, logout_user, current_user
from schemas import UserSchema, CourseSchema, RequestSchema


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
    if request.method == 'POST':

        username = request.form['username']
        password = request.form['password']

        user = s.query(User).filter(User.email == username).one_or_none()
        print(user)
        if user is not None:
            if username and password:
                if check_password_hash(user.password, password):
                    login_user(user)
                    return redirect(url_for('profile'))
        return render_template('sign_in.html')

    return render_template('sign_in.html')


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
    print(course_request)
    return render_template('profile.html', courses=courses, tutor_name=tutor_name, roles=roles, requests=requests,
                           status=status, course_request=course_request)


@app.route('/users_list', methods=['GET', 'POST'])
def show_all_users():
    users = s.query(User).all()
    return render_template("list_users.html", users=users)


@app.route('/users_list/<user_id>')
def show_all_users_ajax(user_id):
    user = s.query(User).filter(User.id == user_id).one_or_none()
    role = "Student" if user.role == Role.student else "Tutor"
    return {"name": user.name, "surname": user.surname, "role": role, "age": user.age, "email": user.email}


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/user', methods=['GET', 'POST'])
def create_user():
    if request.method == 'POST':
        email = request.form.get('email')
        name = request.form.get('name')
        surname = request.form.get('last_name')
        password = request.form.get('password')
        age = request.form.get('age')
        role = request.form.get('role')

        if (s.query(User).filter(User.email == email).one_or_none() is not None):
            return redirect(url_for('create_user'))
        user = User(email=email, name=name, surname=surname, password=bcrypt.generate_password_hash(password).decode('utf-8'),
                    age=age, role=role)

        s.add(user)
        s.commit()
        return redirect(url_for('login'))
    return render_template("registration.html")


@app.route('/user/<user_id>')
def show_user(user_id):
    schema = UserSchema()
    user = s.query(User).filter(User.id == user_id).one_or_none()

    return render_template("student.html", user=user)


@app.route('/user/<user_id>/update', methods=['GET', 'POST'])
def update_user(user_id):
    user = s.query(User).filter(User.id == user_id).one_or_none()
    if request.method == "POST":
        user_schema = UserSchema()

        email = request.form.get('email')
        name = request.form.get('name')
        surname = request.form.get('last_name')
        age = request.form.get('age')

        try:
            user_schema.dump(user)
        except ValidationError as err:
            return 'invalid id', 400
        if user is None:
            return 'The user doesn`t exist', 404

        if current_user.email != user.email:
            return 'You don`t have a permission to update this user!', 401

        user.name = name
        user.surname = surname
        user.email = email
        user.age = age
        s.commit()
        return redirect(url_for('profile'))
    return render_template('edit_user.html', user=user)


@app.route('/user/<user_id>/delete', methods=["GET"])
def delete_user(user_id):
    print(request.method)
    user = s.query(User).filter(User.id == user_id).one_or_none()
    print(user)
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
