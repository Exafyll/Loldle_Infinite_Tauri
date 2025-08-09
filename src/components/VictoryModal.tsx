interface VictoryModalProps {
  attempts: number;
  onPlayAgain: () => void;
}

export default function VictoryModal({
  attempts,
  onPlayAgain,
}: VictoryModalProps) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>You won! 🎉</h2>
        <p>Guessed correctly in {attempts} attempt(s).</p>
        <button onClick={onPlayAgain}>Play Again (Random)</button>
      </div>
    </div>
  );
}
