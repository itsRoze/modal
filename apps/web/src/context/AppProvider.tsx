import { createContext, useState } from "react";

interface IAppContext {
  addingNewTodo: boolean;
  setAddingNewTodo: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<IAppContext | undefined>(undefined);

export default AppContext;

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [addingNewTodo, setAddingNewTodo] = useState(false);

  return (
    <AppContext.Provider value={{ addingNewTodo, setAddingNewTodo }}>
      {children}
    </AppContext.Provider>
  );
};
