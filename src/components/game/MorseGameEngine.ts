// MorseGameEngine.ts
import type { MorseQuestion, GameConfig, GameState } from './types';

export class MorseGameEngine {
  private questions: MorseQuestion[] = [];
  private state: GameState;
  private config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
    this.state = this.getInitialState();
  }

  private getInitialState(): GameState {
    return {
      currentQuestionIndex: 0,
      currentCharIndex: 0,
      currentStrokeIndex: 0,
      score: 0,
      combo: 0,
      mistakeCount: 0,
    };
  }

  public initGame(questions: MorseQuestion[]) {
    this.questions = questions;
    this.state = this.getInitialState();
  }

  public getCurrentQuestion(): MorseQuestion | null {
    if (this.questions.length === 0 || this.state.currentQuestionIndex >= this.questions.length) {
      return null;
    }
    return this.questions[this.state.currentQuestionIndex];
  }

  public judgeDuration(durationMs: number): '・' | 'ー' {
    return durationMs >= this.config.dashThresholdMs ? 'ー' : '・';
  }

  /**
   * タイムアウト時などに、現在入力中の文字の進捗を最初に戻す
   * （コンボは維持するかリセットするか選べますが、今回はペナルティとしてコンボもリセットにしています）
   */
  public resetCurrentStroke(): void {
    this.state.currentStrokeIndex = 0;
    this.state.combo = 0; // 放置によるリセットなのでコンボもクリア
  }

  public inputSignal(signal: '・' | 'ー'): { isCorrect: boolean; isWordCleared: boolean; isQuestionCleared: boolean } {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return { isCorrect: false, isWordCleared: false, isQuestionCleared: false };

    const targetMorse = currentQuestion.morseCodes[this.state.currentCharIndex];
    const expectedSignal = targetMorse[this.state.currentStrokeIndex];

    // 不正解の場合（1文字単位でリセット）
    if (signal !== expectedSignal) {
      this.state.currentStrokeIndex = 0; // 入力中のモールスをその文字の最初に戻す
      this.state.combo = 0;
      this.state.mistakeCount++;
      return { isCorrect: false, isWordCleared: false, isQuestionCleared: false };
    }

    // 正解の場合
    this.state.currentStrokeIndex++;
    this.state.combo++;
    // コンボボーナス（簡易版）
    this.state.score += 10 * (this.state.combo > 5 ? 1.5 : 1);

    // 現在の1文字の打鍵が完了したか
    const isWordCleared = this.state.currentStrokeIndex === targetMorse.length;
    let isQuestionCleared = false;

    if (isWordCleared) {
      this.state.currentStrokeIndex = 0;
      this.state.currentCharIndex++;

      // 問題全体のすべての文字が完了したか
      if (this.state.currentCharIndex === currentQuestion.morseCodes.length) {
        isQuestionCleared = true;
        this.state.currentCharIndex = 0;
        this.state.currentQuestionIndex++;
      }
    }

    return { isCorrect: true, isWordCleared, isQuestionCleared };
  }

  public getState(): GameState {
    return { ...this.state };
  }
}