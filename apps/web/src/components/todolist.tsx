import { useEffect } from "react";
import useAppContext from "@/hooks/useAppContext";
import { useForm } from "react-hook-form";

const TodoList = () => {
  return (
    <div>
      <h1>Welcome to TodoList!</h1>
      <NewTodo />
    </div>
  );
};

type FormValues = {
  name: string;
};

const NewTodo = () => {
  const { addingNewTodo } = useAppContext();

  const { register, handleSubmit, setFocus } = useForm<FormValues>();
  const onSubmit = (data: FormValues) => console.log(data);

  useEffect(() => {
    if (addingNewTodo) {
      setFocus("name");
    }
  }, [addingNewTodo, setFocus]);

  if (!addingNewTodo) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="Name" />
      <input type="submit" />
    </form>
  );
};

export default TodoList;
