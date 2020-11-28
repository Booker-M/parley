import React from 'react'
import './Root.css'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'
import Login from '../Login/Login'
import Main from '../Main/Main'
import Crew from '../Crew/Crew'
import Profile from '../Profile/Profile'
import {toast, ToastContainer} from 'react-toastify'

function Root() {

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
                            render={() => <Login />}
                        />
                        <Route
                            exact
                            path="/main"
                            render={() => <Main />}
                        />
                        <Route
                            exact
                            path="/crew"
                            render={() => <Crew />}
                        />
                        <Route
                            exact
                            path="/profile"
                            render={() => <Profile />}
                        />
                    </Switch>
                </div>
            </Router>
        )
}

export default Root
