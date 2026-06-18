import { atom } from 'nanostores';

// 音量用のsotre、初期値は50
export const countVolume = atom<number>(50);

// モールス信号のしきい値のstore、初期値は200ms
export const countThreshold = atom<number>(200);

// typingの点数のstore、初期値は0
export const countTypingScore = atom<number>(0);