import React from 'react';
import profile from "../pages/profile";
function Nav() {
    return (
            <div className="header">
                <div className="header-left">
                   {/*<NavLink to="/profile" className="logo">Online Learning API</NavLink>*/}
                    <a href="/profile" className="logo" >Online Learning API</a>
                    <a href="/users_list">Users</a>
                </div>
                <div className="header-right">
                    <a href="/logout" onClick={(e) => {
                        e.preventDefault();
                        fetch('/logout')
                    window.location.href='/'
                    }}>Log out</a>
                    <a href="/login">Log in</a>
                    <a href="/user">Create user</a>
                </div>
            </div>
    );
}

export { Nav };