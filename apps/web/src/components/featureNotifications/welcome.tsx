import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpenCheck, CloudMoon, Home, Plus, X } from "lucide-react";

import { Button } from "../ui/button";
import ModalPopup from "./modalpopup";

type SeenSlide = { [key: number]: boolean };

interface IWelcomeGuide {
  open: boolean;
  close: () => void;
}
const WelcomeGuide: React.FC<IWelcomeGuide> = ({ open, close }) => {
  const [seenSlide, setSeenSlide] = useState<SeenSlide>({
    1: false,
    2: false,
  });

  const slides = [
    <Slide1 key={1} seenSlide={seenSlide} setSeenSlide={setSeenSlide} />,
    <Slide2 key={2} seenSlide={seenSlide} setSeenSlide={setSeenSlide} />,
    <Slide3 key={3} seenSlide={seenSlide} setSeenSlide={setSeenSlide} />,
    <Slide4 key={4} seenSlide={seenSlide} setSeenSlide={setSeenSlide} />,
    <Slide5 key={5} seenSlide={seenSlide} setSeenSlide={setSeenSlide} />,
    <Slide6
      key={6}
      seenSlide={seenSlide}
      setSeenSlide={setSeenSlide}
      close={close}
    />,
  ];

  return <ModalPopup slides={slides} open={open} close={close} />;
};

export default WelcomeGuide;

interface ISlide {
  seenSlide: SeenSlide;
  setSeenSlide: React.Dispatch<React.SetStateAction<SeenSlide>>;
}

const Slide1: React.FC<ISlide> = ({ setSeenSlide, seenSlide }) => {
  useEffect(() => {
    setSeenSlide((prev) => ({ ...prev, 1: true }));
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
        transition={{ delay: 0.3, duration: 1 }} // Set the transition to linear
        className="text-center text-lg text-gray-500 md:text-2xl"
      >
        Success Starts with Just One Step
      </motion.h1>
      <div className="flex flex-col items-center text-center md:gap-2 lg:mt-20">
        <motion.h2
          variants={!seenSlide[1] ? welcomeVariants : undefined}
          initial="hidden"
          animate="enter"
          transition={{ delay: 1.5, duration: 1 }}
          className="text-2xl md:text-5xl"
        >
          Welcome to Modal
        </motion.h2>
        <motion.p
          variants={!seenSlide[1] ? welcomeVariants : undefined}
          initial="hidden"
          animate="enter"
          transition={{ delay: 2.5, duration: 1 }}
          className="text-2xl md:text-5xl"
        >
          We have a few guiding principles to get you started
        </motion.p>
        <motion.p
          variants={!seenSlide[1] ? welcomeVariants : undefined}
          initial="hidden"
          animate="enter"
          transition={{ delay: 2.5, duration: 1 }}
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
          Create projects with the{" "}
          <Image
            src={"/images/add-list.svg"}
            width={60}
            height={59}
            alt="Plus Button"
            className="inline-block h-auto w-5 pb-1 md:w-7"
          />{" "}
          button.
        </p>
        <div>
          Create <b>tasks</b> in a Project (or Space which we&apos;ll talk about
          next) with the{" "}
          <div aria-label="Add new task" className="-pt-5 inline-block pr-2">
            <Plus
              aria-hidden
              className="h-auto w-4 rounded-md bg-gray-200 md:w-5"
            />
          </div>
          button or with the hotkey{" "}
          <span className="rounded-sm border border-slate-300 p-0.5 text-sm text-gray-500">
            Ctrl
          </span>{" "}
          <span className="rounded-sm border border-slate-300 p-0.5 text-sm text-gray-500">
            N
          </span>
        </div>
      </div>
    </div>
  );
};

const Slide3: React.FC<ISlide> = () => {
  return (
    <div className="flex flex-col gap-5 md:gap-20">
      <h1 className="text-lg text-gray-500 md:text-2xl">2. Spaces</h1>
      <h2 className="text-2xl md:text-5xl">Organize your responsibilities</h2>
      <div className="space-y-3 md:space-y-10 md:text-2xl">
        <p>
          Often, we have projects and tasks that span many different areas in
          our life. You may have work projects, personal errands, appointments,
          and so forth. You can place projects and tasks within <b>Spaces</b>.
        </p>
        <p>
          Create spaces with the{" "}
          <Image
            src={"/images/add-list.svg"}
            width={60}
            height={59}
            alt="Plus Button"
            className="inline-block h-auto w-5 pb-1 md:w-7"
          />{" "}
          button (just like projects).
        </p>
      </div>
    </div>
  );
};

const Slide4: React.FC<ISlide> = () => {
  return (
    <div className="flex flex-col gap-5 md:gap-20">
      <h1 className="text-lg text-gray-500 md:text-2xl">3. Dates</h1>
      <h2 className="text-2xl md:text-5xl">
        Tasks without a deadline will be done <em>Someday</em>
      </h2>
      <div className="space-y-3 md:space-y-10 md:text-2xl">
        <p>
          By default, tasks are created without <b>deadlines</b>.{" "}
        </p>
        <p>
          You can view these tasks in the{" "}
          <span className="inline-block">
            <CloudMoon className="inline-block pb-1 text-indigo-300" />{" "}
            <b>Someday</b>
          </span>{" "}
          page
        </p>
        <p>
          Tasks that have been completed can be viewed in{" "}
          <span className="inline-block">
            <BookOpenCheck className="inline-block pb-1 text-green-600" />{" "}
            <b>History</b>
          </span>
        </p>
        <p>
          Any incomplete task with a deadline will appear in your{" "}
          <span className="inline-block">
            <Home className="inline-block pb-1 text-fuchsia-500" />{" "}
            <b>Dashboard</b>
          </span>
        </p>
      </div>
    </div>
  );
};

const Slide5: React.FC<ISlide> = () => {
  return (
    <div className="flex flex-col gap-5 md:gap-20">
      <h1 className="text-lg text-gray-500 md:text-2xl">4. Priority</h1>
      <h2 className="text-2xl md:text-5xl">Modal is opinionated</h2>
      <div className="space-y-3 md:space-y-10 md:text-2xl">
        <p>
          In the{" "}
          <span className="inline-block">
            <Home className="inline-block pb-1 text-fuchsia-500" />{" "}
            <b>Dashboard</b>
          </span>
          , you should perform tasks in the following order:
        </p>
        <ol className="list-inside list-decimal">
          <li>Important and Due Soon</li>
          <li>Important and Due Later</li>
          <li>Not Important and Due Soon</li>
          <li>Not Important and Due Later</li>
        </ol>
        <p>
          You can set tasks as Important. Remember, tasks must have a deadline
          in order to appear in the{" "}
          <span className="inline-block">
            <Home className="inline-block pb-1 text-fuchsia-500" />{" "}
            <b>Dashboard</b>.
          </span>
        </p>
      </div>
    </div>
  );
};

interface IFinalSlide extends ISlide {
  close: () => void;
}
const Slide6: React.FC<IFinalSlide> = ({ close }) => {
  const complete = () => {
    close();
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 md:gap-20">
      <h2 className="text-center text-2xl md:text-5xl">
        Cool! Let&apos;s get started?
      </h2>
      <Button onClick={complete}>
        <X className="mr-2" /> Close
      </Button>
      <p className="text-center">
        You can always see this guide again from the settings
      </p>
    </div>
  );
};
