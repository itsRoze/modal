import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Divider from "@/components/divider";
import CommercialLayout from "@/components/layouts/commerical/CommercialLayout";
import MailTo from "@/components/mailto";
import Metadata from "@/components/metadata";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { anybody } from "@/utils/fonts";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";

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
            <h1 className="text-4xl md:text-7xl">
              Task management <br /> simplified.
            </h1>
            <Underline />
            <Hero />
            <h1 className="text-4xl md:text-7xl">
              Workflow <br /> streamlined.
            </h1>
            <h2 className="w-40 text-xl font-light md:w-80 md:text-3xl">
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
            <div className="space-y-1 md:space-y-4">
              <h3 className={`text-xl font-medium md:text-4xl`}>
                Priority Focused
              </h3>
              <p className="text-lg font-light md:text-2xl lg:w-96">
                Based on the Eisenhower method of time management
              </p>
            </div>
          </div>
          <div className="flex w-3/4 md:w-1/2 md:justify-center">
            <div className="space-y-1 md:space-y-4">
              <h3 className={`text-xl font-medium md:text-4xl`}>
                Organize with Spaces
              </h3>
              <p className="text-lg font-light md:text-2xl lg:w-96">
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
            className="bg-logo w-fit rounded-lg p-2 text-xl text-white shadow-xl md:p-4 md:text-3xl"
          >
            <Link href="/signup">Sign up today</Link>
          </motion.div>
        </section>
        <FAQ />
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
        className="h-auto lg:w-2/3 2xl:max-w-4xl"
      />
      <div className="absolute bottom-0 flex h-12 w-full items-center justify-center bg-white md:h-36">
        <h3
          className={`${anybody.variable} line-clamp-2 w-2/3 pt-6 text-center font-mono text-xl font-light md:w-3/4 md:text-5xl`}
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
      className="absolute left-0 top-[4.0rem] h-auto w-7/12 md:top-[7.25rem]"
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
      className="absolute left-40 top-[4.5rem] h-auto w-40 md:left-[21rem] md:top-[8.5rem] md:w-fit"
    />
  );
};

const FAQ = () => {
  const qa = [
    {
      question: "Is there a mobile app",
      answer: (
        <p>
          Soon! The current focus is to make the web app an awesome experience
          first before releasing a mobile (and desktop) app
        </p>
      ),
    },
    {
      question: "How much does it cost",
      answer: (
        <p>
          You get a 2 week free trial, then it&apos;s a simple monthly
          subscription which you can cancel at any time. For more info, you can
          check out the{" "}
          <Link href="/pricing" className="text-blue-500 hover:underline">
            pricing page
          </Link>
        </p>
      ),
    },
    {
      question: "What is the Eisenhower method",
      answer: (
        <p>
          The Eisenhower method is a technique to determine what order to do
          your tasks. Important tasks always come first based on their due date.
          Unimportant tasks come after
        </p>
      ),
    },
    {
      question: "Something else",
      answer: (
        <p>
          Got an issue, question, or feedback? You can{" "}
          <MailTo email="contact@codestache.com" subject="Modal App - Feedback">
            <span className="text-blue-500 hover:underline">
              send me an email
            </span>{" "}
            and I&apos;ll get back to you as soon as I can!
          </MailTo>
        </p>
      ),
    },
  ];

  return (
    <section className="mt-8 w-full px-2 py-4 2xl:max-w-7xl">
      <h3
        className={`${anybody.variable} text-center font-mono text-xl font-medium md:pt-6 md:text-5xl`}
      >
        FAQ
      </h3>
      <div className="flex flex-col gap-3 py-4">
        {qa.map((q, i) => (
          <QA key={i} question={q.question} answer={q.answer} />
        ))}
      </div>
    </section>
  );
};

interface IQA {
  question: string;
  answer: React.ReactNode;
}

const QA: React.FC<IQA> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  const Icon = open ? ChevronDown : ChevronRight;

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center">
        <Icon size={18} className="mr-2 text-gray-500" />
        <h3 className={`${anybody.variable} font-mono text-lg md:text-2xl`}>
          {question}?
        </h3>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6 pt-4 text-base">
        {answer}
      </CollapsibleContent>
      <Divider borderColor="border-gray-500" />
    </Collapsible>
  );
};

Home.getLayout = (page) => {
  return <CommercialLayout>{page}</CommercialLayout>;
};

export default Home;
