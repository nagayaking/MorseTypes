import { useState } from 'react';

export default function Counter({ children, count: initialCount }: { children: React.JSX.Element; count: number }) {
  const [count, setCount] = useState(initialCount);
  const doChangeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = Number(e.target.value);
    setCount(volume);
  };

  return (
    <>
      <div className="counter-message">{children}</div>
      <div className="counter">
        <input type='number' value={count} min={0} max={100} onChange={doChangeVolume}></input>
        <input type='range' value={count} min={0} max={100} onChange={doChangeVolume}></input>
      </div>
    </>
  );
}
