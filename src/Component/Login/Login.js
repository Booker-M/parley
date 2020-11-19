import firebase from 'firebase'
import React, {useState, useEffect} from 'react'
import ReactLoading from 'react-loading'
import {withRouter} from 'react-router-dom'
import {myFirebase, myFirestore} from '../../Config/MyFirebase'
import './Login.css'
import { useHistory } from "react-router-dom";
import {AppString} from '../Const'
import Header from '../Header/Header'

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
                            setIsLoading(false)
                            history.push('/main')
                        })
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
                    setIsLoading(false)
                    history.push('/main')
                }
            } 
        })
        .catch(err => {
            setIsLoading(false)
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
