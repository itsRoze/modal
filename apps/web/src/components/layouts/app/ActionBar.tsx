import { useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import useAppContext from "@/hooks/useAppContext";
import { api } from "@/utils/api";
import { classNames } from "@modal/common";
import { Plus, Trash } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";

const ActionBar: React.FC = () => {
  const { toast } = useToast();
  const ctx = api.useContext();

  const { setAddingNewTodo, selectedTodo } = useAppContext();
  const { mutate } = api.task.remove.useMutation({
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

  const actionbarVisbileRef = useRef<HTMLDivElement>(null);

  const handleCreateClick = () => {
    setAddingNewTodo(true);
  };

  useHotkeys("ctrl+n", handleCreateClick);

  const handleDeleteClick = () => {
    if (selectedTodo) {
      mutate(selectedTodo.id);
    }
  };

  return (
    <div
      id="actionbar"
      className="flex w-full items-center justify-center pb-4"
    >
      <div className="z-20 w-fit translate-y-0 rounded-lg border border-slate-100 shadow-lg">
        <div
          className="flex w-full items-center justify-between p-1"
          ref={actionbarVisbileRef}
        >
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger aria-label="Add new task">
                {/* Add */}
                <button
                  aria-label="Add new task"
                  onClick={handleCreateClick}
                  className="rounded-lg p-1 hover:bg-slate-100"
                >
                  <Plus aria-hidden size={24} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create task (ctrl+n)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Trash */}
          <button
            aria-label="Delete task"
            aria-disabled={!selectedTodo}
            disabled={!selectedTodo}
            onClick={handleDeleteClick}
            className={classNames(
              "rounded-lg p-1",
              selectedTodo
                ? "hover:bg-slate-100"
                : "cursor-not-allowed opacity-50",
            )}
          >
            <Trash aria-hidden size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
