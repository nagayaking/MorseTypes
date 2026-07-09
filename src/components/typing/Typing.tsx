import MorseKeyPad from './MorseKeypad';
import WordDisplay from "./WordDisplay";
import useGameLogic from "../../hooks/useGameLogic";

import '../../styles/wordDisplayLayout.css'

export default function Typing(){
    const {
        morseBuffer,
        currentExamText,
        currentExamHurigana,
        currentExamPointer,
        answerMorsecode,
        isGameFinished,
        examNumbers,
        handleAddSymbol,
        convert,
        clearTimeRef,
        missCounter,
        resetGame
    } = useGameLogic();

    // ゲームクリアのチェック
    if (isGameFinished) {
        return (
        <>
        <div>全問正解！！</div>
        <ScoreBoard clearTime={clearTimeRef.current} miss={missCounter}/>
        <button className='btn' onClick={resetGame}>restart</button>
        <a className='btn' onClick={resetGame} href='settings'>to settings</a>
        </>
        )
    }
    
    return(
        <>
        <WordDisplay 
            text={ currentExamText } 
            hurigana={ currentExamHurigana } 
            pointer={ currentExamPointer } 
            morseBuffer={ morseBuffer }
        />
        <MorseKeyPad onInput={handleAddSymbol} cnv={convert}/>
        </>
    )
}

interface ScoreBoardProps {
    clearTime: number;
    miss: number;
}
// スコアの表示
function ScoreBoard({clearTime, miss}: ScoreBoardProps){
    return(
        <>
        <div>miss: { miss }</div>
        <div>Clear Time: { Math.floor(clearTime/10)/100 }s</div>
        </>
    );
}

// 入力中のデータ表示
function InputStatus(){}