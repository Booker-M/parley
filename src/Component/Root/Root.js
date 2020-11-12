import React, {Component} from 'react'
import './Root.css'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'
import Login from '../Login/Login'
import Main from '../Main/Main'
import PenPals from '../PenPals/PenPals'
import Profile from '../Profile/Profile'
import {toast, ToastContainer} from 'react-toastify'

class Root extends Component {
    showToast = (type, message) => {
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

    render() {
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
                            render={props => <Login showToast={this.showToast} {...props} />}
                        />
                        <Route
                            exact
                            path="/main"
                            render={props => <Main showToast={this.showToast} {...props} />}
                        />
                        <Route
                            exact
                            path="/penpals"
                            render={props => <PenPals showToast={this.showToast} {...props} />}
                        />
                        <Route
                            exact
                            path="/profile"
                            render={props => (
                                <Profile showToast={this.showToast} {...props} />
                            )}
                        />
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default Root
