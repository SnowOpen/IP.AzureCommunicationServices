import { Dispatch } from 'redux';
import { utils } from '../Utils/Utils';
import { State } from './reducers';
import { setSpeechRecognizerEnClient, setSpeechRecognizerCnClient, setSpeechRecognizerPronunciationClient, setSpeechRecognizerSourceLanguage } from './actions/speechService';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import * as Signalr from '@microsoft/signalr';
import { v1 as createGUID } from 'uuid';
import { setSignalrConnectionClient } from './actions/signalr';
import { setSubtitles, Subtitle } from './actions/subtitle';
import store from './store';
/////////////////////////////////////////////////////
export const initSpeechRecognizerClient = (groupId: string) => {
    return async (dispatch: Dispatch, getState: () => State): Promise<void> => {
        const speechServiceKey = await utils.getSpeechServiceKey();
        var subscriptionKey = speechServiceKey["subscriptionKey"];
        var serviceRegion = speechServiceKey["serviceRegion"];

        const state = getState();
        const microphoneDeviceId = state.devices.deviceManager?.selectedMicrophone?.id;

        let speechRecognizerEN;
        let speechRecognizerCN;
        let speechRecognizerPronunciation;
        let signalrConnection;
        // check if chrome on ios OR firefox browser
        if (utils.isOnIphoneAndNotSafari() || utils.isUnsupportedBrowser()) {
            return;
        }

        try {
            var audioConfigEN = SpeechSDK.AudioConfig.fromMicrophoneInput(microphoneDeviceId);
            var speechConfigEN = SpeechSDK.SpeechTranslationConfig.fromSubscription(subscriptionKey, serviceRegion);
            speechConfigEN.addTargetLanguage("zh-CN");
            speechConfigEN.speechRecognitionLanguage = "en-US";
            speechRecognizerEN = new SpeechSDK.TranslationRecognizer(speechConfigEN, audioConfigEN);

            var audioConfigCN = SpeechSDK.AudioConfig.fromMicrophoneInput(microphoneDeviceId);
            var speechConfigCN = SpeechSDK.SpeechTranslationConfig.fromSubscription(subscriptionKey, serviceRegion);
            speechConfigCN.addTargetLanguage("en-US");
            speechConfigCN.speechRecognitionLanguage = "zh-CN";
            speechRecognizerCN = new SpeechSDK.TranslationRecognizer(speechConfigCN, audioConfigCN);

            var audioConfigPronunciation = SpeechSDK.AudioConfig.fromMicrophoneInput(microphoneDeviceId);
            var pronunciationAssessmentConfig = new SpeechSDK.PronunciationAssessmentConfig("",
                SpeechSDK.PronunciationAssessmentGradingSystem.HundredMark,
                SpeechSDK.PronunciationAssessmentGranularity.Word, true);
            var speechConfigPronunciation = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
            speechConfigPronunciation.speechRecognitionLanguage = "en-US";
            speechRecognizerPronunciation = new SpeechSDK.SpeechRecognizer(speechConfigPronunciation, audioConfigPronunciation);
            pronunciationAssessmentConfig.applyTo(speechRecognizerPronunciation);

            signalrConnection = new Signalr.HubConnectionBuilder().withUrl("/signalrHub?groupId=" + groupId).build();
            signalrConnection.keepAliveIntervalInMilliseconds = 30000; //30秒
            signalrConnection.serverTimeoutInMilliseconds = 60000; //60秒    

        } catch (e) {
            return;
        }

        if (!speechRecognizerEN) {
            return;
        }

        dispatch(setSpeechRecognizerEnClient(speechRecognizerEN));
        dispatch(setSpeechRecognizerCnClient(speechRecognizerCN));
        dispatch(setSpeechRecognizerPronunciationClient(speechRecognizerPronunciation));
        dispatch(setSignalrConnectionClient(signalrConnection));
    };
};

