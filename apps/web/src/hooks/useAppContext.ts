import { useContext } from "react";
import AppContext from "@/context/AppProvider";

const useAppContext = () => {
  const context = useContext(AppContext);

  if (context === undefined) {
    throw new Error("useAppContext must be within AppProvider");
  }

  return context;
};

export default useAppContext;
