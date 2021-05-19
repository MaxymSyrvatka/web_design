import React, {Component} from 'react';
import axios from "axios";


export default class Login extends Component {
     handleSubmit = e => {
        e.preventDefault();

        const data = {
            email: this.email,
            password: this.password
        }

        axios.post('/login', data)
            .then(res => {
            window.location.href = '/profile';
        })
    };

  render() {
      return(
    <div>
        <form onSubmit={this.handleSubmit}>
            <div className="padding_container">
                <h1>Sign in</h1>
                <p>Please fill in this fields to sign in.</p>
                <div className="form_card">
                    <label htmlFor="email"><b>Email</b></label>
                    <div>
                        <input type="text" placeholder="Email" id="email"
                               onChange={e => this.email = e.target.value} required/>
                    </div>
                    <label htmlFor="psw"><b>Password</b></label>
                    <div>
                        <input type="password" placeholder="Enter Password" id="psw"
                               onChange={e => this.password = e.target.value} required/>
                    </div>
                </div>
                <div className="flex-row-center">
                    <button type="submit" className="confirm_button">Confirm</button>
                    <button type="button" className="cancel_button">Cancel</button>
                </div>
            </div>
        </form>
    </div>
  )
};
  }