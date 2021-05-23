import React, { Component } from 'react';


export default class CoursesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: []
        }
    }

    componentDidMount() {
        fetch('/courses', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        courses: result
                    });
                }
            )
    }

    render() {
        return (
            <div>
                <div className="title"><h1>List of courses</h1></div>
                <div className="flex-row-center">
                    {this.state.courses.map(course =>
                        <div className="user_card">
                            <h3>{course.name}</h3>
                            <p className="role">Student number: {course.student_number}</p>
                            <p className="courses_list">{course.description}</p>
                        </div>
                        )};
                </div>
            </div>
        )
    }
}