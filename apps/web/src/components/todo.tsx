import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAppContext from "@/hooks/useAppContext";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { type TaskType } from "@/utils/types";
import {
  classNames,
  dateToMySqlFormat,
  getCompletedDate,
  getDeadlineDateName,
  isOverdue,
} from "@modal/common";
import { useMediaQuery } from "@uidotdev/usehooks";
import { CheckIcon, StarIcon } from "lucide-react";

import { ProjectIcon } from "./icons/project";
import { SpaceIcon } from "./icons/space";
import ModifiableTodo from "./modifiableTodo";
import { useToast } from "./ui/use-toast";

interface ITodo {
  task: TaskType;
  displayPriority?: boolean;
  selectable?: boolean;
  initialChecked?: boolean;
  displayList?: boolean;
  displayDeadline?: boolean;
}

const Todo: React.FC<ITodo> = ({
  task,
  displayPriority = true,
  selectable = true,
  initialChecked = false,
  displayList = false,
  displayDeadline = true,
}) => {
  const { pathname } = useRouter();
  const { id, completedTime } = task;

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
    setHovering(false);
  }, [selectedTodo, id]);

  // Clear the interval when the component unmounts
  useEffect(() => {
    const handleEscapeKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeTodo();
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
  }, [selectable]);

  const closeTodo = () => {
    setIsSelected(false);
  };

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
          mutate({ id, completedTime: dateToMySqlFormat(new Date()) });
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
      {isSelected ? (
        <ModifiableTodo
          task={task}
          closeTodo={closeTodo}
          handleOnSelect={handleOnSelect}
        />
      ) : completedTime ? (
        <CompletedTodo
          task={task}
          handleOnSelect={handleOnSelect}
          checked={checked}
          handleOnCheck={handleOnCheck}
          setCheckHovering={setCheckHovering}
          setHovering={setHovering}
          selectable={selectable}
          displayPriority={displayPriority}
          displayList={displayList}
          displayDeadline={displayDeadline}
        />
      ) : (
        <CheckableTodo
          task={task}
          handleOnSelect={handleOnSelect}
          checked={checked}
          handleOnCheck={handleOnCheck}
          setCheckHovering={setCheckHovering}
          setHovering={setHovering}
          selectable={selectable}
          displayPriority={displayPriority}
          displayList={displayList}
          displayDeadline={displayDeadline}
        />
      )}
    </div>
  );
};

interface ITask {
  task: TaskType;
}

interface ICheckableTodo extends ITask {
  handleOnSelect: () => void;
  checked: boolean;
  handleOnCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setCheckHovering: React.Dispatch<React.SetStateAction<boolean>>;
  setHovering: React.Dispatch<React.SetStateAction<boolean>>;
  selectable: boolean;
  displayPriority: boolean;
  displayList: boolean;
  displayDeadline: boolean;
}

