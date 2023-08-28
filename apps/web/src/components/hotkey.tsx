interface IHotkKey {
  keys: string[];
  text?: string;
}

const Hotkey: React.FC<IHotkKey> = ({ keys, text }) => {
  return (
    <div className="flex items-center gap-0.5">
      {text ? <p className="mr-1">{text}</p> : null}
      {keys.map((charKey, i) => (
        <CharacteHotkey key={i} charKey={charKey} />
      ))}
    </div>
  );
};

interface ICharacterKey {
  charKey: string;
}

const CharacteHotkey: React.FC<ICharacterKey> = ({ charKey }) => {
  return (
    <div className="rounded-sm border border-slate-300 p-0.5 text-sm text-gray-500">
      {charKey}
    </div>
  );
};

export default Hotkey;
