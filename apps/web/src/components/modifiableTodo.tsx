import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { type TaskType } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RouterOutputs } from "@modal/api";
import { dateToMySqlFormat, mySqlFormatToDate } from "@modal/common";
import { useMediaQuery } from "@uidotdev/usehooks";
import { addDays } from "date-fns";
import dayjs from "dayjs";
import { CalendarIcon, Check, StarIcon, Trash, X } from "lucide-react";
import { useForm, type ControllerRenderProps } from "react-hook-form";
import { z } from "zod";

import { ProjectIcon } from "./icons/project";
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

const NONE_LIST = "None";

enum PriorityValues {
  Important = "Important",
  Unimportant = "Not important",
}
const schema = z.object({
  name: z.string().nonempty(),
  deadline: z.date().nullable(),
  priority: z.enum([PriorityValues.Important, PriorityValues.Unimportant]),
  listInfo: z.string(),
});

type FormValues = z.infer<typeof schema>;

interface IModifiableTodo {
  task: TaskType;
  closeTodo: () => void;
  handleOnSelect: () => void;
}

const ModifiableTodo: React.FC<IModifiableTodo> = ({ task, closeTodo }) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const ref = useRef<HTMLFormElement>(null);
  const [datePickOpen, setDatePickOpen] = useState(false);
  const [priorityPickOpen, setPriorityPickOpen] = useState(false);
  const [listPickOpen, setListPickOpen] = useState(false);
  const { toast } = useToast();
  const ctx = api.useContext();

  const { data: listInfo } = api.task.getListInfo.useQuery({
    listId: task.listId,
    listType: task.listType,
  });

  const { data: lists } = api.user.getLists.useQuery();

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

  const { mutate: deleteTask } = api.task.remove.useMutation({
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

  const form = useForm<FormValues>({
    values: {
      name: task.name,
      deadline: task.deadline ? mySqlFormatToDate(task.deadline) : null,
      priority: task.priority
        ? PriorityValues.Important
        : PriorityValues.Unimportant,
      listInfo: task.listType ? `${task.listType}-${task.listId}` : NONE_LIST,
    },
    resolver: zodResolver(schema),
  });

  const onSubmit = (values: FormValues) => {
    let listType = null;
    let listId = null;

    if (values.listInfo !== NONE_LIST) {
      console.log(values.listInfo);
      [listType, listId] = values.listInfo.split("-");
    }

    mutate({
      id: task.id,
      name: values.name.trim(),
      deadline: values.deadline ? dateToMySqlFormat(values.deadline) : null,
      priority: values.priority === PriorityValues.Important ? true : false,
      listType:
        listType === "space" ||
        listType === "project" ||
        listType === null ||
        listType === undefined
          ? listType
          : task.listType,
      listId: listId,
    });
    closeTodo();
  };

  const onSubmitCallback = useCallback(onSubmit, [
    closeTodo,
    mutate,
    task.id,
    task.listType,
  ]);

  const onDelete = () => {
    closeTodo();
    deleteTask(task.id);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;
      if (
        ref.current &&
        !ref.current.contains(clickedElement) &&
        !datePickOpen &&
        !priorityPickOpen &&
        !listPickOpen
      ) {
        onSubmitCallback(form.getValues());
      }
    };
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [form, onSubmitCallback, datePickOpen, priorityPickOpen, listPickOpen]);

  // When clicking a todo to modify, put cursor in name form
  useEffect(() => {
    form.setFocus("name");
  }, [form]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    const { key } = e;

    if (key === "Enter") {
      onSubmit(form.getValues());
    }

    if (key === "Escape") {
      closeTodo();
    }
  };

  return (
    <Form {...form}>
      <form
        ref={ref}
        onSubmit={form.handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        className="mb-10 flex w-full items-start justify-between"
      >
        <div>
          <div className="flex items-start">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="New Task"
                      {...field}
                      className="w-full border-none focus:font-semibold focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          {isSmallDevice ? (
            <>
              <div className="flex select-none items-center gap-2">
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <DatePicker
                      field={field}
                      open={datePickOpen}
                      setOpen={setDatePickOpen}
                    />
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <PriorityPicker
                      field={field}
                      open={priorityPickOpen}
                      setOpen={setPriorityPickOpen}
                    />
                  )}
                />
              </div>
              <div className="px-4">
                <FormField
                  control={form.control}
                  name="listInfo"
                  render={({ field }) => (
                    <ListPicker
                      field={field}
                      open={listPickOpen}
                      setOpen={setListPickOpen}
                      lists={lists ?? []}
                      listInfo={listInfo}
                    />
                  )}
                />
              </div>
            </>
          ) : (
            <div className="my-0 flex select-none items-center gap-2">
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <DatePicker
                    field={field}
                    open={datePickOpen}
                    setOpen={setDatePickOpen}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <PriorityPicker
                    field={field}
                    open={priorityPickOpen}
                    setOpen={setPriorityPickOpen}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="listInfo"
                render={({ field }) => (
                  <ListPicker
                    field={field}
                    open={listPickOpen}
                    setOpen={setListPickOpen}
                    lists={lists ?? []}
                    listInfo={listInfo}
                  />
                )}
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 px-2">
          <button type="submit" className="rounded-md p-1" aria-label="Save">
            <Check
              aria-hidden
              className="text-slate-400 hover:text-slate-500"
            />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md p-1"
            aria-label="Delete"
          >
            <Trash
              aria-hidden
              className="text-slate-400 hover:text-slate-500"
            />
          </button>
        </div>
      </form>
    </Form>
  );
};

