interface IDividerProps {
  widthMargin?: string;
  heightPadding?: string;
}

const Divider: React.FC<IDividerProps> = ({
  widthMargin = "mx-4",
  heightPadding = "py-5",
}) => {
  return (
    <div
      className={`relative flex ${heightPadding} ${widthMargin} items-center`}
    >
      <div className="border-border-color flex-grow border-t" />
      <div className="border-border-color flex-grow border-t" />
    </div>
  );
};

export default Divider;
