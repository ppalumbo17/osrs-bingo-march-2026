type TileCheckboxProps = {
  checked: boolean;
  tileLabel: string;
  onChange: (checked: boolean) => void;
};

export function TileCheckbox({ checked, tileLabel, onChange }: TileCheckboxProps) {
  function stopAll(e: React.SyntheticEvent) {
    e.stopPropagation();
  }

  return (
    <div
      className="tile-checkbox"
      onClick={stopAll}
      onMouseDown={stopAll}
      onMouseUp={stopAll}
    >
      <input
        type="checkbox"
        checked={checked}
        aria-label={`Mark "${tileLabel}" as complete`}
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.target.checked);
        }}
      />
    </div>
  );
}
