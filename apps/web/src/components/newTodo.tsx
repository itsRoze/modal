import { useEffect, useState } from "react";
import useAppContext from "@/hooks/useAppContext";
import { api } from "@/utils/api";
import { getTrpcClientErrorMsg } from "@modal/common/";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

type FormValues = {
  name: string;
};

interface INewTodo {
  listType?: "space" | "project";
  listId?: string;
  dueDate?: string;
  priority?: boolean;
}
export const NewTodo: React.FC<INewTodo> = ({
  listType,
  listId,
  dueDate,
  priority,
}) => {
  const { setAddingNewTodo, addingNewTodo } = useAppContext();
  const ctx = api.useContext();
  const { toast } = useToast();

  // Need this for the dashboard because there are multiple new todo components where the state is shared
  const [localAddingNewTodo, setLocalAddingNewTodo] = useState(false);

  const { mutate, isLoading } = api.task.create.useMutation({
    onSuccess() {
      form.reset();
      void ctx.invalidate();
      setAddingNewTodo(false);
      setLocalAddingNewTodo(false);
    },
    onError(error) {
      setAddingNewTodo(false);
      setLocalAddingNewTodo(false);

      const clientErrMsg = getTrpcClientErrorMsg(error);

      toast({
        variant: "destructive",
        title: "Uh oh!",
        description: clientErrMsg,
      });
    },
  });

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
    },
  });

  const close = () => {
    form.reset();
    if (!isLoading) {
      setAddingNewTodo(false);
      setLocalAddingNewTodo(false);
    }
  };

  const onSubmit = (data: FormValues) => {
    const { name } = data;

    const trimmedName = name.trim();
    if (!trimmedName) {
      close();
      return;
    }

    mutate({
      name: trimmedName,
      listType: listType,
      listId: listId,
      deadline: dueDate,
      priority: priority,
    });

    close();
  };

  const createClick = () => {
    setLocalAddingNewTodo(true);
  };

  useEffect(() => {
    if (addingNewTodo || localAddingNewTodo) {
      form.setFocus("name");
    }
  }, [addingNewTodo, localAddingNewTodo, form]);

  if (!localAddingNewTodo && !addingNewTodo) {
    return (
      <div
        id="new-todo"
        className="flex-grow py-2 opacity-0 hover:opacity-80"
        onClick={createClick}
      >
        <p className="rounded-md border py-2 italic text-gray-400 shadow-sm">
          Click to add new task
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onBlur={form.handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            close();
          }
        }}
        className="mx-1"
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
