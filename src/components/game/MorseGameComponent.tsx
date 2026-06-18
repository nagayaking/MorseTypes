// MorseGameComponent.tsx
import React, { useState, useEffect } from 'react';
import { useMorseGame } from './useMorseGame';
import type { MorseQuestion } from './types';
import { MORSE_THEMES } from '../../themes/constants';
import { applyTheme } from '../../themes/utils';
import '../../styles/MorseGame.css'

const mockQuestions: MorseQuestion[] = [
  { id: '1', phrase: '朝日旭あさひ', displayChars: 'あさひあさひあさひ', morseCodes: ['ーー・ーー', 'ーー・ー・', 'ーー・・', 'ーー・ーー', 'ーー・ー・', 'ーー・・', 'ーー・ーー', 'ーー・ー・', 'ーー・・'] },
  { id: '1', phrase: '朝日', displayChars: 'あさひ', morseCodes: ['ーー・ーー', 'ーー・ー・', 'ーー・・'] }
];

export const MorseGameComponent: React.FC = () => {
  const { gameState, currentQuestion, startInput, endInput, getAllMappings } = useMorseGame(mockQuestions, {
    dashThresholdMs: 200,
    idleTimeoutMs: 1800
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        startInput();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        endInput();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startInput, endInput]);

  if (!currentQuestion) {
    return <div className="game-clear-message">全問クリア！お疲れ様でした。</div>;
  }

  // 文字単位のステータス判定ヘルパー
  const getCharStatus = (charIdx: number): 'past' | 'current' | 'future' => {
    if (charIdx < gameState.currentCharIndex) return 'past';
    if (charIdx === gameState.currentCharIndex) return 'current';
    return 'future';
  };

  // モールス記号（打鍵）単位のステータス判定ヘルパー
  const getStrokeStatus = (charIdx: number, strokeIdx: number): 'completed' | 'active' | 'pending' => {
    if (charIdx < gameState.currentCharIndex) return 'completed';
    if (charIdx === gameState.currentCharIndex) {
      if (strokeIdx < gameState.currentStrokeIndex) return 'completed';
      if (strokeIdx === gameState.currentStrokeIndex) return 'active';
    }
    return 'pending';
  };
  const [currentThemeId, setCurrentThemeId] = useState('cyber-dark');

  useEffect(() => {
    const activeTheme = MORSE_THEMES.find(t => t.id === currentThemeId);
    if (activeTheme) {
      applyTheme(activeTheme); // ここでCSS変数が一瞬で切り替わる！
    }
  }, [currentThemeId]);

  return (
    <div className="morse-game-container">
      {/* 統計ヘッダー */}
      <div className="game-stats">
        <span>Score: {gameState.score}</span>
        <span>Combo: {gameState.combo}</span>
        <span>Mistakes: {gameState.mistakeCount}</span>
      </div>

      {/* メイン問題表示 */}
      <div className="game-display">
        <h1 className="game-phrase">{currentQuestion.phrase}</h1>
        
        {/* インジケーター＆ガイド */}
        <div className="char-list">
          {currentQuestion.displayChars.split('').map((char, charIdx) => {
            const charStatus = getCharStatus(charIdx);
            
            return (
              <div 
                key={charIdx} 
                className={`char-box char-box--${charStatus}`}
              >
                {/* 日本語/アルファベット1文字 */}
                <div className={`char-text char-text--${charStatus}`}>
                  {char}
                </div>
                {/* モールス信号 */}
                <div className="morse-guide">
                  {currentQuestion.morseCodes[charIdx].split('').map((signal, strokeIdx) => {
                    const strokeStatus = getStrokeStatus(charIdx, strokeIdx);
                    return (
                      <span 
                        key={strokeIdx} 
                        className={`morse-signal morse-signal--${strokeStatus}`}
                      >
                        {signal}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 入力用ボタン */}
      <div className="input-section">
        <button
          onMouseDown={startInput}
          onMouseUp={endInput}
          onMouseLeave={endInput}
          onTouchStart={(e) => { e.preventDefault(); startInput(); }}
          onTouchEnd={(e) => { e.preventDefault(); endInput(); }}
          className="morse-tap-button"
        >
          TAP
        </button>
        <p className="input-hint">※画面のボタン長押し、またはスペースキーの長押しで入力できます</p>
      </div>

      <hr className="divider" />

      {/* 4. モールス信号と日本語の対応表データ一覧（常時全表示） */}
      {/*
      <div className="mapping-table-section">
        <h3>モールス信号 対応表</h3>
        <div className="mapping-grid">
          {getAllMappings().map((item) => (
            <div key={item.char} className="mapping-item">
              <span className="mapping-char">{item.char}</span>
              <span className="mapping-code">{item.code}</span>
            </div>
          ))}
        </div>
      </div>
      */}
      {/* テーマ切り替え用のセレクトボックス */}
      <select value={currentThemeId} onChange={(e) => setCurrentThemeId(e.target.value)}>
        {MORSE_THEMES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
    </div>
  );
};

export default MorseGameComponent;