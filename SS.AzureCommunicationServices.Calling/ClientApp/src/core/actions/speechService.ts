import { SpeechRecognizer, TranslationRecognizer } from 'microsoft-cognitiveservices-speech-sdk';

const SET_SPEEHRECOGNIZER_SOURCELANGUAGE = 'SET_SPEEHRECOGNIZER_SOURCELANGUAGE';
const SET_SPEEHRECOGNIZER_EN_CLIENT = 'SET_SPEEHRECOGNIZER_EN_CLIENT';
const SET_SPEEHRECOGNIZER_CN_CLIENT = 'SET_SPEEHRECOGNIZER_CN_CLIENT';
const SET_SPEEHRECOGNIZER_PRONUNCIATION_CLIENT = 'SET_SPEEHRECOGNIZER_PRONUNCIATION_CLIENT';

interface SetSpeechRecognizerSourceLanguage {
    type: typeof SET_SPEEHRECOGNIZER_SOURCELANGUAGE;
    sourceLanguage: string;
}

interface SetSpeechRecognizerEnClient {
    type: typeof SET_SPEEHRECOGNIZER_EN_CLIENT;
    speechRecognizer: TranslationRecognizer;
}

interface SetSpeechRecognizerCnClient {
    type: typeof SET_SPEEHRECOGNIZER_CN_CLIENT;
    speechRecognizer: TranslationRecognizer;
}

interface SetSpeechRecognizerPronunciationClient {
    type: typeof SET_SPEEHRECOGNIZER_PRONUNCIATION_CLIENT;
    speechRecognizer: SpeechRecognizer;
}

export const setSpeechRecognizerSourceLanguage = (sourceLanguage: string): SetSpeechRecognizerSourceLanguage => {
    return {
        type: SET_SPEEHRECOGNIZER_SOURCELANGUAGE,
        sourceLanguage
    };
};

export const setSpeechRecognizerEnClient = (speechRecognizer: TranslationRecognizer): SetSpeechRecognizerEnClient => {
    return {
        type: SET_SPEEHRECOGNIZER_EN_CLIENT,
        speechRecognizer
    };
};

export const setSpeechRecognizerCnClient = (speechRecognizer: TranslationRecognizer): SetSpeechRecognizerCnClient => {
    return {
        type: SET_SPEEHRECOGNIZER_CN_CLIENT,
        speechRecognizer
    };
};

export const setSpeechRecognizerPronunciationClient = (speechRecognizer: SpeechRecognizer): SetSpeechRecognizerPronunciationClient => {
    return {
        type: SET_SPEEHRECOGNIZER_PRONUNCIATION_CLIENT,
        speechRecognizer
    };
};

export { SET_SPEEHRECOGNIZER_EN_CLIENT, SET_SPEEHRECOGNIZER_CN_CLIENT, SET_SPEEHRECOGNIZER_PRONUNCIATION_CLIENT, SET_SPEEHRECOGNIZER_SOURCELANGUAGE };

export type SpeechRecognizerTypes = SetSpeechRecognizerEnClient | SetSpeechRecognizerCnClient | SetSpeechRecognizerPronunciationClient | SetSpeechRecognizerSourceLanguage;
