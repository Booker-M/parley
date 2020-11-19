import firebase from 'firebase'
import React, {Component} from 'react'
import ReactLoading from 'react-loading'
import {withRouter} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import {myFirebase, myFirestore} from '../../Config/MyFirebase'
import './Login.css'
import {AppString} from './../Const'
import Header from './../Header/Header'
import moment from 'moment'

class Login extends Component {
    constructor(props) {
        super(props)
        this.provider = new firebase.auth.GoogleAuthProvider()
        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        this.checkLogin()
    }

    checkLogin = () => {
        if (localStorage.getItem(AppString.ID)) {
            this.setState({isLoading: false}, () => {
                this.setState({isLoading: false})
                this.props.showToast(1, 'Login success')
                this.props.history.push('/main')
            })
        } else {
            this.setState({isLoading: false})
        }
    }

    onLoginPress = () => {
        this.setState({isLoading: true})
        myFirebase
            .auth()
            .signInWithPopup(this.provider)
            .then(async result => {
                let user = result.user
                if (user) {
                    const result = await myFirestore
                        .collection(AppString.NODE_USERS)
                        .where(AppString.ID, '==', user.uid)
                        .get()

                    if (result.docs.length === 0) {
                        // Set new data since this is a new user
                        myFirestore
                            .collection('users')
                            .doc(user.uid)
                            .set({
                                id: user.uid,
                                nickname: user.displayName,
                                aboutMe: '',
                                myLanguage: 'en',
                                photoUrl: user.photoURL
                            })
                            .then(data => {
                                // Write user info to local
                                localStorage.setItem(AppString.ID, user.uid)
                                localStorage.setItem(AppString.NICKNAME, user.displayName)
                                localStorage.setItem(AppString.PHOTO_URL, user.photoURL)
                                localStorage.setItem(AppString.MY_LANGUAGE, 'en')
                                localStorage.setItem(AppString.PENDING, [])
                                localStorage.setItem(AppString.FRIENDS, [])
                                this.setState({isLoading: false}, () => {
                                    this.props.showToast(1, 'Login success')
                                    this.props.history.push('/main')
                                })
                            })
                            .then(
                                myFirestore
                                .collection(AppString.NODE_USERS)
                                .doc(user.uid)
                                .collection(AppString.FRIENDS)
                                .doc(AppString.PARLEY_ACCOUNT_ID)
                                .set({id: AppString.PARLEY_ACCOUNT_ID})
                            )
                            .then(
                                this.sendMessage("Welcome to Parley!", user.uid, 0),
                                this.sendMessage("Click the message below to translate", user.uid, 1),
                                this.sendMessage("Tebrikler! İlk mesajınızı çevirdiniz", user.uid , 2),
                                this.sendMessage("You can update your language and profile in your account settings", user.uid, 3),
                            )
                    } else {
                        // Write user info to local
                        localStorage.setItem(AppString.ID, result.docs[0].data().id)
                        localStorage.setItem(
                            AppString.NICKNAME,
                            result.docs[0].data().nickname
                        )
                        localStorage.setItem(
                            AppString.PHOTO_URL,
                            result.docs[0].data().photoUrl
                        )
                        localStorage.setItem(
                            AppString.ABOUT_ME,
                            result.docs[0].data().aboutMe
                        )
                        localStorage.setItem(
                            AppString.MY_LANGUAGE,
                            result.docs[0].data().myLanguage
                        )
                        this.setState({isLoading: false}, () => {
                            this.props.showToast(1, 'Login success')
                            this.props.history.push('/main')
                        })
                    }
                } else {
                    this.props.showToast(0, 'User info not available')
                }
            })
            .catch(err => {
                this.props.showToast(0, err.message)
                this.setState({isLoading: false})
            })
    }

    sendMessage = (content, user, order) => {
        if (content.trim() === '') {
            return
        }

        const groupChatId = `${user}-${AppString.PARLEY_ACCOUNT_ID}`

        const timestamp = moment()
            .add(order, "ms")
            .valueOf()
            .toString()

        const itemMessage = {
            idFrom: AppString.PARLEY_ACCOUNT_ID,
            idTo: user,
            timestamp: timestamp,
            content: content.trim(),
            type: 0
        }

        console.log(itemMessage)

        myFirestore
            .collection(AppString.NODE_MESSAGES)
            .doc(groupChatId)
            .collection(groupChatId)
            .doc(timestamp)
            .set(itemMessage)
            .catch(err => {
                this.props.showToast(0, err.toString())
            })
    }

    render() {
        return (
            <div className="viewRoot">
                <Header
                    showToast={this.props.showToast}
                    history={this.props.history}
                    login={true}
                />

                <button className="btnLogin" type="submit" onClick={this.onLoginPress}>
                    Sign in with Google
                </button>

                {this.state.isLoading ? (
                    <div className="viewLoading">
                        <ReactLoading
                            type={'spin'}
                            color={'#203152'}
                            height={'3%'}
                            width={'3%'}
                        />
                    </div>
                ) : null}
            </div>
        )
    }
}

export default withRouter(Login)
