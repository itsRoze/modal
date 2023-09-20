import { useState } from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface IModalPopup {
  slides: React.ReactNode[];
}

const ModalPopup: React.FC<IModalPopup> = ({ slides }) => {
  const [currentSlide, setSlide] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const variants = {
    hidden: { opacity: 0, x: direction === "next" ? 35 : -35, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: direction === "next" ? -35 : 35, y: 0 },
  };

  const goNextSlide = () => {
    if (currentSlide === slides.length - 1) return;
    setSlide((prevSlide) => prevSlide + 1);
    setDirection("next");
  };

  const goBackSlide = () => {
    if (currentSlide === 0) return;
    setSlide((prevSlide) => prevSlide - 1);
    setDirection("prev");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.3, duration: 1.5 }}
        className="absolute left-0 top-0 z-[60] h-full w-full bg-black"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 2 }}
        className="absolute left-0 top-0 z-[70] flex h-full w-screen items-center justify-center overflow-hidden"
      >
        <div className="relative flex h-2/3 w-11/12 flex-col overflow-hidden rounded-2xl border-2 border-gray-700 bg-white p-5 shadow-2xl shadow-black md:px-20 lg:h-1/2 lg:w-2/3">
          <motion.div
            key={currentSlide}
            variants={variants} // Pass the variant object into Framer Motion
            initial="hidden" // Set the initial state to variants.hidden
            animate="enter" // Animated state to variants.enter
            exit="exit" // Exit state (used later) to variants.exit
            transition={{ type: "linear" }} // Set the transition to linear
            className="custom-scroll h-full overflow-y-scroll"
          >
            {slides[currentSlide]}
          </motion.div>
          <div className="absolute bottom-0 right-0 flex flex-shrink items-center gap-5 p-5">
            {currentSlide > 0 ? (
              <button aria-label="Previous" onClick={goBackSlide}>
                <ArrowLeft size={32} />
              </button>
            ) : null}
            <button
              aria-label="goNextSlide"
              onClick={goNextSlide}
              disabled={currentSlide === slides.length - 1}
              className={cn({
                "text-gray-400": currentSlide === slides.length - 1,
              })}
            >
              <ArrowRight size={32} />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ModalPopup;
