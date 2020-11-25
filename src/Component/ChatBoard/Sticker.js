import React from 'react'

export default function Sticker(props) {
    return (
        <img
        className="imgSticker"
        src={props.image}
        alt="sticker"
        onClick={() => props.onSendMessage(props.imageString, 2)}
    />
    )
}