/////////////////////////////////////////////////////
export const buildSpeechRecognizer = async (
    speechRecognizer: SpeechSDK.TranslationRecognizer | undefined,
    sourceLanguage: string,
    dispatch: Dispatch,
    getState: () => State
): Promise<void> => {
    if (speechRecognizer === undefined) return;
    //const state = getState();
    try {
        var uuid = createGUID();
        function onRecognizing(sender: any, recognitionEventArgs: any) {
            handleRecognizedResult(sender, recognitionEventArgs, false);
        }

        function onRecognized(sender: any, recognitionEventArgs: any) {
            handleRecognizedResult(sender, recognitionEventArgs, true);
            uuid = createGUID();
        }

        function handleRecognizedResult(sender: any, recognitionEventArgs: any, isEnd: boolean) {
            var result: SpeechSDK.TranslationRecognitionResult = recognitionEventArgs.result;
            //window.console.log("onRecognize " + isEnd + " result " + sourceLanguage, result);

            var needHandle = false;
            switch (result.reason) {
                case SpeechSDK.ResultReason.RecognizedSpeech:
                case SpeechSDK.ResultReason.RecognizingSpeech:
                case SpeechSDK.ResultReason.TranslatedSpeech:
                case SpeechSDK.ResultReason.TranslatingSpeech:
                    needHandle = true;
                    break;
            }
            if (needHandle && result.translations) {
                var resultJson = JSON.parse(result.json);
                var privTranslation;
                if (isEnd) {
                    privTranslation = resultJson['privTranslationPhrase'];
                }
                else {
                    privTranslation = resultJson['privTranslationHypothesis'];
                }
                var translationText = "";
                privTranslation['Translation']['Translations'].forEach(
                    function (translation: any) {
                        translationText += translation.Text + " ";
                    });
                //window.console.log("onRecognize " + isEnd + " translation " + sourceLanguage, translationText);
                if (sourceLanguage === "en-US") {
                    updateSubtitles(uuid, true, translationText, result.text, sourceLanguage, true);
                }
                else if (sourceLanguage === "zh-CN") {
                    updateSubtitles(uuid, true, result.text, translationText, sourceLanguage, true);
                }
            }
        }

        speechRecognizer.recognizing = onRecognizing;
        speechRecognizer.recognized = onRecognized;

    } catch (e) {
        return;
    }
};
export const buildSpeechRecognizerPronunciation = async (
    speechRecognizer: SpeechSDK.SpeechRecognizer | undefined,
    dispatch: Dispatch,
    getState: () => State
): Promise<void> => {
    if (speechRecognizer === undefined) return;
    const state = getState();
    try {
        var uuid = createGUID();
        function onRecognizing(sender: any, recognitionEventArgs: any) {
            var result = recognitionEventArgs.result;
            //window.console.log("onRecognizing Pronunciation result ", result);
            switch (result.reason) {
                case SpeechSDK.ResultReason.RecognizedSpeech:
                case SpeechSDK.ResultReason.RecognizingSpeech:
                case SpeechSDK.ResultReason.TranslatedSpeech:
                case SpeechSDK.ResultReason.TranslatingSpeech:
                    updateSubtitles(uuid, true, "语言识别中……", "Language recognizing ...");
                    break;
            }
        }
        function onRecognized(sender: any, recognitionEventArgs: any) {
            var result: SpeechSDK.RecognitionResult = recognitionEventArgs.result;
            //window.console.log("onRecognized Pronunciation result ", result);
            switch (result.reason) {
                case SpeechSDK.ResultReason.RecognizedSpeech:
                case SpeechSDK.ResultReason.RecognizingSpeech:
                case SpeechSDK.ResultReason.TranslatedSpeech:
                case SpeechSDK.ResultReason.TranslatingSpeech:
                    var pronunciationAssessmentResult = SpeechSDK.PronunciationAssessmentResult.fromResult(result);
                    //window.console.log("onRecognized pronunciationAssessmentResult", pronunciationAssessmentResult);
                    state.speechRecognizer.speechRecognizerPronunciationClient?.stopContinuousRecognitionAsync();
                    if (pronunciationAssessmentResult.accuracyScore > 85) {
                        dispatch(setSpeechRecognizerSourceLanguage("en-US"));
                        window.console.log("begin start EN");
                        state.speechRecognizer.speechRecognizerEnClient?.startContinuousRecognitionAsync();
                        updateSubtitles(uuid, true, "语言识别完成[英文], 开始进行[英文->中文]实时翻译。", "Language recognized[English], Start real-time translation [English - > Chinese].");
                    }
                    else {
                        dispatch(setSpeechRecognizerSourceLanguage("zh-CN"));
                        window.console.log("begin start CN");
                        state.speechRecognizer.speechRecognizerCnClient?.startContinuousRecognitionAsync();
                        updateSubtitles(uuid, true, "语言识别完成[中文], 开始进行[中文->英文]实时翻译。", "Language recognized[Chinese], Start real-time translation [Chinese - > English].");
                    }
                    break;
            }
        }

        speechRecognizer.recognizing = onRecognizing;
        speechRecognizer.recognized = onRecognized;

    } catch (e) {
        return;
    }
};
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
export const startSpeechRecognitionDispatch = (mic: boolean) => {
    return async (dispatch: Dispatch, getState: () => State): Promise<void> => {
        const state = getState();
        buildSpeechRecognizer(state.speechRecognizer.speechRecognizerEnClient, "en-US", dispatch, getState);
        buildSpeechRecognizer(state.speechRecognizer.speechRecognizerCnClient, "zh-CN", dispatch, getState);
        buildSpeechRecognizerPronunciation(state.speechRecognizer.speechRecognizerPronunciationClient, dispatch, getState);
        if (mic) {
            startSpeechRecognition(dispatch, getState);
        }
        startSignalrConnection(dispatch, getState);
    };
};
export const stopSpeechRecognitionDispatch = () => {
    return async (dispatch: Dispatch, getState: () => State): Promise<void> => {
        stopSpeechRecognition(dispatch, getState);
        stopSignalrConnection(dispatch, getState);
    };
};

