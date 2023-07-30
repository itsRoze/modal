import Image from "next/image";
import { useRouter } from "next/router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { inter } from "@/utils/fonts";
import { Menu, UserCircle2 } from "lucide-react";

interface IHeader {
  onMenuButtonClick: () => void;
  remainingTrialDays?: number;
}

const Header: React.FC<IHeader> = ({
  onMenuButtonClick,
  remainingTrialDays,
}) => {
  const { mutateAsync: createBillingPortalSession } =
    api.stripe.createBillingPortalSession.useMutation();

  const { push } = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      return push("/login");
    } catch (error) {}
  };

  const handleManageSubscription = async () => {
    const { billingPortalUrl } = await createBillingPortalSession();
    if (billingPortalUrl) void push(billingPortalUrl);
  };

  return (
    <div className="bg-logo flex items-center gap-2 px-9 py-2 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
      <div className="flex-grow">
        <Image
          src="/images/app-logo.svg"
          width={108}
          height={28}
          alt="Application logo"
          className="h-auto w-auto"
        />
      </div>
      {remainingTrialDays ? (
        <div
          className={cn(
            "rounded-md bg-red-100 px-1 font-medium shadow-md",
            `${inter.variable} font-sans`,
          )}
        >
          Trial: {remainingTrialDays}{" "}
          {remainingTrialDays === 1 ? "day" : "days"} left
        </div>
      ) : null}

      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserCircle2 size={28} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <button onClick={handleLogout}>Logout</button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <button onClick={handleManageSubscription}>
              Manage subscription
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <button className="lg:hidden" onClick={onMenuButtonClick}>
        <Menu size={24} className="text-gray-200" />
      </button>
    </div>
  );
};

export default Header;
