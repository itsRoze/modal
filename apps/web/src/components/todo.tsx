import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useAppContext from "@/hooks/useAppContext";
import { api } from "@/utils/api";
import { type RouterOutputs } from "@modal/api";
import { classNames } from "@modal/common";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import dayjs from "dayjs";
import { CheckIcon, StarIcon } from "lucide-react";

import { useToast } from "./ui/use-toast";

interface ITodo {
  task: RouterOutputs["task"]["getAllForUser"][number];
  displayPriority?: boolean;
  selectable?: boolean;
  initialChecked?: boolean;
}

const Todo: React.FC<ITodo> = ({
  task,
  displayPriority = true,
  selectable = true,
  initialChecked = false,
}) => {
  const { pathname } = useRouter();
  const { id, name, priority, completedTime } = task;

  const { selectedTodo, setSelectedTodo } = useAppContext();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [checked, setChecked] = useState(initialChecked);
  const [hovering, setHovering] = useState(false);
  const [checkHovering, setCheckHovering] = useState(false);

  const ctx = api.useContext();
  const { toast } = useToast();
  const { mutate } = api.task.update.useMutation({
    onSuccess() {
      if (!completedTime) {
        toast({
          title: "Task completed!",
          variant: "success",
        });
      }
      void ctx.invalidate();
    },
    onError() {
      toast({
        title: "Uh oh, something went wrong!",
        variant: "destructive",
      });
    },
  });

  // Effect for setting the selected task in the app context
  useEffect(() => {
    // if currently selected, update context
    if (isSelected) {
      setSelectedTodo(task);
    }
    // if unselecting and not selecting another task, update context
    else if (selectedTodo?.id === task.id) {
      setSelectedTodo(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected]);

  // Effect for updating current state isSelected
  useEffect(() => {
    if (selectedTodo) {
      // if selecting another task, unselect this task
      if (selectedTodo.id !== id) {
        setIsSelected(false);
      }
    } else {
      setIsSelected(false);
    }
  }, [selectedTodo, id]);

  // Clear the interval when the component unmounts
  useEffect(() => {
    const handleEscapeKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSelected(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("keydown", handleEscapeKeyPress);

    // Remove event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleEscapeKeyPress);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [selectable, isSelected]);

  const handleOnSelect = () => {
    if (selectable) setIsSelected((current) => !current);
  };
  const handleOnCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelected(false);
    setChecked((value) => !value);

    if (e.target.checked) {
      if (timerRef.current) clearTimeout(timerRef.current);

      if (!completedTime) {
        timerRef.current = setTimeout(() => {
          mutate({ id, completedTime: dayjs().toDate() });
        }, 1000);
      }
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      // if we're in the history page, allow unchecking to cause mutate
      if (pathname.includes("history")) {
        timerRef.current = setTimeout(() => {
          mutate({ id, completedTime: null });
        }, 1000);
      }
    }
  };

  return (
    <div
      onClick={handleOnSelect}
      className={classNames(
        "mb-2 flex w-full items-center rounded-lg",
        isSelected && !checkHovering
          ? "bg-slate-100 shadow-sm shadow-slate-300"
          : "",
        !isSelected && hovering && selectable ? "bg-slate-50" : "",
      )}
    >
      {/* Checkbox */}
      <fieldset className="z-0">
        <label
          htmlFor={`check-box-${id}`}
          className="pointer-events-none relative flex items-center rounded-full p-2 hover:bg-slate-100"
        >
          <input
            id={`check-box-${id}`}
            type={"checkbox"}
            checked={checked}
            onChange={handleOnCheck}
            onMouseOut={() => setCheckHovering(false)}
            onMouseOver={() => setCheckHovering(true)}
            className="bg-transparent-100 peer pointer-events-auto z-10 cursor-pointer appearance-none rounded-lg border-2 border-transparent p-3"
          />
          <span className="absolute rounded-lg border-2 border-slate-200 p-3 peer-checked:bg-slate-500 "></span>
          <CheckIcon
            size={18}
            strokeWidth={3}
            absoluteStrokeWidth
            className="stroke-logo absolute left-[0.85rem] opacity-0 peer-checked:opacity-100 peer-hover:opacity-60 "
          />
        </label>
      </fieldset>
      <div
        onMouseOut={() => setHovering(false)}
        onMouseOver={() => setHovering(true)}
        className={classNames(
          "my-1 flex flex-1 items-center truncate rounded-md",
          selectable ? "cursor-pointer" : "cursor-default",
          checked ? "line-through" : "",
        )}
      >
        {/* Priority */}
        {displayPriority && priority ? (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <StarIcon
                    size={18}
                    data-tip
                    data-for="priority"
                    className={` ${checked ? "text-orange-200" : "text-logo"} `}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Important</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        ) : null}
        <div className="w-full truncate pl-1 text-left">
          {/* Name */}
          <p
            className={classNames(
              "truncate text-lg",
              checked ? "text-gray-400" : "",
              selectable ? "cursor-pointer" : "cursor-default",
            )}
          >
            {name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Todo;