export const startSpeechRecognition = async (
    dispatch: Dispatch,
    getState: () => State
): Promise<void> => {
    const state = getState();
    try {
        if (state.speechRecognizer.sourceLanguage === "") {
            state.speechRecognizer.speechRecognizerPronunciationClient?.startContinuousRecognitionAsync();
        }
        else if (state.speechRecognizer.sourceLanguage === "en-US") {
            state.speechRecognizer.speechRecognizerEnClient?.startContinuousRecognitionAsync();
        }
        else if (state.speechRecognizer.sourceLanguage === "zh-CN") {
            state.speechRecognizer.speechRecognizerCnClient?.startContinuousRecognitionAsync();
        }

    } catch (e) {
        return;
    }
};

export const stopSpeechRecognition = async (
    dispatch: Dispatch,
    getState: () => State
): Promise<void> => {
    const state = getState();
    try {
        state.speechRecognizer.speechRecognizerEnClient?.stopContinuousRecognitionAsync();
    } catch (e) {
    }
    try {
        state.speechRecognizer.speechRecognizerCnClient?.stopContinuousRecognitionAsync();
    } catch (e) {
    }
    try {
        state.speechRecognizer.speechRecognizerPronunciationClient?.stopContinuousRecognitionAsync();
    } catch (e) {
    }
};
/////////////////////////////////////////////////////
export const startSignalrConnection = async (
    dispatch: Dispatch,
    getState: () => State
): Promise<void> => {
    const state = getState();
    try {
        var signalrConnection = state.signalr.signalrConnectionClient;
        if (signalrConnection === undefined) return;

        function ConnectStart() {
            signalrConnection?.start()
                .then(function () {
                    console.log("HubConnectionBuilder Connection Success");

                    signalrConnection?.off("ReceiveSubtitle");
                    signalrConnection?.on("ReceiveSubtitle", function (result: Subtitle) {
                        result.isMe = false;
                        result.localTime = new Date();
                        //console.log("ReceiveSubtitle result", result);
                        dispatchSubtitles(result);
                    });
                })
                .catch(function (err) {
                    //console.log(`HubConnectionBuilder Connection Error ${err}`);
                });
        }
        ConnectStart();

        signalrConnection.onclose(function () {
            console.log("Connection closed");
            ConnectStart();
        });

        deleteSubtitleByTime();

    } catch (e) {
        return;
    }
};

export const stopSignalrConnection = async (
    dispatch: Dispatch,
    getState: () => State
): Promise<void> => {
    const state = getState();
    try {
        state.signalr.signalrConnectionClient?.stop();
    } catch (e) {
        return;
    }
};
const sendSubtitle = (subtitle: Subtitle): void => {
    const state = store.getState();
    state.signalr.signalrConnectionClient?.invoke("sendSubtitle", subtitle).then(function () {
        //window.console.log("sendSubtitle success " + subtitle.lineId);
    }).catch(function (err) {
        //window.console.log("sendSubtitle error ", err);
    });
};
/////////////////////////////////////////////////////
const updateSubtitles = (lineId: string, isMe: boolean, cnText?: string, enText?: string, originalLanguage?: string, isSend?: boolean): void => {
    const state = store.getState();
    var userName = state.calls.callAgent?.displayName;
    var subtitle: Subtitle = {
        lineId: lineId,
        isMe: isMe,
        localTime: new Date(),
        userName: userName,
        cnText: cnText,
        enText: enText,
        originalLanguage: originalLanguage
    };
    //window.console.log("subtitle " + lineId, subtitle);

    if (isSend) {
        sendSubtitle(subtitle);
    }

    dispatchSubtitles(subtitle);
};

const dispatchSubtitles = (subtitle: Subtitle): void => {
    const state = store.getState();
    var subtitles = state.subtitle.subtitles;
    var hasLine = false;
    subtitles.forEach(function (one: Subtitle, index: number) {
        if (one.lineId === subtitle.lineId) {
            subtitles.splice(index, 1, subtitle);
            hasLine = true;
            return;
        }
    });

    if (!hasLine) {
        subtitles.push(subtitle);
    }

    if (subtitles.length > 3) {
        subtitles.splice(0, subtitles.length - 3);
    }

    store.dispatch(setSubtitles(subtitles));
    //window.console.log("dispatchSubtitles ", subtitles);
};

const deleteSubtitleByTime = (): void => {
    const state = store.getState();
    var subtitles = state.subtitle.subtitles;
    var newSubtitles = new Array<Subtitle>();
    var expireDate = new Date(new Date().getTime() - 1000 * 5);
    subtitles.forEach(function (one: Subtitle, index: number) {
        if (one.localTime > expireDate) {
            newSubtitles.push(one);
        }
    });
    if (newSubtitles.length !== subtitles.length) {
        store.dispatch(setSubtitles(newSubtitles));
        //window.console.log("deleteSubtitleByTime result ", newSubtitles);
    }
    setTimeout(deleteSubtitleByTime, 2000);
};
/////////////////////////////////////////////////////
