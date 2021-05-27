import React, {Component} from 'react';
import img_user from "../img/student.png";
import 'font-awesome/css/font-awesome.min.css';
import {Link} from "react-router-dom";


export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showing: false,
            user: [],
            courses: [],
            requests: [],
            all_courses: []
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
                        requests: result.requests,
                        all_courses: result.all_courses
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
                window.location.href = '/user';
                return response.json();
            })
    }

    disapproveRequest = id => {
        fetch(`/user/disapprove_request/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => {
                window.location.reload();
                return response.json();
            })
    }
    approveRequest = id => {
        fetch(`/user/approve_request/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => {
                window.location.reload();
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
                             <div className="actions">
                                 {(() => {
                                  if (this.state.user.role == 'Role.student') {
                                    return (<a className="add" href="/request"><i
                                     className="fa fa-plus"/></a>)
                                  }
                                 })()}
                             </div>
                         </div>
                         {this.state.requests.filter(filteredRequests => (filteredRequests.student_id == this.state.user.id ||
                         filteredRequests.tutor_id == this.state.user.id) && filteredRequests.status == "RequestStatus.placed").map(request =>
                             <div className="sent_request">
                                 <div className="request_card">
                                    {this.state.all_courses.filter(course => course.id == request.course_id).map(filteredCourse =>
                                    <h3>
                                        {filteredCourse.name} {(() => {
                                            if (this.state.user.role == 'Role.tutor') {
                                                return (<div><Link className="add" onClick={() => this.approveRequest(request.id)}><i
                                     className="fa fa-check"/></Link> <Link className="delete" onClick={() => this.disapproveRequest(request.id)}><i
                                                    className="fa fa-times"/></Link></div>)
                                            }
                                    })()}
                                    </h3>)}
                                 </div>
                             </div>
                                 )}
                         {this.state.requests.filter(filteredRequests => (filteredRequests.student_id == this.state.user.id ||
                         filteredRequests.tutor_id == this.state.user.id) && filteredRequests.status == "RequestStatus.approved").map(request =>
                             <div className="approved_request">
                                 <div className="request_card">
                                    {this.state.all_courses.filter(course => course.id == request.course_id).map(filteredCourse =>
                                    <h3>
                                        {filteredCourse.name}
                                    </h3>)}
                                 </div>
                             </div>
                                 )}
                         {this.state.requests.filter(filteredRequests => (filteredRequests.student_id == this.state.user.id ||
                         filteredRequests.tutor_id == this.state.user.id) && filteredRequests.status == "RequestStatus.delivered").map(request =>
                             <div className="disapproved_request">
                                 <div className="request_card">
                                    {this.state.all_courses.filter(course => course.id == request.course_id).map(filteredCourse =>
                                    <h3>
                                        {filteredCourse.name}
                                    </h3>)}
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
                                    <h1 data-testid="name">{this.state.user.name} {this.state.user.surname}</h1>
                                    <div className="actions">
                                        <a className="edit">
                                            <i className="fa fa-edit"
                                                                onClick={() => this.setState({ showing: !this.state.showing })}/> </a>
                                        <a className="delete" onClick={this.deleteUser}>
                                            <i className="fa fa-trash"></i></a>
                                    </div>
                                </div>
                                {(() => {
                                if (this.state.user.role == 'Role.tutor') {
                                    return (<p>Role: Tutor</p>)
                                }
                                else {
                                    return (<p>Role: Student</p>)
                                            }})()}
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
                                 <div className="actions">
                                     {(() => {
                                      if (this.state.user.role == 'Role.tutor') {
                                        return (<a className="add" href="/course"><i
                                         className="fa fa-plus"/></a>)
                                      }
                                     })()}
                                 </div>
                             </div>
                             {this.state.courses.map(course =>
                             <div className="course_card">
                                 <h2>{course.name}</h2>
                                 <p>Count of students: {course.student_number}</p>
                                 {(() => {
                                     if (course.description.length > 100) {
                                     return (<p>{course.description.substr(0, 100)+'...'}</p>)
                                     }
                                     else {
                                         return (<p>{course.description}</p>)
                                     }
                                 })()}
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