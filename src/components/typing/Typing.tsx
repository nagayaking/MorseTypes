import MorseKeyPad from './MorseKeypad'
import WordDisplay from "./WordDisplay";
import useGameLogic from "../../hooks/useGameLogic";

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
        convert
    } = useGameLogic();

    // ゲームクリアのチェック
    if (isGameFinished) {
        return <div>全問正解！！</div>
    }
    
    return(
        <>
        <MorseKeyPad onInput={handleAddSymbol} cnv={convert}/>
        {/* テスト表示用 */}
        <div>現在のバッファ: {morseBuffer}</div>
        <div>ひらがなの問題: {currentExamHurigana[currentExamPointer]}</div>
        <WordDisplay text={ currentExamText }/>
        <div className="morse-buffer-container">
            {morseBuffer.split("").map((x, n) => {
                // 1文字目からn番目の文字までの「これまでの入力の繋がり」を切り出す
                const currentInputStr = morseBuffer.slice(0, n + 1);
                
                // 正解のモールス信号が、その「これまでの入力」と前方一致しているかチェック
                const isCorrectPath = answerMorsecode.startsWith(currentInputStr);

                return (
                    <span 
                        key={n} 
                        className={!isCorrectPath ? "error-text" : "normal-text"}
                    >
                        {x}
                    </span>
                );
            })}
        </div>
        </>
    )
}

// スコアの表示
function ScoreBoard(){
}

// 入力中のデータ表示
function InputStatus(){}