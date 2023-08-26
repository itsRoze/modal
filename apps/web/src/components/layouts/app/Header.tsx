import Image from "next/image";
import { useRouter } from "next/router";
import MailTo from "@/components/mailto";
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
import { type RouterOutputs } from "@modal/api";
import { getRemainingTrial } from "@modal/common";
import { Menu, UserCircle2 } from "lucide-react";

interface IHeader {
  userData: RouterOutputs["user"]["get"];
  onMenuButtonClick: () => void;
}

const Header: React.FC<IHeader> = ({ userData, onMenuButtonClick }) => {
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
    <div className="bg-logo flex items-center gap-2 px-2 py-2 shadow-[0_4px_10px_rgba(0,0,0,0.2)] md:px-9">
      <div className="flex-grow">
        <Image
          src="/images/app-logo.svg"
          width={108}
          height={28}
          alt="Application logo"
          className="h-auto w-auto"
        />
      </div>
      {userData.time_email_verified &&
      userData.stripeSubscriptionStatus != "active" ? (
        <TrialBanner
          remainingDays={getRemainingTrial(userData.time_email_verified)}
        />
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="User Settings">
          <UserCircle2 size={28} aria-hidden />
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
          <DropdownMenuItem>
            <button>
              <MailTo
                email="contact@codestache.com"
                subject="Modal App - Feedback"
              >
                Submit feedback
              </MailTo>
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
            "rounded-md bg-red-100 px-1 text-sm font-medium shadow-md md:text-base",
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
