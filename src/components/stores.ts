import { persistentAtom } from '@nanostores/persistent';

// 音量用のstore、初期値は50
export const countVolume = persistentAtom<number>('countVolume', 50, {
  encode: JSON.stringify,
  decode: JSON.parse
});

// モールス信号のしきい値のstore、初期値は200ms
export const countThreshold = persistentAtom<number>('countThreshold', 200, {
  encode: JSON.stringify,
  decode: JSON.parse
});

// typingの点数のstore、初期値は0
export const countTypingScore = persistentAtom<number>('countTypingScore', 0, {
  encode: JSON.stringify,
  decode: JSON.parse
});

// 問題数のstore、初期値は10
export const countNumberOfQuestion = persistentAtom<number>('countNumberOfQuestion', 10, {
  encode: JSON.stringify,
  decode: JSON.parse
});