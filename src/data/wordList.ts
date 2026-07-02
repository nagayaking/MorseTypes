export type Question = {
    id: number;
    text: string;
    textHurigana: string;
};

// 問題データの配列
export const EXAM_TEXTS: Question[] = [
    { id: 1, text: "今日", textHurigana: "きょう" },
    { id: 2, text: "明日", textHurigana: "あした" },
];