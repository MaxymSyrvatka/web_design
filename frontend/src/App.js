import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css';
import UsersList from "./pages/usersList";
import Register from "./pages/userAdd";
import Login from "./pages/login";
import Nav from "./components/Nav";
import Profile from "./pages/profile";
import CourseAdd from "./pages/addCourse";
import RequestAdd from "./pages/addRequest";
import CoursesList from "./pages/coursesList";

function App() {
  return (
      <div>
          <Router>
            <Nav />
          </Router>
          <Router>
            <Switch>
                <Route path='/login'>
                    <Login />
                </Route>
                <Route path='/user'>
                    <Register />
                </Route>
                <Router path='/profile'>
                    <Profile />
                </Router>
                <Router path='/users_list'>
                    <UsersList />
                </Router>
                <Router path='/courses'>
                    <CoursesList />
                </Router>
                <Router path='/course'>
                    <CourseAdd />
                </Router>
                <Router path='/request'>
                    <RequestAdd />
                </Router>
            </Switch>
          </Router>
      </div>
  );
}

export default App;
