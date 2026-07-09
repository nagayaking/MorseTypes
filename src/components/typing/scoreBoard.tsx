import '../../styles/scoreBoard.css';

interface ScoreBoardProps {
    clearTime: number;
    miss: number;
    totalCorrectKeystrokes: number;
}
// スコアの表示
export default function ScoreBoard({clearTime, miss, totalCorrectKeystrokes}: ScoreBoardProps){
        // リザルト画面での計算イメージ
    const timeInSeconds = clearTime / 1000;
    const totalKeystrokes = totalCorrectKeystrokes;
    const totalInputs = totalKeystrokes + miss;

    // KPM (1分あたりの入力速度)
    const kpm = (totalKeystrokes / timeInSeconds) * 60

    // 正解率 (%)
    const accuracy = Math.round((totalKeystrokes / totalInputs) * 100);

    // 総合スコア (例: KPMに正解率を掛けたもの)
    const score = Math.round(kpm * (accuracy / 100) * 100);

    // ランク
    const rank: string = getRank(score);

    function getRank(score: number){
        if(score >= 2000){
            return "S";
        }
        else if(score >= 1500){
            return "A";
        }
        else if(score >= 1000){
            return "B";
        }
        else if(score >= 500){
            return "C";
        }
        else if(score >= 0){
            return "D";
        }
        else {
            return "error";
        }
    }

    return(
        <>
        <div className='score-container'>
        <div>
            <span className='rank-text'>Rank: </span>
            <span className='rank'>{ rank }</span>
        </div>
        <div className='scores'>
            <div>Score: { score }</div>
            <div>miss: { miss }</div>
            <div>Clear Time: { Math.floor(clearTime/10)/100 }s</div>
        </div>
        </div>
        </>
    );
}