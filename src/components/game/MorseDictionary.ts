// MorseDictionary.ts
import type { MorseMapping } from './types';

export class MorseDictionary {
  // 和文・欧文の一部の例。必要に応じて追加・JSON外部化が可能です
  private static readonly mappings: Record<string, string> = {
    "あ": "ーー・ーー",
    "い": "・ー",
    "う": "・・ー",
    "え": "ー・ーーー",
    "お": "・ー・・・",
    "か": "・ー・・",
    "き": "ー・ー・・",
    "く": "・・・ー",
    "け": "ー・ー・",
    "こ": "ーーーー",
    "さ": "ー・ー・ー",
    "し": "ーー・ー・",
    "す": "ーーー・ー",
    "せ": "・ーーー・",
    "そ": "ーーー・",
    "た": "ー・",
    "ち": "・・ー・",
    "つ": "・ーー・",
    "て": "・ー・ーー",
    "と": "・・ー・・",
    "な": "・ー・",
    "に": "ー・ー・",
    "ぬ": "・・・・",
    "ね": "ーー・ー",
    "の": "・・ーー",
    "は": "ー・・・",
    "ひ": "ーー・・ー",
    "ふ": "ーー・・",
    "へ": "・",
    "ほ": "ー・・",
    "ま": "ー・・ー",
    "み": "・・ー・ー",
    "む": "ー",
    "め": "ー・・・ー",
    "も": "ー・・ー・",
    "や": "・ーー",
    "ゆ": "ー・・ーー",
    "よ": "ーー",
    "ら": "・・・",
    "り": "ーー・",
    "る": "ー・ーー・",
    "れ": "ーーー",
    "ろ": "・ー・ー",
    "わ": "ー・ー",
    "を": "・ーーー",
    "ん": "・ー・ー・",
    'A': '・ー', 'B': 'ー・・・', 'C': 'ー・ー・', 'S': '・・・', 'O': 'ーーー'
  };

  /**
   * 画面下部の一覧表示用に、すべてのマッピングを配列で取得する
   */
  public static getAllMappings(): MorseMapping[] {
    return Object.entries(this.mappings).map(([char, code]) => ({ char, code }));
  }

  /**
   * 特定の文字からモールス信号を引く（データ登録時のバリデーション用など）
   */
  public static getCode(char: string): string | undefined {
    return this.mappings[char.toUpperCase()] || this.mappings[char];
  }
}