// useMorseGame.ts
import { useState, useRef, useCallback, useEffect } from 'react';
import { MorseGameEngine } from './MorseGameEngine';
import type { MorseQuestion, GameConfig } from './types';

// ゲーム設定に自動リセット時間を追加（例: 1500ms 未入力でリセット）
interface ExtendedGameConfig extends GameConfig {
  idleTimeoutMs?: number; 
}

export const useMorseGame = (initialQuestions: MorseQuestion[], config: ExtendedGameConfig) => {
  // デフォルトのタイムアウト時間を 1500ms に設定
  const idleTimeoutMs = config.idleTimeoutMs ?? 1500;

  const [engine] = useState(() => new MorseGameEngine(config));
  const [gameState, setGameState] = useState(() => {
    engine.initGame(initialQuestions);
    return engine.getState();
  });
  
  const pressStartTime = useRef<number | null>(null);
  const timeoutId = useRef<NodeJS.Timeout | null>(null); // タイマー管理用のref

  const currentQuestion = engine.getCurrentQuestion();

  const syncState = useCallback(() => {
    setGameState(engine.getState());
  }, [engine]);

  // タイマーをクリアするヘルパー
  const clearIdleTimer = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  }, []);

  // 入力開始（MouseDown / KeyDown）
  const startInput = useCallback(() => {
    if (pressStartTime.current !== null) return;
    
    // 💡 新たに入力が始まったので、放置タイマーを止める
    clearIdleTimer();
    
    pressStartTime.current = Date.now();
  }, [clearIdleTimer]);

  // 入力終了（MouseUp / KeyUp）
  const endInput = useCallback(() => {
    if (pressStartTime.current === null) return;
    
    const duration = Date.now() - pressStartTime.current;
    pressStartTime.current = null;

    const signal = engine.judgeDuration(duration);
    const result = engine.inputSignal(signal);
    syncState();

    // 💡 打鍵直後、問題がクリアされていなければ放置タイマーを開始する
    if (!result.isQuestionCleared) {
      clearIdleTimer(); // 念のため既存タイマーをクリア
      
      timeoutId.current = setTimeout(() => {
        // 一定時間経過後の処理
        engine.resetCurrentStroke();
        syncState();
        timeoutId.current = null;
        console.log(`未入力のため、現在の文字の入力をリセットしました（${idleTimeoutMs}ms経過）`);
      }, idleTimeoutMs);
    }
  }, [engine, syncState, clearIdleTimer, idleTimeoutMs]);

  // コンポーネントがアンマウントされたときにタイマーを破棄（メモリリーク防止）
  useEffect(() => {
    return () => clearIdleTimer();
  }, [clearIdleTimer]);

  return {
    gameState,
    currentQuestion,
    startInput,
    endInput,
    isPressing: pressStartTime.current !== null,
  };
};