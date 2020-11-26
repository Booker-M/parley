import React, {Component} from 'react'
import './Root.css'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'
import Login from '../Login/Login'
import Main from '../Main/Main'
import Crew from '../Crew/Crew'
import Profile from '../Profile/Profile'
import {toast, ToastContainer} from 'react-toastify'

function Root() {
    const showToast = (type, message) => {
        // 0 = warning, 1 = success
        switch (type) {
            case 0:
                toast.warning(message)
                break
            case 1:
                toast.success(message)
                break
            default:
                break
        }
    }

        return (
            <Router>
                <div>
                    <ToastContainer
                        autoClose={2000}
                        hideProgressBar={true}
                        position={toast.POSITION.BOTTOM_RIGHT}
                    />
                    <Switch>
                        <Route
                            exact
                            path="/"
                            render={props => <Login showToast={showToast} {...props} />}
                        />
                        <Route
                            exact
                            path="/main"
                            render={props => <Main showToast={showToast} {...props} />}
                        />
                        <Route
                            exact
                            path="/crew"
                            render={props => <Crew showToast={showToast} {...props} />}
                        />
                        <Route
                            exact
                            path="/profile"
                            render={props => (
                                <Profile showToast={showToast} {...props} />
                            )}
                        />
                    </Switch>
                </div>
            </Router>
        )
}

export default Root
