import Image from "next/image";
import Link from "next/link";
import CommercialLayout from "@/components/layouts/commerical/CommercialLayout";
import Metadata from "@/components/metadata";
import { anybody } from "@/utils/fonts";
import { motion } from "framer-motion";

import { type NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const variants = {
    hidden: { opacity: 0, x: -200, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: 0, y: -100 },
  };

  return (
    <>
      <Metadata />
      <motion.article
        variants={variants} // Pass the variant object into Framer Motion
        initial="hidden" // Set the initial state to variants.hidden
        animate="enter" // Animated state to variants.enter
        exit="exit" // Exit state (used later) to variants.exit
        transition={{ type: "linear" }} // Set the transition to linear
        className="2xs:items-center bg-blur-screenshot flex flex-col bg-cover bg-fixed bg-no-repeat "
      >
        <section
          className={`${anybody.variable} 2xs:items-center flex w-full flex-col space-y-4 font-mono md:space-y-8 `}
        >
          <div className="relative mb-8 space-y-2 md:mb-28 md:space-y-4">
            <h1 className="text-3xl md:text-7xl">
              Task management <br /> simplified.
            </h1>
            <Underline />
            <Hero />
            <h1 className="text-3xl md:text-7xl">
              Workflow <br /> streamlined.
            </h1>
            <h2 className="w-40 text-base font-light md:w-80 md:text-3xl">
              An app designed around simplicity. Don&apos;t be burdened with
              complex configuration.
            </h2>
          </div>
          <Screenshot />
        </section>
      </motion.article>
      <article className="2xs:items-center flex w-full flex-col justify-center bg-white">
        <section
          className={`${anybody.variable} mt-16 flex w-full flex-col items-center gap-4 font-mono md:flex-row md:items-start md:justify-center md:px-6 md:pb-8 2xl:px-28`}
        >
          <div className="flex w-3/4 md:w-1/2 md:justify-center">
            <div className="space-y-4">
              <h3 className={`font-medium md:text-4xl`}>Priority Focused</h3>
              <p className="text-sm font-light md:text-2xl lg:w-96">
                Based on the Eisenhower method of time management
              </p>
            </div>
          </div>
          <div className="flex w-3/4 md:w-1/2 md:justify-center">
            <div className="space-y-4">
              <h3 className={`font-medium md:text-4xl`}>
                Organize with Spaces
              </h3>
              <p className="text-sm font-light md:text-2xl lg:w-96">
                Use spaces to group different projects and tasks with shared
                responsibilities (e.g. Work, Personal Life, Hobbies, etc)
              </p>
            </div>
          </div>
        </section>
        <section className="mt-4 flex justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.8 }}
            className="bg-logo w-fit rounded-lg p-2 text-white shadow-xl md:p-4 md:text-3xl"
          >
            <Link href="/signup">Sign up today</Link>
          </motion.div>
        </section>
      </article>
    </>
  );
};

const Screenshot = () => {
  return (
    <div className="relative flex w-full items-center justify-center">
      <Image
        priority
        src={"/images/app-screenshot.png"}
        alt="screenshot of app"
        width={1755}
        height={1294}
        className="h-auto lg:w-2/3"
      />
      <div className="absolute bottom-0 flex h-12 w-full items-center justify-center bg-white md:h-36">
        <h3
          className={`{anybody.variable} line-clamp-2 w-2/3 pt-6 text-center font-mono text-lg font-light md:w-3/4 md:text-5xl`}
        >
          Organize all your projects in a single dashboard
        </h3>
      </div>
    </div>
  );
};

const Underline = () => {
  return (
    <Image
      src="/images/underline.svg"
      alt="underline beneath simplified"
      width={610}
      height={22}
      className="absolute left-0 top-[3.5rem] h-auto w-1/2 md:top-[7.25rem] md:w-7/12"
    />
  );
};

const Hero = () => {
  return (
    <Image
      src="/images/hero.svg"
      alt="hero image"
      width={334}
      height={359}
      className="absolute left-36 top-[4rem] h-auto w-40 md:left-[21rem] md:top-[8.5rem] md:w-fit"
    />
  );
};

Home.getLayout = (page) => {
  return <CommercialLayout>{page}</CommercialLayout>;
};

export default Home;
