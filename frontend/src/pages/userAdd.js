import React, {Component} from 'react';
import axios from "axios";


export default class Register extends Component {

    handleSubmit = e => {
        e.preventDefault();

        const data = {
            name: this.name,
            surname: this.surname,
            password: this.password1,
            email: this.email,
            role: this.role,
            age: this.age
        }
        if (this.password1 != this.password2) {
            alert("Passwords do not match");
            window.location.reload();
        }else{
            axios.post('/user', data)
                .then(res => {
                window.location.href = '/login';
            })
        }
    };


    render() {
        return (
            <div className="padding_container">
                <h1>Register</h1>
                <p>Please fill in this form to create an account.</p>
                <form onSubmit={this.handleSubmit}>
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
                                   onChange={e => this.email = e.target.value} required />
                        </div>
                        <label htmlFor="psw"><b>Password</b></label>
                        <div>
                            <input type="password" placeholder="Enter Password" id="psw"
                                   onChange={e => this.password1 = e.target.value} required/>
                        </div>
                        <label htmlFor="psw-repeat"><b>Repeat Password</b></label>
                        <div>
                            <input type="password" placeholder="Repeat Password" id="psw-repeat"
                                   onChange={e => this.password2 = e.target.value} required/>
                        </div>
                        <label htmlFor="age"><b>Age</b></label>
                        <div>
                            <input type="text" placeholder="Enter Age" id="age" name="age"
                                   onChange={e => this.age = e.target.value} required/>
                        </div>
                        <label><b>Role</b></label>
                        <div>
                            <select onChange={e => this.role = e.target.value}>
                                <option value="0">Select role:</option>
                                <option value="student">Student</option>
                                <option value="tutor">Tutor</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex-row-center">
                        <button type="submit" className="confirm_button">Confirm</button>
                    </div>
                </form>
            </div>
        )
    }
}