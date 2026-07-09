import { useStore } from '@nanostores/react';
import { countVolume, countThreshold, countNumberOfQuestion } from '../stores';
import '../../styles/setting.css'

export default function Counter(){
  // モールス信号の音量
  const countVol = useStore(countVolume);
  // モールス信号の短音長音のしきい値
  const countThr = useStore(countThreshold);
  // 問題数
  const countQuestionNum = useStore(countNumberOfQuestion);

  // 音量を取得
  const doChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = Number(e.target.value);
    countVolume.set(volume);
  };
  // しきい値を取得
  const doChangeThreshold = (e: React.ChangeEvent<HTMLInputElement>) => {
    const threshold = Number(e.target.value);
    countThreshold.set(threshold);
  };
  // 問題数を取得
  const doChangeNumberOfQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberOfQuestion = Number(e.target.value);
    countNumberOfQuestion.set(numberOfQuestion);
  };

  return (
    <>
      <p className="title">Settings</p>
      <div className='counter-containers'>

        <div className='counter-container'>
          <div className='category'>Volume</div>
          <div className="counter">
            <input type='number' value={countVol} min={0} max={100} onChange={doChangeVolume}></input>
            <input type='range' value={countVol} min={0} max={100} onChange={doChangeVolume}></input>
          </div>
        </div>

        <div className='counter-container'>
          <div className='category'>Morse Threshold</div>
          <div className='counter'>
            <input type='number' value={countThr} min={1} max={1000} onChange={doChangeThreshold}></input>
            <input type='range' value={countThr} min={1} max={1000} onChange={doChangeThreshold}></input>
          </div>
        </div>

        <div className='counter-container'>
          <div className='category'>Number of Question</div>
          <div className='counter'>
            <input type="number" value={countQuestionNum} min={1} max={50} step={5} onChange={doChangeNumberOfQuestion}/>
            <input type="range" value={countQuestionNum} min={1} max={50} step={5} onChange={doChangeNumberOfQuestion}/>
          </div>
        </div>
      </div>
    </>
  );
}
