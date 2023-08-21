import CommercialLayout from "@/components/layouts/commerical/CommercialLayout";
import MailTo from "@/components/mailto";
import { anybody } from "@/utils/fonts";
import { motion } from "framer-motion";

import { type NextPageWithLayout } from "./_app";

const Contact: NextPageWithLayout = () => {
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
          Need an ear 🦻?
        </h1>
      </section>
      <section className="flex items-center justify-center py-4 md:py-10">
        <div>
          <span>Got an issue, question, or feedback? You can </span>
          <MailTo email="contact@codestache.com" subject="Modal App - Feedback">
            <span className="text-blue-400 hover:underline">
              send me an email
            </span>
          </MailTo>
          <span> and I&apos;ll get back to you as soon as I can!</span>
        </div>
      </section>
    </motion.article>
  );
};

Contact.getLayout = (page) => {
  return <CommercialLayout>{page}</CommercialLayout>;
};

export default Contact;
