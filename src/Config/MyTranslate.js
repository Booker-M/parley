import {AppString} from '../Component/Const'
const {Translate} = require('@google-cloud/translate').v2;

const CREDENTIALS = JSON.parse(process.env.REACT_APP_GOOGLE_APPLICATION_CREDENTIALS);

export const myTranslate = new Translate({
    credentials: CREDENTIALS,
    projectId: "parley-4c999"
});

export const listLanguagesWithTarget = async function listLanguagesWithTarget() {
    // Lists available translation language with their names in a target language
    return myTranslate.getLanguages(localStorage.getItem(AppString.MY_LANGUAGE)).then((result) => result[0]);
}

export const translateText = async function translateText(text, target) {
    return await myTranslate.translate(text, target).then((result) => result[0]);
}