import React, {useEffect, useState} from 'react'
import 'react-toastify/dist/ReactToastify.css'
import images from './../Themes/Images'
import Tooltip from '@material-ui/core/Tooltip';

export default function LanguageSelector(props) {
    // const [languages, setLanguages] = useState(props.languages)

    // useEffect(() => {
    //     setLanguages(props.languages)
    // }, [props.languages])

    return (
            <div className="language">
                {/* iterate through language options to create a select box */}
                <select
                    className="select-css"
                    value={props.myLanguage}
                    onChange={props.onChangeMyLanguage}
                >
                    {props.languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                        {lang.name}
                        </option>
                    ))}
                </select>
                <Tooltip title={"Reset Language"} arrow>
                    <img className={"reset"} src={images.reset} onClick={props.resetLanguage}/>
                </Tooltip>
            </div>
    )
}
