import Image from "next/image";
import CommercialLayout from "@/components/layouts/commerical/CommercialLayout";
import { anybody } from "@/utils/fonts";
import { motion } from "framer-motion";

import { type NextPageWithLayout } from "./_app";

const About: NextPageWithLayout = () => {
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
      <section className="flex flex-col items-center justify-center ">
        <h1 className="text-2xl font-semibold text-gray-700 md:text-4xl">
          Hello 👋🏼
        </h1>
        <h1 className="text-2xl font-semibold text-gray-700 md:text-4xl">
          My name is Roze{" "}
        </h1>
        <Image
          src="/images/profile.png"
          width={552}
          height={552}
          alt="Artistic photo of the author"
          className="h-60 w-60 md:h-96 md:w-96"
        />
      </section>
      <section className="flex items-center justify-center py-4 md:py-10">
        <h3 className="px-10 text-center text-lg font-medium md:px-0 md:text-3xl">
          I am the{" "}
          <span className="border-b-4 border-b-green-300">founder</span>,{" "}
          <span className="border-b-4 border-b-blue-300">engineer</span>, and{" "}
          <span className="border-b-4 border-b-red-300 ">designer</span> of{" "}
          <span className=" text-blue-700">Modal</span>
        </h3>
      </section>
      <section className="flex flex-col items-center justify-center py-2">
        <p className="mb-6 font-light md:text-2xl  xl:w-1/2">
          I created Modal because I&apos;m a productivity nerd 🤓 and have tried
          countless task management systems! I have a number of hobbies,
          projects, and errands -- how can I account for all of this? I never
          found both an affordable and digital solution, so I decided to make
          one 🚀.{" "}
        </p>
      </section>
    </motion.article>
  );
};

About.getLayout = (page) => {
  return <CommercialLayout>{page}</CommercialLayout>;
};

export default About;
