import Image from "next/image";
import Link from "next/link";
import { Menu, UserCircle2 } from "lucide-react";

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
      <Link
        href="/app/account"
        className="rounded-full p-1 text-black  transition-colors duration-300 hover:text-slate-200"
      >
        <UserCircle2 size={28} />
      </Link>
      <button className="lg:hidden" onClick={onMenuButtonClick}>
        <Menu size={24} className="text-gray-200" />
      </button>
    </div>
  );
};

export default Header;
