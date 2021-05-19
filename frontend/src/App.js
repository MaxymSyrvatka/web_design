import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css';
import UsersList from "./pages/usersList";
import Register from "./pages/userAdd";
import Login from "./pages/login";
import {Nav} from "./components/Nav";
import Profile from "./pages/profile";

function App() {
  return (
      <div>
          <Router>
            <Nav/>
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
            </Switch>
          </Router>
      </div>
  );
}

export default App;
