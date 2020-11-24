/* Currently sending Stickers, but not rendering them */


import moment from 'moment'
import React, {useState, useEffect} from 'react'
import ReactLoading from 'react-loading'
import 'react-toastify/dist/ReactToastify.css'
import {myFirestore, myStorage} from '../../Config/MyFirebase'
import images from '../Themes/Images'
import './ChatBoard.css'
import {AppString} from './../Const'
import ChatMessage from './Message.js'
import StickerSelect from './StickerSelect'
import ListOfMessages from './ListOfMessages'
// import MessageBar from './MessageBar'

export default function ChatBoard(props) {
    const [isLoading, setLoading] = useState(false)
    const [isShowSticker, setShowSticker] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const currentUserId = localStorage.getItem(AppString.ID)
    const [listMessage] = useState([])
    const [groupChatId, setGroupChatId] = useState('4')
    let removeListener = null
    let currentPhotoFile = null
    let messagesEnd
    let refInput
    let currentPeerUser = props.currentPeerUser


    useEffect(() => {
        getListHistory();

        return function cleanUp() {
            if (removeListener) {
                removeListener()
            }
        };
    }, []);

    useEffect(() => {
        print("IT RAN")
    }, [listMessage])

    useEffect(() => {
        if (props.currentPeerUser) {
            currentPeerUser = props.currentPeerUser
            getListHistory()
        }

        return function cleanUp() {
            if (removeListener) {
                removeListener()
            }
        };
    }, [props])

    useEffect(() => {
        scrollToBottom()
    }, [isLoading]);


    const getListHistory = () => {
        if (removeListener) {
            removeListener()
        }
        let groupId = ''
        listMessage.length = 0
        setLoading(true)
        if (hashString(currentUserId) <= hashString(currentPeerUser.id)) {
            groupId = `${currentUserId}-${currentPeerUser.id}`
            setGroupChatId(groupId)
        } else {
            groupId = `${currentPeerUser.id}-${currentUserId}`
            setGroupChatId(groupId)
        }

        // Get history and listen new data added
        removeListener = myFirestore
            .collection(AppString.NODE_MESSAGES)
            .doc(groupId)
            .collection(groupId)
            .onSnapshot(
                snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === AppString.DOC_ADDED) {
                            listMessage.push(change.doc.data())
                        }
                    })
                setLoading(false)
                },
                err => {
                    console.log(err)
                }
            )
    }

    const openListSticker = () => {
        setShowSticker(!isShowSticker)
    }

    function onSendMessage(content, type) {
        if (isShowSticker && type === 2) {
            setShowSticker(false)
        }

        if (content.trim() === '') {
            return
        }

        const timestamp = moment()
            .valueOf()
            .toString()

        const itemMessage = {
            idFrom: currentUserId,
            idTo: currentPeerUser.id,
            timestamp: timestamp,
            content: content.trim(),
            type: type
        } 

        myFirestore
            .collection(AppString.NODE_MESSAGES)
            .doc(groupChatId)
            .collection(groupChatId)
            .doc(timestamp)
            .set(itemMessage)
            // .then(() => {
            //     // getListHistory()
            // })
            .then(() => {
                setInputValue('')
            })
        .catch(err => {
            console.log(err)
        })

        console.log(listMessage)
    }

    const onChoosePhoto = event => {
        if (event.target.files && event.target.files[0]) {
            setLoading(true)
            currentPhotoFile = event.target.files[0]
            // Check this file is an image?
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf(AppString.PREFIX_IMAGE) === 0) {
                uploadPhoto()
            } else {
                setLoading(false)
                //Add error message here
            }
        } else {
            setLoading(false)
        }
    }

    const uploadPhoto = () => {
        if (currentPhotoFile) {
            const timestamp = moment()
                .valueOf()
                .toString()

            const uploadTask = myStorage
                .ref()
                .child(timestamp)
                .put(currentPhotoFile)

            uploadTask.on(
                AppString.UPLOAD_CHANGED,
                null,
                err => {
                    setLoading(false)
                    //Show error message
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        setLoading(false)
                        onSendMessage(downloadURL, 1)
                    })
                }
            )
        } else {
            setLoading(false)
            //Error message file is null
        }
    }

    const onKeyboardPress = event => {
        if (event.key === 'Enter') {
            onSendMessage(inputValue, 0)
        }
    }

    const scrollToBottom = () => {
        if (messagesEnd) {
            messagesEnd.scrollIntoView({})
        }
    }

    const hashString = str => {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
            hash = hash & hash // Convert to 32bit integer
        }
        return hash
    }

    return (
        <div className="viewChatBoard">
            {/* Header */}
            <div className="headerChatBoard">
                <img
                    className="viewAvatarItem"
                    src={currentPeerUser.photoUrl}
                    alt="icon avatar"
                />
                <span className="textHeaderChatBoard">
                {currentPeerUser.nickname}
                </span>
            </div>

            {/* List message */}
            <div className="viewListContentChat">
                < ListOfMessages 
                    listMessage = { listMessage }
                    currentUserId = { currentUserId }
                    currentPeerUser = { currentPeerUser }
                />
                <div
                    style={{float: 'left', clear: 'both'}}
                    ref={el => {
                        messagesEnd = el
                    }}
                />
            </div>

            {/* Stickers */}
            {isShowSticker ? <StickerSelect onSendMessage={onSendMessage}/> : null}

            {/* View bottom */}
            <div className="viewBottom">
                <img
                    className="icOpenGallery"
                    src={images.ic_photo}
                    alt="icon open gallery"
                    onClick={() => refInput.click()}
                />
                <input
                    ref={el => {
                        refInput = el
                    }}
                    accept="image/*"
                    className="viewInputGallery"
                    type="file"
                    onChange={onChoosePhoto}
                />
                <img
                    className="icOpenSticker"
                    src={images.ic_sticker}
                    alt="icon open sticker"
                    onClick={openListSticker}
                />
                <input
                    className="viewInput"
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={event => { setInputValue(event.target.value) } }
                    onKeyPress={onKeyboardPress}
                />
                <img
                    className="icSend"
                    src={images.ic_send}
                    alt="icon send"
                    onClick={() => onSendMessage(inputValue, 0)}
                />
            </div>

            {/* Loading */}
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
