import { countVolume } from "../components/stores";

const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;

// AudioContextの作成
const audioContext = new AudioContextClass();

export function startAudio() {
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
    
    // OscillatorNodeの作成
    const oscillator = audioContext.createOscillator();
    
    // OscillatorNodeの設定
    oscillator.type = "sine";
    oscillator.frequency.value = 600;

    // GainNodeの作成
    const gainNode = audioContext.createGain();

    // GainNodeの作成
    gainNode.gain.value = countVolume.get()/100;

    // GainNodeへの接続
    oscillator.connect(gainNode);

    // Destinationへの接続
    gainNode.connect(audioContext.destination);

    // 音をスタートさせる
    oscillator.start();

    return oscillator;
}

export function stopAudio(oscillator: any) {
    oscillator.stop();
}