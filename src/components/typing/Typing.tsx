import MorseKeyPad from './MorseKeypad';
import WordDisplay from "./WordDisplay";
import useGameLogic from "../../hooks/useGameLogic";
import ScoreBoard from './scoreBoard';

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
        resetGame,
        totalCorrectKeystrokes
    } = useGameLogic();

    // ゲームクリアのチェック
    if (isGameFinished) {
        return (
        <>
        <ScoreBoard clearTime={clearTimeRef.current} miss={missCounter} totalCorrectKeystrokes={totalCorrectKeystrokes}/>
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

// 入力中のデータ表示
function InputStatus(){}