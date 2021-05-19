import React, { Component } from 'react';


export default class UsersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        fetch('/users_list', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        users: result
                    });
                }
            )
    }

    render() {
        return (
            <div>
                <div className="title"><h1>List of users</h1></div>
                <div className="flex-row-center">
                    {this.state.users.map(user =>
                        <div className="user_card">
                            <h3>{user.name} {user.surname}</h3>
                            <p className="role">{user.role}</p>
                            <p className="courses_list">Age: {user.age}</p>
                        </div>
                        )};
                </div>
            </div>
        )
    }
}