interface IDatePicker {
  field: ControllerRenderProps<FormValues, "deadline">;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DatePicker: React.FC<IDatePicker> = ({ field, open, setOpen }) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const SOMEDAY = "Someday";

  const onValueSelect = (value: string) => {
    if (value === SOMEDAY) {
      field.onChange(null);
    } else {
      field.onChange(addDays(new Date(), parseInt(value)));
    }
  };

  return (
    <FormItem>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "w-fit justify-start border-none text-left text-sm font-normal",
                !field.value && "text-muted-foreground",
              )}
            >
              <CalendarIcon size={isSmallDevice ? 12 : 14} className="mr-1" />
              {field.value ? (
                dayjs(field.value).format("ddd, MMM D")
              ) : (
                <span className="text-sm md:text-base">Someday</span>
              )}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent
          id="datepicker"
          side={isSmallDevice ? "bottom" : "right"}
          className="flex w-auto flex-col space-y-2 p-2 text-sm"
        >
          <Select onValueChange={onValueSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="0">Today</SelectItem>
              <SelectItem value="1">Tomorrow</SelectItem>
              <SelectItem value="7">In a week</SelectItem>
              <SelectItem value={SOMEDAY}>{SOMEDAY}</SelectItem>
            </SelectContent>
          </Select>
          <div className="rounded-md border">
            <Calendar
              mode="single"
              selected={field.value ?? undefined}
              onSelect={field.onChange}
            />
          </div>
        </PopoverContent>
      </Popover>
    </FormItem>
  );
};

interface IPriorityPicker {
  field: ControllerRenderProps<FormValues, "priority">;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PriorityPicker: React.FC<IPriorityPicker> = ({
  field,
  open,
  setOpen,
}) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  return (
    <FormItem>
      <Select
        open={open}
        onOpenChange={setOpen}
        onValueChange={field.onChange}
        defaultValue={field.value}
      >
        <SelectTrigger className="m-0 h-fit w-fit border-none p-0 hover:ring-2 hover:ring-slate-300 ">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={PriorityValues.Important}>
            <div className="flex items-center gap-1 text-sm">
              <StarIcon
                size={isSmallDevice ? 12 : 14}
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
    </FormItem>
  );
};

interface IListPicker {
  field: ControllerRenderProps<FormValues, "listInfo">;
  open: boolean;
  setOpen: (open: boolean) => void;
  lists: RouterOutputs["user"]["getLists"];
  listInfo: RouterOutputs["task"]["getListInfo"];
}

const ListPicker: React.FC<IListPicker> = ({
  field,
  open,
  setOpen,
  lists,
  listInfo,
}) => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  if (!lists) return null;

  return (
    <FormItem>
      <Select
        open={open}
        onOpenChange={setOpen}
        onValueChange={field.onChange}
        defaultValue={field.value ?? undefined}
      >
        <SelectTrigger className="m-0 h-fit w-fit border-none p-0 hover:ring-2 hover:ring-slate-300 ">
          <SelectValue
            placeholder={listInfo ? listInfo.name : "None"}
            className="text-sm"
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NONE_LIST}>
            <div className="flex items-center gap-1">
              <X size={isSmallDevice ? 12 : 14} /> None
            </div>
          </SelectItem>
          {lists.map((list) => (
            <SelectItem
              key={`${list.type}-${list.id}`}
              value={`${list.type}-${list.id}`}
            >
              <div className="flex items-center gap-1">
                {list.type === "project" ? (
                  <ProjectIcon size={isSmallDevice ? 12 : 14} />
                ) : (
                  <SpaceIcon size={isSmallDevice ? 12 : 14} />
                )}
                {list.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormItem>
  );
};

export default ModifiableTodo;
