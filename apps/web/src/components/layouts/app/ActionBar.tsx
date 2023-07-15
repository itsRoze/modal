import { useToast } from "@/components/ui/use-toast";
import useAppContext from "@/hooks/useAppContext";
import { api } from "@/utils/api";
import { classNames } from "@modal/common";
import { Plus, Trash } from "lucide-react";

const ActionBar = () => {
  const { toast } = useToast();
  const ctx = api.useContext();

  const { setAddingNewTodo, selectedTodo } = useAppContext();
  const { mutate, isLoading } = api.task.remove.useMutation({
    onSuccess() {
      void ctx.invalidate();
    },
    onError(error) {
      toast({
        variant: "destructive",
        title: "Uh oh!",
        description: error.message ?? "Something went wrong",
      });
    },
  });

  const handleCreateClick = () => {
    setAddingNewTodo(true);
  };

  const handleDeleteClick = () => {
    if (selectedTodo) {
      mutate(selectedTodo.id);
    }
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
          {/* Trash */}
          <button
            disabled={!selectedTodo}
            onClick={handleDeleteClick}
            className={classNames(
              "rounded-lg p-1",
              selectedTodo
                ? "hover:bg-slate-100"
                : "cursor-not-allowed opacity-50",
            )}
          >
            <Trash size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
