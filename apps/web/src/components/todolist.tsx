import { useEffect } from "react";
import { useRouter } from "next/router";
import useAppContext from "@/hooks/useAppContext";
import { api } from "@/utils/api";
import { useForm } from "react-hook-form";

import { LoadingPage } from "./loading";
import Todo from "./todo";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";

interface ITodoList {
  listType: "space" | "project";
  listId: string;
}

const TodoList: React.FC<ITodoList> = ({ listType, listId }) => {
  const { push } = useRouter();
  const { setSelectedTodo, addingNewTodo } = useAppContext();

  const {
    data: tasks,
    isLoading,
    isRefetching,
  } = api.task.getAllForList.useQuery({
    listId,
    listType,
  });

  useEffect(() => {
    // Reset selected if the list changes
    setSelectedTodo(undefined);
  }, [listType, listId, setSelectedTodo]);

  if (isLoading) return <LoadingPage />;
  if (!tasks && !isLoading) {
    void push("/404");
    return null;
  }

  return (
    <div className="todolist group flex flex-grow flex-col">
      {tasks.length === 0 && !addingNewTodo && !isRefetching ? (
        <p className="flex py-4 text-center italic text-gray-500">Zero tasks</p>
      ) : (
        tasks.map((task) => <Todo key={task.id} task={task} />)
      )}

      <NewTodo listId={listId} listType={listType} />
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
  const { setAddingNewTodo, addingNewTodo, listInfo } = useAppContext();
  const ctx = api.useContext();
  const { toast } = useToast();

  const { mutate, isLoading } = api.task.create.useMutation({
    onSuccess() {
      form.reset();
      void ctx.invalidate();
      setAddingNewTodo(false);
    },
    onError(error) {
      setAddingNewTodo(false);
      toast({
        variant: "destructive",
        title: "Uh oh!",
        description: error.message ?? "Something went wrong",
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
    if (!isLoading) setAddingNewTodo(false);
  };

  const onSubmit = (data: FormValues) => {
    if (!listInfo) return;
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
    });

    close();
  };

  const createClick = () => {
    setAddingNewTodo(true);
  };

  useEffect(() => {
    if (addingNewTodo) {
      form.setFocus("name");
    }
  }, [addingNewTodo, form]);

  if (!listInfo) return null;

  if (!addingNewTodo) {
    return (
      <div
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

export default TodoList;
