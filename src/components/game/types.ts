// types.ts
export interface MorseQuestion {
  id: string;
  phrase: string;    // 例文（例: 「朝日」）
  kana: string;      // ふりがな（例: 「あさひ」）
  morseCodes: string[]; // モールス信号の配列（例: ["ーー・ーー", "ーー・ー・", "ーー・・"]）
}

export interface GameConfig {
  dashThresholdMs: number; // 長音（ー）と判定する閾値（例: 200ms）
}

export interface GameState {
  currentQuestionIndex: number;
  currentKanaIndex: number;  // 何文字目のふりがなか
  currentStrokeIndex: number; // その文字のモールス信号の何打目か
  score: number;
  combo: number;
  mistakeCount: number;
}

// 将来DB移行しても、このインターフェースを満たすクラスを作ればロジックは変更不要
export interface QuestionRepository {
  getQuestions(): Promise<MorseQuestion[]>;
}