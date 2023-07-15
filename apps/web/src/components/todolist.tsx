import { useEffect, useRef, useState } from "react";
import useAppContext from "@/hooks/useAppContext";
import { api } from "@/utils/api";
import { type RouterOutputs } from "@modal/api";
import { classNames } from "@modal/common";
import { CheckIcon, StarIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { LoadingPage } from "./loading";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useToast } from "./ui/use-toast";

interface ITodoList {
  listType: "space" | "project";
  listId: string;
}

const TodoList: React.FC<ITodoList> = ({ listType, listId }) => {
  const { data: tasks, isLoading } = api.task.getAllForUser.useQuery();
  if (isLoading) return <LoadingPage />;
  if (!tasks && !isLoading) return <div>404</div>;

  return (
    <div className="px-4">
      {tasks.map((task) => (
        <Todo key={task.id} task={task} />
      ))}
      <NewTodo listId={listId} listType={listType} />
    </div>
  );
};

interface ITodo {
  task: RouterOutputs["task"]["getAllForUser"][number];
  displayPriority?: boolean;
  selectable?: boolean;
}

const Todo: React.FC<ITodo> = ({
  task,
  displayPriority = true,
  selectable = true,
}) => {
  const { id, name, priority } = task;

  const { selectedTodo, setSelectedTodo } = useAppContext();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [checked, setChecked] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [checkHovering, setCheckHovering] = useState(false);

  // Effect for setting the selected task in the app context
  useEffect(() => {
    // if currently selected, update context
    if (isSelected) setSelectedTodo(task);
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
      if (selectedTodo.id !== task.id && isSelected) {
        setIsSelected(false);
      }
    } else setIsSelected(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTodo]);

  // Clear the interval when the component unmounts
  useEffect(() => {
    const handleEscapeKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (selectable && isSelected && event.key === "Escape")
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
      setSelectedTodo(undefined);
    };
  }, [setSelectedTodo, selectable, isSelected]);

  const handleOnSelect = () => {
    if (selectable) setIsSelected((current) => !current);
  };
  const handleOnCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelected(false);
    setChecked((value) => !value);

    if (e.target.checked) {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        console.log("mutate");
      }, 1000);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
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

type FormValues = {
  name: string;
};

interface INewTodo {
  listType: "space" | "project";
  listId: string;
}

const NewTodo: React.FC<INewTodo> = ({ listType, listId }) => {
  const ctx = api.useContext();
  const { toast } = useToast();

  const { mutate } = api.task.create.useMutation({
    onSuccess() {
      form.reset();
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

  const { setAddingNewTodo, addingNewTodo, listInfo } = useAppContext();
  const form = useForm<FormValues>();
  const onSubmit = (data: FormValues) => {
    if (!listInfo) return;
    console.log("data", data);

    mutate({
      name: data.name,
      listType,
      listId,
    });

    form.reset();
    setAddingNewTodo(false);
  };

  useEffect(() => {
    if (addingNewTodo) {
      form.setFocus("name");
    }
  }, [addingNewTodo, form]);

  if (!listInfo) return null;

  if (!addingNewTodo) return null;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onBlur={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="New Task" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default TodoList;
