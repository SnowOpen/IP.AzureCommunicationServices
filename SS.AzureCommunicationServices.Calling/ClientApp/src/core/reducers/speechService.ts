import { SpeechRecognizer, TranslationRecognizer } from 'microsoft-cognitiveservices-speech-sdk';
import { Reducer } from 'redux';
import { SpeechRecognizerTypes, SET_SPEEHRECOGNIZER_SOURCELANGUAGE, SET_SPEEHRECOGNIZER_EN_CLIENT, SET_SPEEHRECOGNIZER_CN_CLIENT, SET_SPEEHRECOGNIZER_PRONUNCIATION_CLIENT } from '../actions/speechService';

export interface SpeechRecognizerState {
    sourceLanguage: string;
    speechRecognizerEnClient?: TranslationRecognizer;
    speechRecognizerCnClient?: TranslationRecognizer;
    speechRecognizerPronunciationClient?: SpeechRecognizer;
}

const initialState: SpeechRecognizerState = {
    sourceLanguage: ""
};

export const speechRecognizerReducer: Reducer<SpeechRecognizerState, SpeechRecognizerTypes> = (state = initialState, action: SpeechRecognizerTypes): SpeechRecognizerState => {
    switch (action.type) {
        case SET_SPEEHRECOGNIZER_SOURCELANGUAGE:
            return { ...state, sourceLanguage: action.sourceLanguage };
        case SET_SPEEHRECOGNIZER_EN_CLIENT:
            return { ...state, speechRecognizerEnClient: action.speechRecognizer };
        case SET_SPEEHRECOGNIZER_CN_CLIENT:
            return { ...state, speechRecognizerCnClient: action.speechRecognizer };
        case SET_SPEEHRECOGNIZER_PRONUNCIATION_CLIENT:
            return { ...state, speechRecognizerPronunciationClient: action.speechRecognizer };
        default:
            return state;
    }
};
