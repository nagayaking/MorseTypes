import { HIRAGANA_MAP } from "../../data/morseMap";

interface WordDisplayProps {
    text: string;
    hurigana: string;
    pointer: number;
    morseBuffer: string
}

// 問題文表示
export default function WordDisplay({text, hurigana, pointer, morseBuffer}:WordDisplayProps){
    // 💡 切り出し（slice）をやめて、常に「-2, -1, 0, 1, 2」の5つの相対位置を作る
    const offsets = [-2, -1, 0, 1, 2];

    return(
        <>
        <h1>{text}</h1>
        <div className="morse-questions">
        {offsets.map((offset, index) => {
            // 現在のポインターからの絶対的なインデックスを計算
            const absoluteIndex = pointer + offset;
            
            // その位置に文字が実在するかをチェック（0以上、かつ文字列の長さ未満か）
            const isValidIndex = absoluteIndex >= 0 && absoluteIndex < hurigana.length;
            const char = isValidIndex ? hurigana[absoluteIndex] : null;

            // 文字が存在しない（最初と最後の余白部分）場合は、透明なダミーを返す
            if (!char) {
                return (
                    // visibility: "hidden" にすることで、場所だけ確保して見えなくする
                    <div key={`empty-${index}`} className="character-group" style={{ visibility: "hidden" }}>
                        <div className="hiragana">あ</div>
                        <div className="morse-code">・・・</div>
                    </div>
                );
            }
            const answerMorse = HIRAGANA_MAP[char]; // （※辞書から取得する想定）
            
            // 画面に出力する前に、ここで条件分岐をして変数にJSXを詰め込んでおく
            let morseContent;
            
            if (absoluteIndex < pointer) {
                // 1. 過去（地味な色）
                morseContent = <span className="morse-past">{answerMorse}</span>;
                
            } else if (absoluteIndex > pointer) {
                // 2. 未来（通常の色）
                morseContent = <span className="morse-future">{answerMorse}</span>;
                
            } else {
                // 3. 現在（さらに分解して、それぞれに色を付ける）
                morseContent = answerMorse.split("").map((mark, markIndex) => {
                    // ここで morseBuffer（今入力している状況）と照らし合わせる
                    let markClass = "morse-normal";
                    
                    if (markIndex < morseBuffer.length) {
                        // 💡 プレイヤーが入力した記号と、正解の記号を比較する
                        if (morseBuffer[markIndex] === mark) {
                            markClass = "morse-correct"; // 正解なら緑色
                        } else {
                            markClass = "morse-error";   // 間違っていたら赤色
                        }
                    }
                    
                    
                    return (
                        <span key={markIndex} className={markClass}>
                            {mark}
                        </span>
                    );
                });
            }
            
            // 💡 最後に、完成した変数を {morseContent} としてポンと置くだけ！
            return (
                <div key={index} className="character-group">
                    <div className="hiragana">{char}</div>
                    <div className="morse-code">
                        {morseContent}
                    </div>
                </div>
            );
        })}
        </div>
        </>
    )
}