import { HIRAGANA_MAP } from "../../data/morseMap";

interface WordDisplayProps {
    text: string;
    hurigana: string;
    pointer: number;
    morseBuffer: string
}

// 問題文表示
export default function WordDisplay({text, hurigana, pointer, morseBuffer}:WordDisplayProps){
    // 1文字あたりの幅を指定（CSSの .character-group の width と一致させる）
    const charWidth = 10; 
    
    // 0文字目が画面のちょうど中央（left: 50%）にくる配置から、
    // 現在の pointer × 文字幅 分だけ左側（マイナス方向）に押し出していく移動量を計算
    const offset = (charWidth / 2) + (pointer * charWidth);

    return(
        <div className="word-display-container">
            <div className="questionSentences">
            <h1>{text}</h1>
            <p>{hurigana}</p>
            </div>
            
            <div className="slider-window">
                
                {/* 実際に左にスライドしていく長いレール */}
                <div 
                    className="slider-track"
                    style={{ transform: `translateX(-${offset}rem)` }}
                >
                    {hurigana.split("").map((char, index) => {
                        const answerMorse = HIRAGANA_MAP[char];
                        
                        let morseContent;
                        
                        // index と pointer を直接比較して過去・未来・現在を決めます
                        if (index < pointer) {
                            // 1. 過去
                            morseContent = <span className="morse-past">{answerMorse}</span>;
                            
                        } else if (index > pointer) {
                            // 2. 未来
                            morseContent = <span className="morse-future">{answerMorse}</span>;
                            
                        } else {
                            // 3. 現在
                            morseContent = answerMorse.split("").map((mark, markIndex) => {
                                let markClass = "morse-normal";
                                
                                if (markIndex < morseBuffer.length) {
                                    if (morseBuffer[markIndex] === mark) {
                                        markClass = "morse-correct";
                                    } else {
                                        markClass = "morse-error";
                                    }
                                }
                                
                                return (
                                    <span key={markIndex} className={markClass}>
                                        {mark}
                                    </span>
                                );
                            });
                        }
                        
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
            </div>
        </div>
    )
}