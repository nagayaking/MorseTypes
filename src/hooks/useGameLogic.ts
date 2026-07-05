import { useState, useEffect, useRef } from "react";
import shuffleArray from "../utils/shuffle";
import { EXAM_TEXTS } from "../data/wordList";
import { HIRAGANA_MAP, MORSECODE_MAP } from "../data/morseMap";

const useGameLogic = () => {
    // モールス信号を入れておくバッファ（ひらがな一文字単位）
    const [morseBuffer, setMorseBuffer] = useState("");
    // バッファの中身を監視するRef
    const bufferRef = useRef("");
    // 現在、何問目かをカウントするState
    const [currentExamNumber, setCurrenExamNumber] = useState(0);
    // EXAM_TEXTSのインデックスをシャッフルして管理するState
    const [examNumbers, setExamNumbers] = useState<number[]>(() => {
        return shuffleArray(Array.from({length:EXAM_TEXTS.length}, (_, i: number) => i));
    });
    // 問題の何文字目を打っているかを管理するState
    const [currentExamPointer, setCurrenExamPointer] = useState(0);
    // 現在エラー中かを管理するState
    const [isError, setIsError] = useState(false);
    // ゲームが終了したかを管理するState
    const [isGameFinished, setIsGameFinished] = useState(false);

    // 現在の問題を入れておく変数
    // 本文
    const currentExamText:string = EXAM_TEXTS[examNumbers[currentExamNumber]].text;
    // ふりがな
    const currentExamHurigana:string = EXAM_TEXTS[examNumbers[currentExamNumber]].textHurigana;

    // 正解のひらがな（一文字）
    const answerHiragana: string = currentExamHurigana[currentExamPointer];
    // 正解のひらがな（一文字）をモールス信号に変換したもの
    const answerMorsecode: string = HIRAGANA_MAP[answerHiragana];

    function handleAddSymbol(newSymbol: string) {
            // 入力したモールス信号を受け取ってバッファに追加する
            const newMorse:string = morseBuffer + newSymbol;
            setMorseBuffer(newMorse);
            bufferRef.current = newMorse;
    
            // 間違った入力をしているかの判定
            if(!answerMorsecode.startsWith(newMorse) && !isError){
                setIsError(true);
            }
        }
    
        // 一定時間モールス信号の入力がなかったときに発火する関数
    function convert(){
        // 入力されたものをモールス信号に変換したもの
        const inputHiragana: string = MORSECODE_MAP[bufferRef.current];
        console.log(currentExamPointer);
        console.log(currentExamHurigana.length);

        // 正解判定
        if(bufferRef.current === answerMorsecode){
            // 次の問題へ
            if(currentExamPointer === currentExamHurigana.length - 1){
                setMorseBuffer("");
                bufferRef.current = "";
                setCurrenExamNumber(x => x + 1);
                setCurrenExamPointer(0);
                setIsError(false);
                // 全問正解の処理
                if(currentExamNumber === examNumbers.length - 1){
                    setIsGameFinished(true);
                }
            }
            // 次の文字へ
            else {
                setMorseBuffer("");
                bufferRef.current = "";
                setCurrenExamPointer(x => x + 1);
                setIsError(false);
            }
        }
        // 不正解判定
        else {
            setMorseBuffer("");
            bufferRef.current = "";
            setIsError(false);
        }
    }

    return {
        morseBuffer,
        currentExamText,
        currentExamHurigana,
        currentExamPointer,
        answerMorsecode,
        isGameFinished,
        examNumbers,
        handleAddSymbol,
        convert
    };
}

export default useGameLogic;