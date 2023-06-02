import Image from "next/image";
import Link from "next/link";
import CommercialLayout from "@/components/layouts/commerical/CommercialLayout";
import { anybody } from "@/utils/fonts";
import { motion } from "framer-motion";

import { type NextPageWithLayout } from "./_app";

const Pricing: NextPageWithLayout = () => {
  const variants = {
    hidden: { opacity: 0, x: -200, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -100 },
  };

  return (
    <motion.article
      variants={variants} // Pass the variant object into Framer Motion
      initial="hidden" // Set the initial state to variants.hidden
      animate="enter" // Animated state to variants.enter
      exit="exit" // Exit state (used later) to variants.exit
      transition={{ type: "linear" }} // Set the transition to linear
      className={`${anybody.variable} font-mono`}
    >
      <section className="flex flex-col items-center justify-center px-16">
        <h1 className="text-center text-2xl font-medium md:text-7xl">
          Less than a{" "}
          <span className="relative">
            latte
            <Image
              src="/images/coffee.png"
              width={114}
              height={114}
              alt="Coffe cup"
              className="absolute bottom-0 left-full h-auto w-8 md:w-20"
            />
          </span>
        </h1>
        <h2 className="py-2 text-lg font-light md:py-8 md:text-4xl">
          Cancel anytime
        </h2>
      </section>
      <section className="mt-10 flex justify-center md:mt-5">
        <div className="relative w-fit">
          <div className="border-logo relative flex flex-col items-center space-y-12 rounded-lg border p-12 shadow-xl">
            <div className="flex items-center justify-center">
              <h3 className="text-2xl font-medium md:text-5xl">$4</h3>
              <h3 className="ml-2 font-light">per month</h3>
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              className="bg-logo w-fit rounded-lg p-2 text-white shadow-xl md:p-4 md:text-3xl"
            >
              <Link href="/sign-up">Sign up today</Link>
            </motion.div>
          </div>
          <div className="absolute -right-10 -top-5 rotate-6 transform rounded-md bg-orange-400 p-2 font-medium uppercase text-white md:p-4">
            One Simple Price
          </div>
        </div>
      </section>
      <section className="mt-4 flex flex-col items-center gap-8  bg-orange-100 py-8 md:mt-16 md:flex-row md:items-start md:justify-center  md:py-16">
        <div className="flex w-3/4 md:w-1/2 md:justify-center">
          <div className="space-y-2 md:space-y-4">
            <h3 className={`font-medium md:text-4xl`}>Why a subscription?</h3>
            <p className="text-sm font-light md:text-2xl lg:w-96">
              I&apos;m just one developer 😎. I wanted a model that&apos;s
              sustainable, covers costs, and provides validation for the app 💖.
            </p>
          </div>
        </div>
        <div className="flex w-3/4 md:w-1/2 md:justify-center">
          <div className="space-y-2 md:space-y-4">
            <h3 className={`font-medium md:text-4xl`}>Why this Price?</h3>
            <p className="text-sm font-light md:text-2xl lg:w-96">
              Whether you&apos;re a student, stay-at-home parent, or a
              hustle-and-bustle laborer -- I want everyone to be able to afford
              this app if they want to use it.
            </p>
          </div>
        </div>
      </section>
    </motion.article>
  );
};

Pricing.getLayout = (page) => <CommercialLayout>{page}</CommercialLayout>;

export default Pricing;
