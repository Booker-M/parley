import firebase from 'firebase'
import React, {useState, useEffect} from 'react'
import ReactLoading from 'react-loading'
import {withRouter} from 'react-router-dom'
import {myFirebase, myFirestore} from '../../Config/MyFirebase'
import './Login.css'
import { useHistory } from "react-router-dom";
import {AppString} from '../Const'
import Header from '../Header/Header'
import moment from 'moment'

function Login() {
    const provider = new firebase.auth.GoogleAuthProvider()
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkLogin();
    }, []);

    const checkLogin = () => {
        if (localStorage.getItem(AppString.ID)) {
            setIsLoading(false);
            history.push('/main');
        } else {
            setIsLoading(false);
        }
    }

    const onLoginPress = () => {
        setIsLoading(true);
        myFirebase
        .auth()
        .signInWithPopup(provider)
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
                                sendMessage("Welcome to Parley!", user.uid, 0),
                                sendMessage("Click the message below to translate:", user.uid, 1),
                                sendMessage("Tebrikler! İlk mesajınızı çevirdiniz", user.uid , 2),
                                sendMessage("You can update your language and profile in your account settings", user.uid, 3),
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
                }
                setIsLoading(false)
                history.push('/main')
            }
        })
        .catch(err => {
            setIsLoading(false)
        })
    }

    const sendMessage = (content, user, order) => {
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

    return (
            <div className="viewRoot">
                    <Header
                        history={history}
                        login={true}
                    />

                    <button className="btnLogin" type="submit" onClick={onLoginPress}>
                        Sign in with Google
                    </button>

                    {isLoading ? (
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

export default withRouter(Login)
