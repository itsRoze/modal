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

import ProjectIcon from "./icons/project";
import { SpaceIcon } from "./icons/space";
import { buttonVariants } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "./ui/use-toast";
import { inter } from "@/utils/fonts";

type TaskType = RouterOutputs["task"]["getAllForUser"][number];

interface ITodo {
  task: TaskType;
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
      className={classNames(
        "mb-2 rounded-lg",
        isSelected && !checkHovering
          ? "bg-slate-100 shadow-sm shadow-slate-300"
          : "",
        !isSelected && hovering && selectable ? "bg-slate-50" : "",
      )}
    >
      <div onClick={handleOnSelect} className="flex w-full items-center">
        {/* Checkbox */}
        <Checkbox
          id={id}
          checked={checked}
          handleOnCheck={handleOnCheck}
          setCheckHovering={setCheckHovering}
        />
        {/* Priority */}
        <div
          onMouseOut={() => setHovering(false)}
          onMouseOver={() => setHovering(true)}
          className={classNames(
            "my-1 flex flex-1 items-center truncate rounded-md",
            selectable ? "cursor-pointer" : "cursor-default",
            checked ? "line-through" : "",
          )}
        >
          {displayPriority && priority ? <Priority checked={checked} /> : null}
          {/* Name */}
          <Name checked={checked} selectable={selectable} name={name} />
        </div>
      </div>
      <div className="my-0 ml-12">
        <ListDisplay task={task} />
      </div>
    </div>
  );
};

interface ICheckbox {
  id: string;
  checked: boolean;
  handleOnCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setCheckHovering: React.Dispatch<React.SetStateAction<boolean>>;
}
const Checkbox: React.FC<ICheckbox> = ({
  id,
  checked,
  handleOnCheck,
  setCheckHovering,
}) => {
  return (
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
  );
};

interface IPriority {
  checked: boolean;
}

const Priority: React.FC<IPriority> = ({ checked }) => {
  return (
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
  );
};

interface IName {
  checked: boolean;
  selectable: boolean;
  name: string;
}

const Name: React.FC<IName> = ({ checked, selectable, name }) => {
  return (
    <div className="w-full truncate pl-1 text-left">
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
  );
};

interface IListDisplay {
  task: TaskType;
}

const ListDisplay: React.FC<IListDisplay> = ({ task }) => {
  const { data: lists } = api.user.getLists.useQuery();
  if (!lists) return null;

  const { listType, listId } = task;

  if (listType === "space") return <SpaceDisplay task={task} lists={lists} />;
  return <ProjectDisplay task={task} />;
};

interface ISpaceDisplay extends IListDisplay {
  lists: RouterOutputs["user"]["getLists"];
}

const SpaceDisplay: React.FC<ISpaceDisplay> = ({ task, lists }) => {
  const { data } = api.space.getSpaceInfo.useQuery(task.listId);
  if (!data) return null;

  return (
    <Select defaultValue={`space-${data.id}`}>
      <SelectTrigger className="m-0 h-fit w-fit border-none p-0 hover:ring-2 hover:ring-slate-300 ">
        <SelectValue placeholder={data.name} className="text-sm" />
      </SelectTrigger>
      <SelectContent className={`${inter.variable} font-sans`}>
        {lists.map((list) => (
          <SelectItem
            key={`${list.type}-${list.id}`}
            value={`${list.type}-${list.id}`}
          >
            <div className="flex items-center gap-1">
              {list.type === "project" ? (
                <ProjectIcon size={18} />
              ) : (
                <SpaceIcon size={18} />
              )}
              {list.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const ProjectDisplay: React.FC<IListDisplay> = ({ task }) => {
  const { data } = api.project.getProjectInfo.useQuery(task.listId);
  if (!data) return null;

  return <button>{data.name}</button>;
};

export default Todo;
