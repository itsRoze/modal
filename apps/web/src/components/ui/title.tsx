import { type LucideIcon } from "lucide-react";

interface ITitle {
  title: string;
  Icon: LucideIcon;
  iconColor?: string;
}

const Title: React.FC<ITitle> = ({ title, Icon, iconColor }) => {
  return (
    <div className="flex items-center gap-x-2 px-4 py-2">
      <Icon size={32} className={iconColor ?? "text-black"} />
      <h1 className="text-2xl font-medium">{title}</h1>
    </div>
  );
};

export default Title;
