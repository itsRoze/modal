import { useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import useAppContext from "@/hooks/useAppContext";
import { api } from "@/utils/api";
import { classNames } from "@modal/common";
import { Plus, Trash } from "lucide-react";

interface IActionBar {
  parentRef: React.RefObject<HTMLDivElement>;
  childRef: React.RefObject<HTMLDivElement>;
}

const ActionBar: React.FC<IActionBar> = ({ parentRef, childRef }) => {
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

  const actionbarVisbileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parentElement = parentRef.current;
    const childElement = childRef.current;
    const actionbarEl = actionbarVisbileRef.current;

    const centerChild = () => {
      if (!parentElement || !childElement || !actionbarEl) return;

      const parentWidth = parentElement.clientWidth;
      const actionbarWidth = actionbarEl.clientWidth;

      // window width - page width
      const sidebarwidth = window.innerWidth - parentWidth;

      // set the child element to the right of the sidebar
      childElement.style.left = `${sidebarwidth - actionbarWidth}px`;
    };

    // Initial centering when the component mounts
    centerChild();

    // Recenter the child div when the parent's size changes (e.g., window resize)
    const handleResize = () => {
      centerChild();
    };

    parentElement?.addEventListener("resize", handleResize);
    return () => parentElement?.removeEventListener("resize", handleResize);
  }, [parentRef, childRef]);

  const handleCreateClick = () => {
    setAddingNewTodo(true);
  };

  const handleDeleteClick = () => {
    if (selectedTodo) {
      mutate(selectedTodo.id);
    }
  };

  return (
    <div
      id="actionbar"
      className="fixed bottom-0 left-0 flex w-full items-center justify-center pb-4"
      ref={childRef}
    >
      <div className="z-20 w-fit translate-y-0 rounded-lg border border-slate-100 shadow-lg hover:-translate-y-1 hover:border-[3px] hover:shadow-none">
        <div
          className="flex w-full items-center justify-between p-1"
          ref={actionbarVisbileRef}
        >
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
