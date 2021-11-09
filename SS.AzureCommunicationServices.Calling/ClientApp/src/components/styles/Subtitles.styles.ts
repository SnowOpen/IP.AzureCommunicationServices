import { mergeStyles } from '@fluentui/react';

export const subtitleWrap = mergeStyles({
    height: 'auto',
    width: '100%',
    position: 'absolute',
    bottom: 20,
    zIndex: 10
});
export const subtitleBox = mergeStyles({
    width: '80%',
    margin: '0 auto 0',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: '10px'
});
export const subtitleLine = mergeStyles({
    color: '#FFFFFF',
    padding: '5px 10px'
});
export const subtitleUserName = mergeStyles({
    float: 'left',
    fontWeight: 600,
    fontSize: '0.875rem', // 14px
    boxSizing: 'border-box',
    boxShadow: 'none',
    paddingTop: '10px',
    minWidth: '10%',
    textAlign: 'right'
});
export const subtitleText = mergeStyles({
    float: 'left',
    paddingLeft: '10px',
    boxSizing: 'border-box',
    boxShadow: 'none',
    maxWidth: '85%'
});
export const subtitleTextCN = mergeStyles({
    fontWeight: 600,
    fontSize: '0.875rem', // 14px
    boxSizing: 'border-box',
    boxShadow: 'none',
    overflowWrap: 'break-word'
});
export const subtitleTextEN = mergeStyles({
    fontWeight: 600,
    fontSize: '0.875rem', // 14px
    boxSizing: 'border-box',
    boxShadow: 'none',
    overflowWrap: 'break-word'
});
export const subtitleClear = mergeStyles({
    clear: 'both'
});