import Button from "../Button";
import { useState, useRef, useEffect } from "react";
import { countThreshold } from "../stores";
import { EXAM_TEXTS, type Question } from '../../data/wordList';
import { MORSECODE_MAP, HIRAGANA_MAP } from "../../data/morseMap";

export default function Typing(){
    // モールス信号を入れておくバッファ（ひらがな一文字単位）
    const [morseBuffer, setMorseBuffer] = useState("");
    // バッファの中身を監視するRef
    const bufferRef = useRef("");
    // 現在、何問目かをカウントするState
    const [currentExamNumber, setCurrenExamNumber] = useState(0);
    // EXAM_TEXTSのインデックスをシャッフルして管理するState
    const [examNumbers, setExamNumbers] = useState<number[]>([]);
    // 問題の何文字目を打っているかを管理するState
    const [currentExamPointer, setCurrenExamPointer] = useState(0);
    // 現在エラー中かを管理するState
    const [isError, setIsError] = useState(false);
    // ゲームが終了したかを管理するState
    const [isGameFinished, setIsGameFinished] = useState(false);
    
    useEffect(() => {
        const initialNumbers:number[] = shuffleArray(Array.from({length:EXAM_TEXTS.length}, (_, i: number) => i));
        setExamNumbers(initialNumbers);
    }, []);
    
    // ローディング
    if (examNumbers.length === 0) {
        return <div>読み込み中...</div>;
    }

    // ゲームクリアのチェック
    if (isGameFinished) {
        return <div>全問正解！！</div>
    }
    
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
    
    return(
        <>
        <MorseKeypad onInput={handleAddSymbol} cnv={convert}/>
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
    cnv: () => void;
};
// モールス信号入力ボタン
function MorseKeypad({ onInput, cnv }: MorseKeypadProps){
    // モールス信号の入力開始時間を保持
    const startTimeRef = useRef(0);
    // setTimeoutのidを保持
    const idRef= useRef<ReturnType<typeof setTimeout>>(null);
    // 短音長音のしきい値
    const threshold:number = countThreshold.get();

    // ボタンを押したとき。現在時刻を入手
    function handleMouseDown() {
        startTimeRef.current = performance.now();

        // setTimeoutのクリア
        if (idRef.current !== null) {
            clearTimeout(idRef.current);
            idRef.current = null; // 必要に応じてクリア後にnullに戻す
        }
    }
    
    // ボタンを離す・ボタンからカーソルを離したときの処理
    function handleInputEnd() {
        if(startTimeRef.current === 0){
            return;
        }
        // 入力時間に応じてモールス信号の長音短音を判別しバッファに格納
        const inputingTime:number = performance.now() - startTimeRef.current;
        startTimeRef.current = 0;
        
        const newSymbol = inputingTime < threshold ? "・" : "ー";
        onInput(newSymbol)

        // タイマーのセット
        idRef.current = setTimeout(cnv, threshold*3);
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
