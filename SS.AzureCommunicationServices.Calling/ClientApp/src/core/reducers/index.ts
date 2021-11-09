import { RemoteParticipant, RemoteVideoStream } from '@azure/communication-calling';
import { combineReducers, Reducer } from 'redux';
import { devicesReducer, DevicesState } from '../reducers/devices';
import { streamsReducer, StreamsState } from './streams';
import { controlsReducer, ControlsState } from './controls';
import { SdkState, sdkReducer } from './sdk';
import { CallsState, callsReducer } from './calls';
import { CallTypes } from '../actions/calls';
import { ControlTypes } from '../actions/controls';
import { DeviceTypes } from '../actions/devices';
import { SdkTypes } from '../actions/sdk';
import { StreamTypes } from '../actions/streams';
import { SpeechRecognizerState, speechRecognizerReducer } from './speechService';
import { SpeechRecognizerTypes } from '../actions/speechService';
import { SignalrState, signalrReducer } from './signalr';
import { SignalrTypes } from '../actions/signalr';
import { SubtitleState, subtitleReducer } from './subtitle';
import { SubtitleTypes } from '../actions/subtitle';

export interface ParticipantStream {
    user: RemoteParticipant;
    stream: RemoteVideoStream | undefined;
}

export interface State {
    calls: CallsState;
    devices: DevicesState;
    streams: StreamsState;
    controls: ControlsState;
    sdk: SdkState;
    speechRecognizer: SpeechRecognizerState;
    signalr: SignalrState;
    subtitle: SubtitleState;
}

type AppTypes = CallTypes | ControlTypes | DeviceTypes | SdkTypes | StreamTypes | SpeechRecognizerTypes | SignalrTypes | SubtitleTypes;

export const reducer: Reducer<State, AppTypes> = combineReducers({
    calls: callsReducer,
    devices: devicesReducer,
    streams: streamsReducer,
    controls: controlsReducer,
    sdk: sdkReducer,
    speechRecognizer: speechRecognizerReducer,
    signalr: signalrReducer,
    subtitle: subtitleReducer
});
