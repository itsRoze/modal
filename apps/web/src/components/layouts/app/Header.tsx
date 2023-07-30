import Image from "next/image";
import { useRouter } from "next/router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useToast } from "@/components/ui/use-toast";
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
        <TrialBanner remainingDays={remainingTrialDays} />
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

const TrialBanner = ({ remainingDays }: { remainingDays: number }) => {
  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation();

  const { push } = useRouter();
  const { toast } = useToast();

  const handleUpgrade = async () => {
    try {
      const { checkoutUrl } = await createCheckoutSession();
      if (checkoutUrl) void push(checkoutUrl);
    } catch (error) {
      toast({
        title: "Uh oh!",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <HoverCard openDelay={0} closeDelay={100}>
      <HoverCardTrigger asChild>
        <button
          onClick={handleUpgrade}
          className={cn(
            "rounded-md bg-red-100 px-1 font-medium shadow-md",
            `${inter.variable} font-sans`,
          )}
        >
          Trial: {remainingDays} {remainingDays === 1 ? "day" : "days"} left
        </button>
      </HoverCardTrigger>
      <HoverCardContent>
        <p className="text-sm">
          You&apos;re currently on a free trial. Upgrade your account
        </p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Header;
