interface WordDisplayProps {
    text: string;
}

// 問題文表示
export default function WordDisplay({text}:WordDisplayProps){
    return(
        <>
        <div>{ text }</div>
        </>
    )
}