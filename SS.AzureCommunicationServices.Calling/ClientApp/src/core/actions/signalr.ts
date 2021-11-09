import { HubConnection } from '@microsoft/signalr';
const SET_SIGNALRCONNECTION_CLIENT = 'SET_SIGNALRCONNECTION_CLIENT';

interface SetSignalrConnectionClient {
    type: typeof SET_SIGNALRCONNECTION_CLIENT;
    connection: HubConnection;
}

export const setSignalrConnectionClient = (connection: HubConnection): SetSignalrConnectionClient => {
    return {
        type: SET_SIGNALRCONNECTION_CLIENT,
        connection
    };
};

export { SET_SIGNALRCONNECTION_CLIENT };

export type SignalrTypes = SetSignalrConnectionClient;
