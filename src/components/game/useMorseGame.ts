// useMorseGame.ts
import { useState, useEffect, useRef } from 'react';
import { MorseGameEngine } from './MorseGameEngine';
import type { MorseQuestion, GameConfig } from './types';

export const useMorseGame = (initialQuestions: MorseQuestion[], config: GameConfig) => {
  const [engine] = useState(() => new MorseGameEngine(config));
  const [gameState, setGameState] = useState(() => {
    engine.initGame(initialQuestions);
    return engine.getState();
  });
  
  const pressStartTime = useRef<number | null>(null);

  const currentQuestion = engine.getCurrentQuestion();

  // 状態を同期するヘルパー
  const syncState = () => setGameState(engine.getState());

  // 入力開始（MouseDown / KeyDown）
  const startInput = () => {
    if (pressStartTime.current !== null) return; // すでに押されている場合は無視
    pressStartTime.current = Date.now();
  };

  // 入力終了（MouseUp / KeyUp）
  const endInput = () => {
    if (pressStartTime.current === null) return;
    
    const duration = Date.now() - pressStartTime.current;
    pressStartTime.current = null;

    const signal = engine.judgeDuration(duration);
    engine.inputSignal(signal);
    syncState();
  };

  return {
    gameState,
    currentQuestion,
    startInput,
    endInput,
    isPressing: pressStartTime.current !== null,
  };
};