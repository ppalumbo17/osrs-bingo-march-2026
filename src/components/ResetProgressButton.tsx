type ResetProgressButtonProps = {
  onReset: () => void;
};

export function ResetProgressButton({ onReset }: ResetProgressButtonProps) {
  return (
    <button className="reset-progress-btn" onClick={onReset}>
      Reset Progress
    </button>
  );
}
