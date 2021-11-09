import { HubConnection } from '@microsoft/signalr';
import { Reducer } from 'redux';
import { SignalrTypes, SET_SIGNALRCONNECTION_CLIENT } from '../actions/signalr';

export interface SignalrState {
    signalrConnectionClient?: HubConnection;
}

const initialState: SignalrState = {
};

export const signalrReducer: Reducer<SignalrState, SignalrTypes> = (state = initialState, action: SignalrTypes): SignalrState => {
    switch (action.type) {
        case SET_SIGNALRCONNECTION_CLIENT:
            return { ...state, signalrConnectionClient: action.connection };
        default:
            return state;
    }
};
