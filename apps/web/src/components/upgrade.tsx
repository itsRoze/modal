import Image from "next/image";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { anybody } from "@/utils/fonts";
import { motion } from "framer-motion";

import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

const Upgrade = () => {
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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      return push("/login");
    } catch (error) {}
  };

  const variants = {
    hidden: { opacity: 0, x: -200, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -100 },
  };

  return (
    <motion.div
      variants={variants} // Pass the variant object into Framer Motion
      initial="hidden" // Set the initial state to variants.hidden
      animate="enter" // Animated state to variants.enter
      exit="exit" // Exit state (used later) to variants.exit
      transition={{ type: "linear" }} // Set the transition to linear
      className={cn(
        "flex h-full w-full items-center justify-center p-20",
        `${anybody.variable} font-mono`,
      )}
    >
      <div className="border-logo flex h-full w-full justify-center rounded-lg border-2 p-10 shadow-xl">
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-center text-2xl font-medium md:text-7xl">
            Time to upgrade!
          </h1>
          <div className="flex w-full justify-center  text-white">
            <div className="w-fit rounded-md bg-orange-400 px-8 py-2 uppercase">
              <h2 className="text-lg font-medium md:text-3xl">
                One simple price
              </h2>
              <h2 className="text-lg font-medium md:text-3xl">
                Cancel anytime
              </h2>
            </div>
          </div>
          <h2 className="my-4 text-center text-lg font-medium md:text-3xl">
            Less than a{" "}
            <span className="relative">
              latte
              <Image
                src="/images/coffee.png"
                width={114}
                height={114}
                alt="Coffe cup"
                className="absolute bottom-0 left-full h-auto w-4 md:w-10"
              />
            </span>
          </h2>
          <div className="flex w-full justify-center">
            <div className="w-[48rem] space-y-4 md:text-xl">
              <p>
                I really hoped you enjoyed this free trial. I charge a small fee
                to help cover the costs of running this app. If you believe in
                this app, you can upgrade your plan here. If you have any
                feedback (good or bad!), you can email me at{" "}
                <a
                  href="mailto:hello@aroze.xyz"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  hello@aroze.xyz
                </a>
                🚀
              </p>
              <p className="italic">— Roze, solo founder and engineer</p>
            </div>
          </div>
          <div className="space-x-4 md:mt-20">
            <Button onClick={handleUpgrade} className="md:text-xl" size={"lg"}>
              Upgrade
            </Button>
            <Button onClick={handleLogout} className="md:text-xl" size={"lg"}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Upgrade;
