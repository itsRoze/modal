import { useEffect, useRef, useState } from "react";
import useAppContext from "@/hooks/useAppContext";
import { api } from "@/utils/api";
import { classNames } from "@modal/common";
import { CheckIcon, StarIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useToast } from "./ui/use-toast";

const TodoList = () => {
  return (
    <div className="px-4">
      <Todo id="1" priority={true} name="Walk dog" />
      <Todo id="2" priority={false} name="Buy groceries" />
      <Todo id="3" priority={false} name="Complete math set" />
      <NewTodo />
    </div>
  );
};

interface ITodo {
  id: string;
  priority: boolean;
  name: string;
  displayPriority?: boolean;
  selectable?: boolean;
}

const Todo: React.FC<ITodo> = ({
  id,
  priority,
  name,
  displayPriority = true,
  selectable = true,
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSelected, setIsSelected] = useState(false);
  const [checked, setChecked] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [checkHovering, setCheckHovering] = useState(false);

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

const NewTodo = () => {
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
      listType: listInfo.type,
      listId: listInfo.id,
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
