import React from 'react';
import { Subtitle } from '../core/actions/subtitle';

import {
    subtitleWrap,
    subtitleBox,
    subtitleLine,
    subtitleUserName,
    subtitleText,
    subtitleTextCN,
    subtitleTextEN,
    subtitleClear
} from './styles/Subtitles.styles';


interface SubtitlesProps {
    subtitles: Array<Subtitle>;
}

export default (props: SubtitlesProps): JSX.Element => {

    return (
        <div className={subtitleWrap}>
            <div className={subtitleBox}>
                {
                    props.subtitles.map((subtitle, index) => {
                        return <div className={subtitleLine} key={subtitle.lineId}>
                            <div className={subtitleUserName}>
                                {subtitle.userName}:
                            </div>
                            <div className={subtitleText}>
                                <div className={subtitleTextCN}>{subtitle.cnText}</div>
                                <div className={subtitleTextEN}>{subtitle.enText}</div>
                            </div>
                            <div className={subtitleClear}></div>
                        </div>
                    })
                }
            </div>
        </div>
    );
};
