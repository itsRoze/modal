import { useEffect } from "react";
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
  const { setSelectedTodo } = useAppContext();

  const { data: tasks, isLoading } = api.task.getAllForList.useQuery({
    listId,
    listType,
  });

  useEffect(() => {
    // Reset selected if the list changes
    setSelectedTodo(undefined);
  }, [listType, listId, setSelectedTodo]);

  if (isLoading) return <LoadingPage />;
  if (!tasks && !isLoading) return <div>404</div>;

  return (
    <div className="">
      {tasks.map((task) => (
        <Todo key={task.id} task={task} />
      ))}
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
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = (data: FormValues) => {
    if (!listInfo) return;
    const { name } = data;

    const trimmedName = name.trim();
    if (!trimmedName) {
      form.reset();
      setAddingNewTodo(false);
      return;
    }

    mutate({
      name: trimmedName,
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
