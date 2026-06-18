import { useStore } from '@nanostores/react';
import { countVolume } from '../stores';
import { countThreshold } from '../stores';

export default function Counter({ children, count: initialCount }: { children: React.JSX.Element; count: number }) {
  const countVol = useStore(countVolume);
  const countThr = useStore(countThreshold);
  const doChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = Number(e.target.value);
    countVolume.set(volume);
  };
  const doChangeThreshold = (e: React.ChangeEvent<HTMLInputElement>) => {
    const threshold = Number(e.target.value);
    countThreshold.set(threshold);
  };

  return (
    <>
      <div className="counter-message">{children}</div>
      <div>volume</div>
      <div className="counter">
        <input type='number' value={countVol} min={0} max={100} onChange={doChangeVolume}></input>
        <input type='range' value={countVol} min={0} max={100} onChange={doChangeVolume}></input>
      </div>
      <div>morse threshold</div>
      <div className='counter'>
        <input type='number' value={countThr} min={0} max={1000} onChange={doChangeThreshold}></input>
        <input type='range' value={countThr} min={0} max={1000} onChange={doChangeThreshold}></input>
      </div>
    </>
  );
}
