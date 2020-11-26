/* Currently sending Stickers, but not rendering them */

import moment from 'moment'
import React, {useState, useEffect, useRef} from 'react'
import ReactLoading from 'react-loading'
import 'react-toastify/dist/ReactToastify.css'
import {myFirestore, myStorage} from '../../Config/MyFirebase'
import images from '../Themes/Images'
import './ChatBoard.css'
import {AppString} from './../Const'
import StickerSelect from './StickerSelect'
import ListOfMessages from './ListOfMessages'

export default function ChatBoard(props) {
    const [isLoading, setLoading] = useState(false)
    const [isShowSticker, setShowSticker] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [groupChatId, setGroupChatId] = useState(null)
    const currentUserId = localStorage.getItem(AppString.ID)
    const [renderListMessage, setRenderListMessage] = useState([])
    let listMessage = []
    let currentPeerUser = props.currentPeerUser
    let removeListener = null
    let currentPhotoFile = null
    let messagesEnd
    let refInput

    useEffect(() => {
        scrollToBottom()
    }, [isLoading, renderListMessage])

    useEffect(() => {
        setGroupChatId(`7mgqzZC6sIhVWWHGlSMFLtOcYoF3-gLAQVD45Cmasq8bchIBzScWLx5N2`)

        return () => {
            if (removeListener) {
                removeListener()
            }
        }
    }, [])
    
    useEffect(() => {
        console.log("TRYING TO SET CURRENT PEER")
        if (props.currentPeerUser) {
            console.log("SETTING CURRENT PEER")
            currentPeerUser = props.currentPeerUser
            updateGroupChatId()
        }
    }, [props.currentPeerUser])

    const updateGroupChatId = () => {
        listMessage.length = 0
        setShowSticker(false)
        if (
            hashString(currentUserId) <=
            hashString(currentPeerUser.id)
        ) {
            setGroupChatId(`${currentUserId}-${currentPeerUser.id}`)
        } else {
            setGroupChatId(`${currentPeerUser.id}-${currentUserId}`)
        }
        console.log(groupChatId)
    }

    useEffect(() => {
        if (removeListener) {
            removeListener()
        }

        // Get history and listen new data added
        console.log("TRYING TO GET LIST HISTORY")
        if (groupChatId) {
            setLoading(true)
            console.log("GETTING LIST HISTORY")
            removeListener = myFirestore
            .collection(AppString.NODE_MESSAGES)
            .doc(groupChatId)
            .collection(groupChatId)
            .onSnapshot(
                snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === AppString.DOC_ADDED) {
                            listMessage.push(change.doc.data())
                        }
                    })
                    setRenderListMessage(listMessage)
                    setLoading(false)
                },
                err => {
                    props.showToast(0, err.toString())
                }
            )
        }
        
    }, [groupChatId])

    const openListSticker = () => {
        setShowSticker(!isShowSticker)
    }

    const onSendMessage = (content, type) => {
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
            .then(() => {
                setInputValue('')
            })
            .catch(err => {
                props.showToast(0, err.toString())
            })
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
                props.showToast(0, 'This file is not an image')
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
                    props.showToast(0, err.message)
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
            props.showToast(0, 'File is null')
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
                    listMessage = { renderListMessage }
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
