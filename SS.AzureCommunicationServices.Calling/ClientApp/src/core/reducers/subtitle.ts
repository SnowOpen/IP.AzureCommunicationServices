import { Reducer } from 'redux';
import { SubtitleTypes, SET_SUBTITLE, Subtitle } from '../actions/subtitle';

export interface SubtitleState {
    subtitles: Array<Subtitle>;
}

const initialState: SubtitleState = {
    subtitles: new Array<Subtitle>()
};

export const subtitleReducer: Reducer<SubtitleState, SubtitleTypes> = (state = initialState, action: SubtitleTypes): SubtitleState => {
    switch (action.type) {
        case SET_SUBTITLE:
            return { ...state, subtitles: action.subtitles };
        default:
            return state;
    }
};
