import { useMediaQuery } from "@uidotdev/usehooks";
import { type LucideIcon } from "lucide-react";

interface ITitle {
  title: string;
  Icon: LucideIcon;
  iconColor?: string;
}

const Title: React.FC<ITitle> = ({ title, Icon, iconColor }) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  return (
    <div className="flex items-center gap-x-2 py-2">
      <Icon
        size={isSmallDevice ? 24 : 26}
        className={iconColor ?? "text-black"}
      />
      <h1 className="text-lg font-medium md:text-2xl">{title}</h1>
    </div>
  );
};

export default Title;
