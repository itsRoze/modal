import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import useAppContext from "@/hooks/useAppContext";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { type RouterOutputs } from "@modal/api";
import {
  classNames,
  dateToMySqlFormat,
  getDeadlineDateName,
  isOverdue,
  mySqlFormatToDate,
} from "@modal/common";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { addDays, format } from "date-fns";
import dayjs from "dayjs";
import { CalendarIcon, CheckIcon, StarIcon, X } from "lucide-react";
import { useForm } from "react-hook-form";

import ProjectIcon from "./icons/project";
import { SpaceIcon } from "./icons/space";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
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
  }, [selectable, isSelected]);

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
      {isSelected ? (
        <ModifiableTodo
          task={task}
          handleOnSelect={handleOnSelect}
          selectable={selectable}
          closeTodo={closeTodo}
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
}

const CheckableTodo: React.FC<ICheckableTodo> = ({
  task,
  handleOnSelect,
  checked,
  handleOnCheck,
  setCheckHovering,
  setHovering,
  selectable,
  displayPriority,
}) => {
  const { id, name, priority } = task;

  return (
    <div
      onClick={handleOnSelect}
      className={cn({
        "flex w-full items-center": true,
      })}
      onMouseOut={() => setHovering(false)}
      onMouseOver={() => setHovering(true)}
    >
      {/* Checkbox */}
      <Checkbox
        id={id}
        checked={checked}
        handleOnCheck={handleOnCheck}
        setCheckHovering={setCheckHovering}
      />
      <div
        className={cn({
          "my-1 flex flex-1 select-none items-center truncate rounded-md": true,
          "cursor-pointer": selectable,
          "cursor-default": !selectable,
          "line-through": checked,
        })}
      >
        {/* Priority */}
        {displayPriority && priority ? <Priority checked={checked} /> : null}
        {/* Deadline */}
        <DeadlineDisplay task={task} />
        {/* Name */}
        <Name checked={checked} selectable={selectable} name={name} />
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
    <fieldset
      className="z-0"
      onMouseOut={(e) => e.stopPropagation()}
      onMouseOver={(e) => e.stopPropagation()}
    >
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

const DeadlineDisplay: React.FC<ITask> = ({ task }) => {
  const { deadline } = task;
  const userFriendlyDeadline = getDeadlineDateName(deadline);
  const isDeadlineOverdue = isOverdue(deadline);

  return (
    <div
      className={cn({
        "mx-1 flex items-center self-center rounded px-1": true,
        "bg-red-500 text-white": isDeadlineOverdue,
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

interface IModifiableTodo extends ITask {
  handleOnSelect: () => void;
  selectable: boolean;
  closeTodo: () => void;
}

const ModifiableTodo: React.FC<IModifiableTodo> = ({
  task,
  handleOnSelect,
  selectable,
  closeTodo,
}) => {
  return (
    <div className="flex items-start">
      <div
        onClick={handleOnSelect}
        className={cn({
          "flex-grow": true,
          "cursor-pointer": selectable,
          "cursor-default": !selectable,
        })}
      >
        <NameForm task={task} closeTodo={closeTodo} />
        <div className="my-0 flex items-center gap-2">
          <DatePicker task={task} />
          <PriorityDropdown task={task} />
          <ListDisplay task={task} />
        </div>
      </div>
      <button onClick={closeTodo} className="p-1 rounded-md opacity-50 hover:opacity-100">
        <X />
      </button>
    </div>
  );
};

interface INameForm extends ITask {
  closeTodo: () => void;
}
const NameForm: React.FC<INameForm> = ({ task, closeTodo }) => {
  const { toast } = useToast();
  const ctx = api.useContext();
  const { mutate } = api.task.update.useMutation({
    onSuccess() {
      void ctx.invalidate();
    },
    onError(error) {
      toast({
        title: "Uh oh!",
        description: error.message ?? "Something went wrong",
        variant: "destructive",
      });
    },
  });

  type FormValues = {
    name: string;
  };

  const form = useForm<FormValues>({
    values: {
      name: task.name,
    },
  });

  const nameValue = form.watch("name");

  useEffect(() => {
    form.setFocus("name");
  }, [form]);

  const onSubmit = (values: FormValues) => {
    const { name } = values;
    if (!name || !name.trim() || name.trim() === task.name) {
      form.reset();
      return;
    }

    mutate({ id: task.id, name: name.trim() });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      onSubmit({ name: nameValue });
      closeTodo();
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onBlur={form.handleSubmit(onSubmit)}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="w-full"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="New Task"
                  {...field}
                  className="w-full border-none focus:font-semibold  focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

const DatePicker: React.FC<ITask> = ({ task }) => {
  const [date, setDate] = useState<Date | null>(
    task.deadline ? mySqlFormatToDate(task.deadline) : null,
  );

  const ctx = api.useContext();
  const { toast } = useToast();
  const { mutate } = api.task.update.useMutation({
    onSuccess() {
      void ctx.invalidate();
    },
    onError(error) {
      toast({
        title: "Uh oh!",
        variant: "destructive",
        description: error.message ?? "Something went wrong",
      });
    },
  });

  const onSelectChange = (value: string) => {
    const selectedDate = addDays(new Date(), parseInt(value));
    mutate({ id: task.id, deadline: dateToMySqlFormat(selectedDate) });
  };

  const onCalendarChange = (day: Date | undefined) => {
    setDate(day ?? null);
    mutate({ id: task.id, deadline: day ? dateToMySqlFormat(day) : null });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          onClick={(e) => e.stopPropagation()}
          variant={"outline"}
          className={cn(
            "w-fit justify-start border-none text-left text-sm font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Deadline</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="right"
        className="flex w-auto flex-col space-y-2 p-2 text-sm"
      >
        <Select onValueChange={onSelectChange}>
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
          <Calendar
            mode="single"
            selected={date ?? undefined}
            onSelect={onCalendarChange}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

enum PriorityValues {
  Important = "Important",
  Unimportant = "Not important",
}

const PriorityDropdown: React.FC<ITask> = ({ task }) => {
  const ctx = api.useContext();
  const { toast } = useToast();
  const { mutate } = api.task.update.useMutation({
    onSuccess() {
      void ctx.invalidate();
    },
    onError(error) {
      toast({
        title: "Uh oh!",
        variant: "destructive",
        description: error.message ?? "Something went wrong",
      });
    },
  });

  const onSubmit = (value: string) => {
    mutate({
      id: task.id,
      priority: value === PriorityValues.Important ? true : false,
    });
  };

  return (
    <Select
      onValueChange={onSubmit}
      defaultValue={
        task.priority ? PriorityValues.Important : PriorityValues.Unimportant
      }
    >
      <SelectTrigger className="m-0 h-fit w-fit border-none p-0 hover:ring-2 hover:ring-slate-300 ">
        <SelectValue placeholder="Priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={PriorityValues.Important}>
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
        <SelectItem value={PriorityValues.Unimportant}>
          <div className="flex items-center gap-1 text-sm">
            <p>Not important</p>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

const ListDisplay: React.FC<ITask> = ({ task }) => {
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
