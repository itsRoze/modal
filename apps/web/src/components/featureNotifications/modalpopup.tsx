import { useState } from "react";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { LoadingPage } from "../loading";
import { Dialog, DialogContent } from "../ui/dialog";

interface IModalPopup {
  slides: React.ReactNode[];
  open: boolean;
  close: () => void;
}

const ModalPopup: React.FC<IModalPopup> = ({ slides, open, close }) => {
  const [currentSlide, setSlide] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const { data: isNewUser, isLoading } = api.user.isNewUser.useQuery();

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

  if (isLoading) return <LoadingPage />;
  if (isNewUser == undefined && !isLoading) return <div>404</div>;

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="custom-scroll relative flex h-3/4 flex-col  shadow-2xl shadow-black sm:max-w-5xl md:px-20 lg:h-1/2"
      >
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
        <div className="absolute bottom-0 right-0 gap-5 px-5">
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
      </DialogContent>
    </Dialog>
  );
};

export default ModalPopup;
