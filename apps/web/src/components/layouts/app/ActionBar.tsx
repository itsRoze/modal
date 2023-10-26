import { useRef, useState } from "react";
import { ProjectMenu } from "@/components/forms/newProject";
import Hotkey from "@/components/hotkey";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import useAppContext from "@/hooks/useAppContext";
import { api } from "@/utils/api";
import { classNames, getTrpcClientErrorMsg } from "@modal/common";
import { ListPlus, Plus, Trash } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";

const ActionBar: React.FC = () => {
  const { toast } = useToast();
  const ctx = api.useContext();

  const { setAddingNewTodo, selectedTodo, listInfo } = useAppContext();
  const [showProject, setShowProject] = useState(false);

  const { mutate } = api.task.remove.useMutation({
    onSuccess() {
      void ctx.invalidate();
    },
    onError(error) {
      const clientErrorMsg = getTrpcClientErrorMsg(error);
      toast({
        variant: "destructive",
        title: "Uh oh!",
        description: clientErrorMsg,
      });
    },
  });

  const actionbarVisbileRef = useRef<HTMLDivElement>(null);

  const handleCreateClick = () => {
    setAddingNewTodo(true);
  };

  useHotkeys("ctrl+n", handleCreateClick);
  useHotkeys("ctrl+shift+n", () => {
    if (listInfo && listInfo.type === "space") setShowProject(true);
  });

  const handleDeleteClick = () => {
    if (selectedTodo) {
      mutate(selectedTodo.id);
    }
  };

  if (!listInfo) return null;

  return (
    <>
      <div
        id="actionbar"
        className="fixed bottom-0 flex w-full items-center justify-center pb-4 md:static md:bottom-auto"
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
                  <div
                    aria-label="Add new task"
                    onClick={handleCreateClick}
                    className="rounded-lg p-1 hover:bg-slate-100"
                  >
                    <Plus aria-hidden size={24} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <Hotkey text="New task" keys={["Ctrl", "N"]} />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Add Project */}
            {listInfo.type === "space" ? (
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger aria-label="Add new project">
                    <div
                      onClick={() => setShowProject(true)}
                      aria-label="Add Project"
                      className="rounded-lg p-1 hover:bg-slate-100"
                    >
                      <ListPlus aria-hidden size={24} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <Hotkey text="New project" keys={["Ctrl", "Shift", "N"]} />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : null}

            {/* Delete Task */}
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
      <ProjectMenu
        open={showProject}
        setOpen={setShowProject}
        defaultSpaceId={listInfo.id}
      />
    </>
  );
};

export default ActionBar;
