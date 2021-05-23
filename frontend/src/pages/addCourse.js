import React, {Component} from 'react';
import axios from "axios";


export default class CourseAdd extends Component {

    handleSubmit = e => {
        e.preventDefault();

        const data = {
            name: this.name,
            description: this.description,
        }
        axios.post('/course', data)
            .then(res => {
            window.location.href = '/profile';
        })
    };


    render() {
        return (
            <div className="padding_container">
                <h1>New course</h1>
                <p>Please fill in this form to create a course.</p>
                <form onSubmit={this.handleSubmit}>
                    <div className="form_card">
                        <label htmlFor="name"><b>Course name</b></label>
                        <div>
                            <input type="text" placeholder="Course name" id="name" name="name"
                                   onChange={e => this.name = e.target.value} required/>
                        </div>
                        <label htmlFor="description"><b>Description</b></label>
                        <div>
                            <input type="text" placeholder="Description" id="description" name="description"
                                   onChange={e => this.description = e.target.value} required/>
                        </div>
                    </div>

                    <div className="flex-row-center">
                        <button type="submit" className="confirm_button">Confirm</button>
                        <button type="button" className="cancel_button">Cancel</button>
                    </div>
                </form>
            </div>
        )
    }
}