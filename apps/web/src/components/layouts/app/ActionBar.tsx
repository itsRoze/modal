import useAppContext from "@/hooks/useAppContext";
import { Edit, Plus, Trash } from "lucide-react";

const ActionBar = () => {
  const { setAddingNewTodo } = useAppContext();

  const handleCreateClick = () => {
    setAddingNewTodo(true);
  };

  const handleEditClick = () => {
    console.log("edit");
  };

  const handleDeleteClick = () => {
    console.log("delete");
  };

  return (
    <div className="absolute bottom-0 left-1/2 w-full pb-4">
      <div className="z-20 w-fit translate-y-0 rounded-lg border border-slate-100 shadow-lg hover:-translate-y-1 hover:border-[3px] hover:shadow-none">
        <div className="flex w-full items-center justify-between p-1">
          {/* Add */}
          <button
            onClick={handleCreateClick}
            className="rounded-lg p-1 hover:bg-slate-100"
          >
            <Plus size={24} />
          </button>
          {/* Edit */}
          <button
            onClick={handleEditClick}
            className="rounded-lg p-1 hover:bg-slate-100"
          >
            <Edit size={24} />
          </button>
          {/* Trash */}
          <button
            onClick={handleDeleteClick}
            className="rounded-lg p-1 hover:bg-slate-100"
          >
            <Trash size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
