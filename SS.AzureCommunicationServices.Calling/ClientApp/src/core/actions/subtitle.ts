const SET_SUBTITLE = 'SET_SUBTITLE';

export type Subtitle = {
    lineId: string;
    userName?: string;
    enText?: string;
    cnText?: string;
    originalLanguage?: string;
    localTime: Date;
    isMe: boolean;
};

interface SetSubtitles {
    type: typeof SET_SUBTITLE;
    subtitles: Array<Subtitle>;
}

export const setSubtitles = (subtitles: Array<Subtitle>): SetSubtitles => {
    return {
        type: SET_SUBTITLE,
        subtitles
    };
};

export { SET_SUBTITLE };

export type SubtitleTypes = SetSubtitles;
