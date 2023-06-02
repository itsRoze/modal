import Image from "next/image";
import { Menu } from "lucide-react";

interface IHeader {
  onMenuButtonClick: () => void;
}

const Header: React.FC<IHeader> = ({ onMenuButtonClick }) => {
  return (
    <div className="bg-logo flex items-center justify-between px-9 py-2 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
      <Image
        src="/images/app-logo.svg"
        width={108}
        height={28}
        alt="Application logo"
        className="h-auto w-auto"
      />
      <button className="lg:hidden" onClick={onMenuButtonClick}>
        <Menu size={16} />
      </button>
    </div>
  );
};

export default Header;
