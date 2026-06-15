// import Button from "../Button";

// const exampple:[string, string] = ["私は猫です", "わたしはねこです"]

// export default function Typing() {

//     return (
//         <>
//         <Button>click here</Button>
//         </>
//     )
// }

// MorseGameComponent.tsx
import React, { useEffect } from 'react';
import { useMorseGame } from './useMorseGame';
import type { MorseQuestion } from './types';

// 仮の問題データ（初期はJSONからインポートする想定）
const mockQuestions: MorseQuestion[] = [
  { id: '1', phrase: '朝日', kana: 'あさひ', morseCodes: ['ーー・ーー', 'ーー・ー・', 'ーー・・'] }
];

export const MorseGameComponent: React.FC = () => {
  const { gameState, currentQuestion, startInput, endInput } = useMorseGame(mockQuestions, {
    dashThresholdMs: 200 // 200ms以上長押しで「ー」
  });

  // キーボード操作（Spaceキー）のバインディング
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
    return <div className="text-xl font-bold">全問クリア！お疲れ様でした。</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-slate-900 text-white rounded-xl shadow-md space-y-6">
      {/* 統計データ表示 */}
      <div className="flex justify-between text-sm text-slate-400">
        <div>Score: {gameState.score}</div>
        <div>Combo: {gameState.combo}</div>
        <div>Mistakes: {gameState.mistakeCount}</div>
      </div>

      {/* 1. 問題データ3層構造の表示 */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-wider">{currentQuestion.phrase}</h1>
        
        {/* 2. 進行線（インジケーター）と正誤の文字色同期 */}
        <div className="flex justify-center space-x-4">
          {currentQuestion.kana.split('').map((char, charIdx) => {
            const isCurrentChar = charIdx === gameState.currentKanaIndex;
            const isPastChar = charIdx < gameState.currentKanaIndex;
            
            return (
              <div 
                key={charIdx} 
                className={`p-3 rounded border ${
                  isCurrentChar ? 'border-amber-400 bg-slate-800' : 'border-slate-700'
                }`}
              >
                {/* ふりがな */}
                <div className={`text-xl font-bold ${isPastChar ? 'text-emerald-400' : 'text-white'}`}>
                  {char}
                </div>
                {/* モールス信号ガイド */}
                <div className="text-xs font-mono tracking-tight mt-1">
                  {currentQuestion.morseCodes[charIdx].split('').map((signal, strokeIdx) => {
                    let color = 'text-slate-500'; // 未入力
                    if (isPastChar) color = 'text-emerald-400'; // 入力済みの過去の文字
                    if (isCurrentChar) {
                      if (strokeIdx < gameState.currentStrokeIndex) color = 'text-emerald-400'; // 入力成功
                      if (strokeIdx === gameState.currentStrokeIndex) color = 'text-amber-400 animate-pulse font-bold'; // 現在の打鍵対象
                    }
                    return <span key={strokeIdx} className={color}>{signal}</span>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 入力用シングルボタン */}
      <div className="flex justify-center pt-4">
        <button
          onMouseDown={startInput}
          onMouseUp={endInput}
          onMouseLeave={endInput} // ボタン外にカーソルが外れた時のケア
          onTouchStart={(e) => { e.preventDefault(); startInput(); }} // スマホ対応
          onTouchEnd={(e) => { e.preventDefault(); endInput(); }}
          className="w-32 h-32 bg-amber-500 active:bg-amber-600 text-slate-900 font-bold rounded-full shadow-lg text-lg select-none transition-colors duration-75 focus:outline-none focus:ring-4 focus:ring-amber-300"
        >
          TAP
        </button>
      </div>
      <p className="text-center text-xs text-slate-500">※画面のボタン長押し、またはスペースキーの長押しで入力できます</p>
    </div>
  );
};

export default MorseGameComponent;