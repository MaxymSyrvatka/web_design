import React, {Component} from 'react';
import axios from "axios";


export default class RequestAdd extends Component {

    handleSubmit = e => {
        e.preventDefault();

        const data = {
            course_name: this.course_name,
        }
        axios.post('/request', data)
            .then(res => {
            window.location.href = '/profile';
        })
    };


    render() {
        return (
            <div className="padding_container">
                <h1>New request</h1>
                <form onSubmit={this.handleSubmit}>
                    <div className="form_card">
                        <label htmlFor="name"><b>Course name</b></label>
                        <div>
                            <input type="text" placeholder="Course name" id="name" name="name"
                                   onChange={e => this.course_name = e.target.value} required/>
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