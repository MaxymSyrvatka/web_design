import React, {Component} from 'react';


export default class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
    render() {
        return (
            <div>
                { this.state.user.role === undefined ?
                    <div className="header">
                        <div className="header-left">
                            <a href="/" className="logo">Online Learning API</a>
                        </div>
                        <div className="header-right">
                            <a href="/login">Log in</a>
                            <a href="/user">Create user</a>
                        </div>
                    </div> :
                    <div className="header">
                         <div className="header-left">
                            <a href="/profile" className="logo">Online Learning API</a>
                            <a href="/users_list">Users</a>
                             <a href="/courses">Courses</a>
                         </div>
                         <div className="header-right">
                            <a href="/logout" onClick={(e) => {
                            e.preventDefault();
                            fetch('/logout')
                            window.location.href = '/'
                        }}>Log out</a>
                        </div>
                    </div>
                }
            </div>
        )
    }
}