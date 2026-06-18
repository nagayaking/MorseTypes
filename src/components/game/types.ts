// types.ts

export interface MorseQuestion {
  id: string;
  phrase: string;       // 例文 (例: "朝日" / "SOS")
  displayChars: string; // 表示・入力単位 (例: "あさひ" / "SOS")
  morseCodes: string[]; // モールス信号の配列 (例: ["ーー・ーー", "ーー・ー・", "ーー・・"])
}

export interface GameConfig {
  dashThresholdMs: number; // 長音（ー）と判定する閾値
}

export interface GameState {
  currentQuestionIndex: number;
  currentCharIndex: number;   // 現在何文字目か
  currentStrokeIndex: number; // その文字の何打目か
  score: number;
  combo: number;
  mistakeCount: number;
}

// モールス辞書マッピングの型
// これいらない
export interface MorseMapping {
  char: string;
  code: string;
}

// Repositoryパターン: 将来のDB移行時はこのインターフェースを実装したクラスを作ればOK
export interface QuestionRepository {
  getQuestions(): Promise<MorseQuestion[]>;
}