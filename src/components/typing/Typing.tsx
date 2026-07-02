import Button from "../Button";
import { useState, useRef } from "react";
import { countThreshold } from "../stores";
import{ EXAM_TEXTS } from '../../data/wordList';

export default function Typing(){
    const [morseBuffer, setMorseBuffer] = useState("");

    // 入力したモールス信号を受け取ってバッファに追加する関数
    function handleAddSymbol(newSymbol: string) {
        setMorseBuffer(prevBuffer => prevBuffer + newSymbol);
    }
    
    return(
        <>
        <MorseKeypad onInput={handleAddSymbol}/>
        {/* テスト表示用 */}
        <div>現在のバッファ: {morseBuffer}</div>
        </>
    )
}

// スコアの表示
function ScoreBoard(){
}

// 問題文表示
function WordDisplay(){}

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
