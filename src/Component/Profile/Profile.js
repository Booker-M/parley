import React, {useEffect, useState} from 'react'
import { useHistory } from "react-router-dom";
import ReactLoading from 'react-loading'
import {withRouter} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import {myFirestore, myStorage} from '../../Config/MyFirebase'
import images from './../Themes/Images'
import './Profile.css'
import {AppString} from './../Const'
import {listLanguagesWithTarget} from '../../Config/MyTranslate.js'
import Header from './../Header/Header'
import LanguageSelector from './LanguageSelector'

function Profile() {
    const [isLoading, setLoading] = useState(false)
    const [id] = useState(localStorage.getItem(AppString.ID))
    const [nickname, setNickname] = useState(localStorage.getItem(AppString.NICKNAME))
    const [aboutMe, setAboutMe] = useState(localStorage.getItem(AppString.ABOUT_ME))
    const [photoUrl, setPhotoUrl] = useState(localStorage.getItem(AppString.PHOTO_URL))
    const [myLanguage, setLanguage] = useState(localStorage.getItem(AppString.MY_LANGUAGE))
    const [languages, setLanguages] = useState([])
    const [newAvatar, setNewAvatar] = useState(null);
    const history = useHistory();

    let refInput

    useEffect(() => {
        checkLogin()
        updateLanguages()
    }, [])

    async function updateLanguages() {
        setLanguages(await listLanguagesWithTarget())
    }

    const checkLogin = () => {
        if (!localStorage.getItem(AppString.ID)) {
            history.push('/')
        }
    }

    function onChangeNickname(event) {
        setNickname(event.target.value)
    }

    function onChangeAboutMe(event) {
        setAboutMe(event.target.value)
    }

    function onChangeMyLanguage(event) {
        setLanguage(event.target.value ? event.target.value : myLanguage)
    }

    useEffect(() => {
        updateLanguages();
    }, [myLanguage])

    function onChangeAvatar(event) {
        if(event.target.files && event.target.files[0]) {
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf(AppString.PREFIX_IMAGE) !== 0) {
                console.log("This is not an image file!")
                return
            }
            setNewAvatar(event.target.files[0])
            setPhotoUrl(URL.createObjectURL(event.target.files[0]))
        } else {
            console.log("Something was wrong with the input file");
        }
    }

    function uploadAvatar(event) {
        setLoading(true)
        console.log(newAvatar)
        if (newAvatar) {
            const uploadTask = myStorage
                .ref()
                .child(id)
                .put(newAvatar)
            uploadTask.on(
                AppString.UPLOAD_CHANGED,
                null,
                err => {
                    console.log("THERE HAS BEEN AN ERROR")
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        updateUserInfo(true, downloadURL)
                    })
                }
            )
        } else {
            updateUserInfo(false, null)
        }
    }

    function updateUserInfo(isUpdatePhotoUrl, downloadURL) {
        let newInfo
        if (isUpdatePhotoUrl) {
            newInfo = {
                nickname: nickname,
                aboutMe: aboutMe,
                myLanguage: myLanguage,
                photoUrl: downloadURL
            }
        } else {
            newInfo = {
                nickname: nickname,
                aboutMe: aboutMe,
                myLanguage: myLanguage,
            }
        }
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(id)
            .update(newInfo)
            .then(data => {
                localStorage.setItem(AppString.NICKNAME, nickname)
                localStorage.setItem(AppString.ABOUT_ME, aboutMe)
                localStorage.setItem(AppString.MY_LANGUAGE, 
                    myLanguage)
                if (isUpdatePhotoUrl) {
                    localStorage.setItem(AppString.PHOTO_URL, downloadURL)
                }
                setLoading(false)
                console.log("Success")
                console.log(isUpdatePhotoUrl)
                console.log(newInfo)
            })
    }

    function resetLanguage() {
        setLanguage(navigator.language === "en-US" ? 'en' : navigator.language)
    }

    return (
        <div className="root">
            <Header
                history={history}
            />

            <img className="avatar" alt="Avatar" src={photoUrl}/>

            <div className="viewWrapInputFile">
                <img
                    className="imgInputFile"
                    alt="icon gallery"
                    src={images.ic_input_file}
                    onClick={() => refInput.click()}
                />
                <input
                    ref={el => {
                        refInput = el
                    }}
                    accept="image/*"
                    className="viewInputFile"
                    type="file"
                    onChange={onChangeAvatar}
                />
            </div>

            <span className="textLabel">Nickname:</span>
            <input
                className="textInput"
                value={nickname ? nickname : ''}
                placeholder="Your nickname..."
                onChange={onChangeNickname}
            />
            <span className="textLabel">About me:</span>
            <input
                className="textInput"
                value={aboutMe ? aboutMe : ''}
                placeholder="Tell about yourself..."
                onChange={onChangeAboutMe}
            />

            <span className="textLabel">Language:</span>
            <LanguageSelector myLanguage={myLanguage} languages={languages} onChangeMyLanguage={onChangeMyLanguage} resetLanguage={resetLanguage}/>

            <button className="btnUpdate" onClick={uploadAvatar}>
                Update
            </button>

            {isLoading || languages.length === 0 ? (
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

export default withRouter(Profile)
