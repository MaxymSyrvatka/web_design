import React, {Component} from 'react';
import img_user from "../img/student.png";
import 'font-awesome/css/font-awesome.min.css';


export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showing: false,
            user: [],
            courses: [],
            requests: [],
            deleteLink: ''
        }
    }

    componentDidMount() {
        fetch('/profile', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        user: result.user,
                        courses: result.courses,
                        requests: result.requests
                    });
                }
            )
    }

    changeUser = e => {
        e.preventDefault();
        fetch(`/user/${this.state.user.id}/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: this.name,
                surname: this.surname,
                email: this.email,
                age: this.age
            })
        })
            .then(response => {
                window.location.reload();
                return response.json();
            })
    }

    deleteUser = e => {
        e.preventDefault();
        fetch(`/user/${this.state.user.id}/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => {
                return response.json();
            })
    }


    render() {
        return (
            <div>
             <div className="row">
                 <div className="leftcolumn">
                     <div className="card_column">
                         <div className="head">
                             <h2>My Requests</h2>
                             {/*<div className="actions">*/}
                             {/*    {% if current_user.role == roles["student"] %}*/}
                             {/*    <a className="add" href="{{ url_for('create_request') }}"><i*/}
                             {/*        className="fas fa-plus"></i></a>*/}
                             {/*    {% endif %}*/}
                             {/*</div>*/}
                         </div>
                         {/*{% if current_user.role == roles["tutor"] %}*/}
                         {/*{% for request in requests %}*/}
                         {/*{% if request.status == status["approved"] %}*/}
                         {/*<div className="approved_request">*/}
                         {/*    <div className="request_card">*/}
                         {/*        <h3>{{course_request[request.id]}}</h3>*/}
                         {/*    </div>*/}
                         {/*</div>*/}
                         {/*{% endif %}*/}
                         {/*{% if request.status == status["disapproved"] %}*/}
                         {/*<div className="disapproved_request">*/}
                         {/*    <div className="request_card">*/}
                         {/*        <h3>{{course_request[request.id]}}</h3>*/}
                         {/*    </div>*/}
                         {/*</div>*/}
                         {/*{% endif %}*/}
                         {/*{% if request.status == status["sent"] %}*/}
                         {/*<div className="sent_request">*/}
                         {/*    <div className="request_card">*/}
                         {/*        <h3>{{course_request[request.id]}}</h3>*/}
                         {/*    </div>*/}
                         {/*</div>*/}
                         {/*{% endif %}*/}
                         {/*{% endfor %}*/}
                         {/*{% endif %}*/}
                         {this.state.requests.map(request =>
                         <div className="approved_request">
                             <div className="request_card">
                                 {this.state.courses.map(course =>
                                        <h3>{course.id == request.course_id}</h3>
                                        )}
                             </div>
                         </div>
                             )}
                     </div>
                 </div>
                <div className="centercolumn">
                    <div className="profile_card">
                        <div className="flex-row-center">
                            <img src={img_user} alt="profile-picture"
                                 border="0"/>
                            <div className="container">
                                <div className="head">
                                    <h1>{this.state.user.name} {this.state.user.surname}</h1>
                                    <div className="actions">
                                        <a className="edit" >
                                            <i className="fa fa-edit"
                                                                onClick={() => this.setState({ showing: !this.state.showing })}/></a>
                                    </div>
                                    {/*<a className="delete" href={'/user/'+ this.state.user.id +'/delete'}*/}
                                    {/*       ><i>{this.state.user.id}</i></a>*/}
                                    {/*<Link to={`/user/${this.state.user.id}/delete`} onSubmit={this.deleteUser}>DELETE</Link>*/}
                                </div>
                                <p>Role: {this.state.user.role}</p>
                                <p>Age: {this.state.user.age}</p>
                                <p>Email: {this.state.user.email}</p>
                                <h4>My Courses</h4>
                                    {this.state.courses.map(course =>
                                    <p>{course.name}</p>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rightcolumn">
                         <div className="card_column">
                             <div className="head">
                                 <h2>My Courses</h2>
                                 {/*<div className="actions">*/}
                                 {/*    {% if current_user.role == roles["tutor"] %}*/}
                                 {/*    <a className="add" href="{{ url_for('create_course') }}"><i*/}
                                 {/*        className="fas fa-plus"></i></a>*/}
                                 {/*    {% endif %}*/}
                                 {/*</div>*/}
                             </div>
                             {this.state.courses.map(course =>
                             <div className="course_card">
                                 <h2>{course.name}</h2>
                                 <p>Count of students: {course.student_number}</p>
                                 {/*<div className="flex-row-center">*/}
                                 {/*    <div className="actions">*/}
                                 {/*        <a className="edit" href="{{ url_for('update_course', course_id = course.id) }}"><i*/}
                                 {/*            className="fas fa-edit"></i></a>*/}
                                 {/*        <a className="delete" href="{{ url_for('delete_course', course_id = course.id) }}"><i*/}
                                 {/*            className="fas fa-trash"></i></a>*/}
                                 {/*    </div>*/}
                                 {/*</div>*/}
                             </div>
                                 )}
                         </div>
                     </div>
                </div>
            <div>
                {this.state.showing ?
                    <form onSubmit={this.changeUser}>
                        <div className="padding_container">
                            <h1>Update Information</h1>
                            <p>Please fill in this form to update an account.</p>
                            <div className="form_card">
                                <label htmlFor="name"><b>Name</b></label>
                                <div>
                                    <input type="text" placeholder="Name" id="name"
                                           onChange={e => this.name = e.target.value} required/>
                                </div>
                                <label htmlFor="last-name"><b>Last name</b></label>
                                <div>
                                    <input type="text" placeholder="Last name" id="last-name"
                                           onChange={e => this.surname = e.target.value} required/>
                                </div>
                                <label htmlFor="email"><b>Email</b></label>
                                <div>
                                    <input type="text" placeholder="Email" id="email"
                                           onChange={e => this.email = e.target.value} required/>
                                </div>
                                <label htmlFor="age"><b>Age</b></label>
                                <div>
                                    <input type="text" placeholder="Enter Age" id="age" name="age"
                                           onChange={e => this.age = e.target.value} required/>
                                </div>
                            </div>
                            <div className="flex-row-center">
                                <button type="submit" className="confirm_button">Confirm</button>
                            </div>
                        </div>
                    </form>
                    : null
                }
            </div>
        </div>

        )
    }
}