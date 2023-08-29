interface IDividerProps {
  widthMargin?: string;
  heightPadding?: string;
  borderColor?: string;
}

const Divider: React.FC<IDividerProps> = ({
  widthMargin = "mx-4",
  heightPadding = "py-5",
  borderColor = "border-border",
}) => {
  return (
    <div
      className={`relative flex ${heightPadding} ${widthMargin} items-center`}
    >
      <div className={`${borderColor} flex-grow border-t`} />
      <div className={`${borderColor} flex-grow border-t`} />
    </div>
  );
};

export default Divider;
