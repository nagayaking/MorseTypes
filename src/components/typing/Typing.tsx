import Button from "../Button";
import { useState, useRef } from "react";
import { countThreshold } from "../stores";
import { EXAM_TEXTS, type Question } from '../../data/wordList';

export default function Typing(){
    // モールス信号を入れておくバッファ（ひらがな一文字単位）
    const [morseBuffer, setMorseBuffer] = useState("");
    // 現在、何問目かをカウントするState
    const [currentExamNumber, setCurrenExamNumber] = useState(0);
    // EXAM_TEXTSのインデックスをシャッフルして管理するState
    const [examNumbers, setExamNumbers] = useState(shuffleArray(Array.from({length:EXAM_TEXTS.length}, (_, i: number) => i)));
    // 現在の問題を入れておく変数
    const currentExamText:string = EXAM_TEXTS[examNumbers[currentExamNumber]].text

    // 入力したモールス信号を受け取ってバッファに追加する関数
    function handleAddSymbol(newSymbol: string) {
        setMorseBuffer(prevBuffer => prevBuffer + newSymbol);
    }
    
    return(
        <>
        <MorseKeypad onInput={handleAddSymbol}/>
        {/* テスト表示用 */}
        <div>現在のバッファ: {morseBuffer}</div>
        <WordDisplay text={ currentExamText }/>
        </>
    )
}

// スコアの表示
function ScoreBoard(){
}

interface WordDisplayProps {
    text: string;
}
// 問題文表示
function WordDisplay({text}:WordDisplayProps){
    return(
        <>
        <div>{ text }</div>
        </>
    )
}

// 入力中のデータ表示
function InputStatus(){}


type MorseKeypadProps = {
    onInput: (symbol: string) => void;
};
// モールス信号入力ボタン
function MorseKeypad({ onInput }: MorseKeypadProps){
    // 現在入力状態にあるモールス信号を保持
    const [morseBuffer, setMorseBuffer] = useState("");
    const startTimeRef = useRef(0);

    // ボタンを押したとき。現在時刻を入手
    function handleMouseDown() {
        startTimeRef.current = performance.now();
    }
    
    // ボタンを離す・ボタンからカーソルを離したときの処理
    // 入力時間に応じてモールス信号の長音短音を判別しバッファに格納
    function handleInputEnd() {
        if(startTimeRef.current === 0){
            return;
        }
        const inputingTime:number = performance.now() - startTimeRef.current;
        startTimeRef.current = 0;

        const threshold:number = countThreshold.get();
        const newSymbol = inputingTime < threshold ? "・" : "－";
        onInput(newSymbol)

        console.log(morseBuffer)
    }

    // ボタンを離す・ボタンからカーソルを離したとき
    function handleMouseUp() {
        handleInputEnd();
    }
    function handleMouseLeave() {
        handleInputEnd();
    }

    return (
        <>
        <button 
            className="btn"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >click here!</button>
        </>
    )
}

const shuffleArray = (array:any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
