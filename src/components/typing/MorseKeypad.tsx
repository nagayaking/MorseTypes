import { useRef } from "react";
import { countThreshold } from "../stores";
import { startAudio, stopAudio } from "../../utils/sound";

type MorseKeypadProps = {
    onInput: (symbol: string) => void;
    cnv: () => void;
};
// モールス信号入力ボタン
export default function MorseKeypad({ onInput, cnv }: MorseKeypadProps){
    // モールス信号の入力開始時間を保持
    const startTimeRef = useRef(0);
    // setTimeoutのidを保持
    const idRef= useRef<ReturnType<typeof setTimeout>>(null);
    // oscillatorを保存しておくRef
    const oscillatorRef = useRef<OscillatorNode | null>(null);
    // 短音長音のしきい値
    const threshold:number = countThreshold.get();

    // ボタンを押したとき。現在時刻を入手
    function handleMouseDown() {
        startTimeRef.current = performance.now();

        // 音を流す
        oscillatorRef.current = startAudio();

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

        // 音を止める
        stopAudio(oscillatorRef.current);
        oscillatorRef.current = null;
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