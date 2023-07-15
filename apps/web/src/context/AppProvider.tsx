import { createContext, useState } from "react";
import { type Info } from "@modal/db/src/task";

interface IListInfo {
  type: "space" | "project";
  id: string;
}

interface IAppContext {
  addingNewTodo: boolean;
  setAddingNewTodo: React.Dispatch<React.SetStateAction<boolean>>;
  listInfo: IListInfo | undefined;
  setListInfo: React.Dispatch<React.SetStateAction<IListInfo | undefined>>;
  selectedTodo: Info | undefined;
  setSelectedTodo: React.Dispatch<React.SetStateAction<Info | undefined>>;
}

const AppContext = createContext<IAppContext | undefined>(undefined);

export default AppContext;

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [addingNewTodo, setAddingNewTodo] = useState(false);
  const [listInfo, setListInfo] = useState<IListInfo | undefined>(undefined);
  const [selectedTodo, setSelectedTodo] = useState<Info | undefined>(undefined);

  return (
    <AppContext.Provider
      value={{
        addingNewTodo,
        setAddingNewTodo,
        listInfo,
        setListInfo,
        selectedTodo,
        setSelectedTodo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