const CompletedTodo: React.FC<ICheckableTodo> = ({
  task,
  handleOnSelect,
  checked,
  handleOnCheck,
  setCheckHovering,
  setHovering,
  selectable,
  displayPriority,
}) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const { id, name, priority, listId, listType } = task;
  const { data: listInfo } = api.task.getListInfo.useQuery({
    listId,
    listType,
  });

  return (
    <div
      onClick={handleOnSelect}
      onMouseOut={() => setHovering(false)}
      onMouseOver={() => setHovering(true)}
    >
      <div
        className={cn({
          "flex w-full items-center gap-2": true,
        })}
      >
        {/* Checkbox */}
        <Checkbox
          id={id}
          checked={checked}
          handleOnCheck={handleOnCheck}
          setCheckHovering={setCheckHovering}
          task={task}
        />
        <CompletedTimeDisplay task={task} />
        <div
          className={cn({
            "select-none truncate rounded-md pl-4": true,
            "cursor-pointer": selectable,
            "cursor-default": !selectable,
          })}
        >
          <div className="flex">
            {/* Priority */}
            {displayPriority && priority ? (
              <Priority checked={checked} />
            ) : null}
            {/* Name */}
            <Name checked={checked} selectable={selectable} name={name} />
          </div>
          <div
            className={cn({
              "cursor-pointer": selectable,
              "cursor-default": !selectable,
              "text-sm": true,
            })}
          >
            {listInfo ? (
              <div className="flex items-center gap-1">
                {listType === "project" ? (
                  <ProjectIcon size={isSmallDevice ? 12 : 14} />
                ) : (
                  <SpaceIcon size={isSmallDevice ? 12 : 14} />
                )}
                <span>{listInfo.name}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckableTodo: React.FC<ICheckableTodo> = ({
  task,
  handleOnSelect,
  checked,
  handleOnCheck,
  setCheckHovering,
  setHovering,
  selectable,
  displayPriority,
  displayList,
  displayDeadline,
}) => {
  const { id, name, priority, listId, listType, completedTime } = task;
  const { data: listInfo } = api.task.getListInfo.useQuery({
    listId,
    listType,
  });

  return (
    <div
      onClick={handleOnSelect}
      onMouseOut={() => setHovering(false)}
      onMouseOver={() => setHovering(true)}
    >
      <div
        className={cn({
          "flex w-full items-center": true,
        })}
      >
        {/* Checkbox */}
        <Checkbox
          id={id}
          checked={checked}
          handleOnCheck={handleOnCheck}
          setCheckHovering={setCheckHovering}
          task={task}
        />
        <div
          className={cn({
            "my-1 flex flex-1 select-none items-center gap-1 truncate rounded-md":
              true,
            "cursor-pointer": selectable,
            "cursor-default": !selectable,
          })}
        >
          {/* Completed Date */}
          {completedTime ? <CompletedTimeDisplay task={task} /> : null}
          {/* Priority */}
          {displayPriority && priority ? <Priority checked={checked} /> : null}
          {/* Deadline */}
          {displayDeadline && !completedTime ? (
            <DeadlineDisplay task={task} />
          ) : null}
          {/* Name */}
          <Name checked={checked} selectable={selectable} name={name} />
        </div>
      </div>
      <div
        className={cn({
          "cursor-pointer": selectable,
          "cursor-default": !selectable,
          "pl-12 text-sm": true,
        })}
      >
        {displayList && listInfo ? (
          <div className="flex items-center gap-1 text-sm md:text-base">
            {listType === "project" ? (
              <ProjectIcon size={14} />
            ) : (
              <SpaceIcon size={14} />
            )}
            <span>{listInfo.name}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

interface ICheckbox extends ITask {
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
  task,
}) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const someday = task.deadline === null;

  return (
    <fieldset
      className="z-0 pr-1 md:pr-0"
      onMouseOut={(e) => e.stopPropagation()}
      onMouseOver={(e) => e.stopPropagation()}
    >
      <label
        id={`check-box-label-${id}`}
        htmlFor={`check-box-${id}`}
        className="pointer-events-none relative flex items-center rounded-full p-0 md:p-2 md:hover:bg-slate-100"
      >
        <input
          id={`check-box-${id}`}
          aria-labelledby={`check-box-label-${id}`}
          aria-label="Check box"
          type={"checkbox"}
          checked={checked}
          onChange={handleOnCheck}
          onMouseOut={() => setCheckHovering(false)}
          onMouseOver={() => setCheckHovering(true)}
          className="bg-transparent-100 peer pointer-events-auto z-10 cursor-pointer appearance-none rounded-sm border-2 border-transparent p-2 md:rounded-lg md:p-3"
        />
        <span
          className={cn({
            "absolute left-0 rounded-md border-2 p-2 peer-checked:bg-slate-500 md:left-auto md:rounded-lg md:p-3 ":
              true,
            "border-slate-200": !someday,
            "border-dashed border-gray-300": someday,
            "border-solid": checked,
          })}
        ></span>
        <CheckIcon
          size={isSmallDevice ? 14 : 18}
          strokeWidth={isSmallDevice ? 2 : 3}
          absoluteStrokeWidth
          className="stroke-logo absolute left-[0.2rem] opacity-0 peer-checked:opacity-100 md:left-[0.85rem] md:peer-hover:opacity-60 "
        />
      </label>
    </fieldset>
  );
};

interface IPriority {
  checked: boolean;
}

const Priority: React.FC<IPriority> = ({ checked }) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger aria-label="Important">
          <StarIcon
            aria-hidden
            size={isSmallDevice ? 16 : 18}
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

const CompletedTimeDisplay: React.FC<ITask> = ({ task }) => {
  const { completedTime } = task;
  const completedDateFormat = getCompletedDate(completedTime);
  return (
    <p className="text-sm font-semibold no-underline">{completedDateFormat}</p>
  );
};

const DeadlineDisplay: React.FC<ITask> = ({ task }) => {
  const { deadline } = task;
  if (!deadline) return null;

  const userFriendlyDeadline = getDeadlineDateName(deadline);
  const isDeadlineOverdue = isOverdue(deadline);

  return (
    <div
      className={cn({
        "mx-1 flex items-center self-center rounded px-1": true,
        "bg-red-500 text-white ": isDeadlineOverdue,
        "bg-gray-600 text-white": !isDeadlineOverdue && deadline,
        "border-2 border-dashed border-gray-600 bg-none": !deadline,
      })}
    >
      <span
        className={cn({
          "max-w-[4rem] truncate text-sm font-semibold": true,
        })}
      >
        {userFriendlyDeadline}
      </span>
    </div>
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
          "truncate text-sm md:text-lg",
          checked ? "text-gray-400 line-through" : "",
          selectable ? "cursor-pointer" : "cursor-default",
        )}
      >
        {name}
      </p>
    </div>
  );
};

export default Todo;
