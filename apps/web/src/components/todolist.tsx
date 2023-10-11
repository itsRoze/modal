import { useEffect } from "react";
import { useRouter } from "next/router";
import useAppContext from "@/hooks/useAppContext";
import { api } from "@/utils/api";

import { LoadingPage } from "./loading";
import { NewTodo } from "./newTodo";
import Todo from "./todo";

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

export default TodoList;
