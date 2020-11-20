import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import images from '../Themes/Images'
import './ChatBoard.css'

function StickerSelect(props) {
    return (
            <div className="viewStickers">
                <img
                    className="imgSticker"
                    src={images.partyParrot}
                    alt="sticker"
                    onClick={() => props.onSendMessage('partyParrot', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.dealWithItParrot}
                    alt="sticker"
                    onClick={() => props.onSendMessage('dealWithItParrot', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.sadParrot}
                    alt="sticker"
                    onClick={() => props.onSendMessage('sadParrot', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.sleepingParrot}
                    alt="sticker"
                    onClick={() => props.onSendMessage('sleepingParrot', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.thumbsUpParrot}
                    alt="sticker"
                    onClick={() => props.onSendMessage('thumbsUpParrot', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.spinningParrot}
                    alt="sticker"
                    onClick={() => props.onSendMessage('spinningParrot', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.angryParrot}
                    alt="sticker"
                    onClick={() => props.onSendMessage('angryParrot', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.confusedParrot}
                    alt="sticker"
                    onClick={() => props.onSendMessage('confusedParrot', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.jumpingParrot}
                    alt="sticker"
                    onClick={() => props.onSendMessage('jumpingParrot', 2)}
                />
            </div>
        )
    }

    export default(StickerSelect);