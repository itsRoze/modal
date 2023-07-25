import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useAppContext from "@/hooks/useAppContext";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { type RouterOutputs } from "@modal/api";
import { classNames } from "@modal/common";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { addDays, format } from "date-fns";
import dayjs from "dayjs";
import { CalendarIcon, CheckIcon, StarIcon } from "lucide-react";

import ProjectIcon from "./icons/project";
import { SpaceIcon } from "./icons/space";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useToast } from "./ui/use-toast";

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
      {isSelected ? (
        <div className="my-0 ml-12 flex items-center gap-2">
          <DatePicker task={task} />
          <PriorityDropdown task={task} />
          <ListDisplay task={task} />
        </div>
      ) : null}
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
            fill={` ${checked ? "rgb(254 215 170)" : "rgb(246 191 95)"} `}
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

interface IDateDisplay {
  task: TaskType;
}

const DatePicker: React.FC<IDateDisplay> = ({ task }) => {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-fit justify-start border-none text-left text-sm font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2 text-sm">
        <Select
          onValueChange={(value) =>
            setDate(addDays(new Date(), parseInt(value)))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface IPriorityDisplay {
  task: TaskType;
}

const PriorityDropdown: React.FC<IPriorityDisplay> = ({ task }) => {
  return (
    <Select defaultValue="Important">
      <SelectTrigger className="m-0 h-fit w-fit border-none p-0 hover:ring-2 hover:ring-slate-300 ">
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"Important"}>
          <div className="flex items-center gap-1 text-sm">
            <StarIcon
              size={14}
              data-tip
              data-for="priority"
              className="text-logo"
              fill="rgb(246 191 95)"
            />
            <p>Important</p>
          </div>
        </SelectItem>
        <SelectItem value={"Not important"}>
          <div className="flex items-center gap-1 text-sm">
            <p>Not important</p>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

interface IListDisplay {
  task: TaskType;
}

const ListDisplay: React.FC<IListDisplay> = ({ task }) => {
  const { setSelectedTodo } = useAppContext();
  const { toast } = useToast();
  const ctx = api.useContext();

  const { data: listInfo } = api.task.getListInfo.useQuery({
    listId: task.listId,
    listType: task.listType,
  });

  const { data: lists } = api.user.getLists.useQuery();

  const { mutate } = api.task.update.useMutation({
    onSuccess() {
      setSelectedTodo(undefined);
      void ctx.invalidate();
    },
    onError() {
      toast({
        title: "Uh oh!",
        description: "Something went wrong",
        variant: "destructive",
      });
    },
  });

  if (!lists) return null;
  if (!listInfo) return null;

  const { listId, listType } = task;

  const onSubmit = (value: string) => {
    const [type, id] = value.split("-");
    if (id && (type === "space" || type === "project")) {
      mutate({ id: task.id, listId: id, listType: type });
    }
  };

  return (
    <Select onValueChange={onSubmit} defaultValue={`${listType}-${listId}`}>
      <SelectTrigger className="m-0 h-fit w-fit border-none p-0 hover:ring-2 hover:ring-slate-300 ">
        <SelectValue placeholder={listInfo.name} className="text-sm" />
      </SelectTrigger>
      <SelectContent>
        {lists.map((list) => (
          <SelectItem
            key={`${list.type}-${list.id}`}
            value={`${list.type}-${list.id}`}
          >
            <div className="flex items-center gap-1">
              {list.type === "project" ? (
                <ProjectIcon size={14} />
              ) : (
                <SpaceIcon size={14} />
              )}
              {list.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Todo;
