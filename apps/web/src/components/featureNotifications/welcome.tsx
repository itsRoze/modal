import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import ModalPopup from "./modalpopup";

type SeenSlide = { [key: number]: boolean };

const WelcomeGuide = () => {
  const [seenSlide, setSeenSlide] = useState<SeenSlide>({
    1: false,
    2: false,
  });
  const slides = [
    <Slide1 key={1} seenSlide={seenSlide} setSeenSlide={setSeenSlide} />,
    <Slide2 key={2} seenSlide={seenSlide} setSeenSlide={setSeenSlide} />,
  ];

  return <ModalPopup slides={slides} />;
};

export default WelcomeGuide;

interface ISlide {
  seenSlide: SeenSlide;
  setSeenSlide: React.Dispatch<React.SetStateAction<SeenSlide>>;
}

const Slide1: React.FC<ISlide> = ({ setSeenSlide, seenSlide }) => {
  useEffect(() => {
    setSeenSlide((prev) => ({ ...prev, 1: true }));
    console.log("seen");
  }, [setSeenSlide]);

  const variants = {
    hidden: { opacity: 0, y: 100, x: 0 },
    enter: { opacity: 1, y: 0, x: 0 },
    exit: { opacity: 0, y: -30, x: 0 },
  };

  const welcomeVariants = {
    hidden: { opacity: 0 },
    enter: { opacity: 1 },
  };

  return (
    <div className="flex h-full flex-col items-center gap-5 lg:gap-10">
      <motion.h1
        variants={!seenSlide[1] ? variants : undefined} // Pass the variant object into Framer Motion
        initial="hidden" // Set the initial state to variants.hidden
        animate="enter" // Animated state to variants.enter
        exit="exit" // Exit state (used later) to variants.exit
        transition={{ delay: 1.5, duration: 1 }} // Set the transition to linear
        className="text-center text-lg text-gray-500 md:text-2xl"
      >
        Success Starts with Just One Step
      </motion.h1>
      <div className="flex flex-col items-center text-center md:gap-2 lg:mt-20">
        <motion.h2
          variants={!seenSlide[1] ? welcomeVariants : undefined}
          initial="hidden"
          animate="enter"
          transition={{ delay: 2.5, duration: 1 }}
          className="text-2xl md:text-5xl"
        >
          Welcome to Modal
        </motion.h2>
        <motion.p
          variants={!seenSlide[1] ? welcomeVariants : undefined}
          initial="hidden"
          animate="enter"
          transition={{ delay: 3.5, duration: 1 }}
          className="text-2xl md:text-5xl"
        >
          We have a few guiding principles to get you started
        </motion.p>
        <motion.p
          variants={!seenSlide[1] ? welcomeVariants : undefined}
          initial="hidden"
          animate="enter"
          transition={{ delay: 3.5, duration: 1 }}
          className="mt-4 md:text-xl"
        >
          Click the arrow to continue
        </motion.p>
      </div>
    </div>
  );
};

const Slide2: React.FC<ISlide> = ({}) => {
  return (
    <div className="flex flex-col gap-5 md:gap-20">
      <h1 className="text-lg text-gray-500 md:text-2xl">
        1. Tasks and Projects
      </h1>
      <h2 className="text-2xl md:text-5xl">
        Large tasks can be broken into smaller tasks
      </h2>
      <div className="space-y-3 md:space-y-10 md:text-2xl">
        <p>
          In Modal, you can create any number of tasks. Larger tasks may be
          better suited as <b>Projects</b>
        </p>
        <p>
          You can create a new Project from the{" "}
          <Image
            src={"/images/add-list.svg"}
            width={60}
            height={59}
            alt="Plus Button"
            className="inline-block h-auto w-5 pb-1 md:w-7"
          />{" "}
          button in the sidebar menu.
        </p>
        <p>
          Within a Project, you can create <b>tasks</b> with the{" "}
          <div aria-label="Add new task" className="-pt-5 inline-block pr-2">
            <Plus
              aria-hidden
              className="h-auto w-4 rounded-md bg-gray-200 md:w-5"
            />
          </div>
          button at the bottom of the screen or with the hotkey{" "}
          <span className="rounded-sm border border-slate-300 p-0.5 text-sm text-gray-500">
            Ctrl
          </span>{" "}
          <span className="rounded-sm border border-slate-300 p-0.5 text-sm text-gray-500">
            N
          </span>
        </p>
      </div>
    </div>
  );
};
