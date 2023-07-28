import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { cn } from "@/utils/cn";
import { type TaskType } from "@/utils/types";
import { organizeTasks } from "@modal/common";

import Todo from "./todo";

const Matrix = () => {
  const { data } = api.task.getDashboardTasks.useQuery();
  const [typeOneTasks, setTypeOne] = useState<TaskType[]>([]);
  const [typeTwoTasks, setTypeTwo] = useState<TaskType[]>([]);
  const [typeThreeTasks, setTypeThree] = useState<TaskType[]>([]);
  const [typeFourTasks, setTypeFour] = useState<TaskType[]>([]);

  useEffect(() => {
    if (!data) return;

    const {
      typeOneTasks: t1,
      typeTwoTasks: t2,
      typeThreeTasks: t3,
      typeFourTasks: t4,
    } = organizeTasks(data);

    setTypeOne(t1);
    setTypeTwo(t2);
    setTypeThree(t3);
    setTypeFour(t4);
  }, [data]);

  return (
    <div className="h-full w-full">
      <div className="flex h-1/2 w-full">
        <MatrixQuadrant type="1" tasks={typeOneTasks} />
        <MatrixQuadrant type="2" tasks={typeTwoTasks} />
      </div>

      <div className="flex h-1/2 w-full">
        <MatrixQuadrant type="3" tasks={typeThreeTasks} />
        <MatrixQuadrant type="4" tasks={typeFourTasks} />
      </div>
    </div>
  );
};

export default Matrix;

interface IMatrixQuadrant {
  type: "1" | "2" | "3" | "4";
  tasks: TaskType[];
}

const MatrixQuadrant: React.FC<IMatrixQuadrant> = ({ type, tasks }) => {
  return (
    <div
      className={cn({
        "border-b-2 border-r-2": type === "1",
        "border-b-2 border-l-2": type === "2",
        "border-r-2 border-t-2": type === "3",
        "border-l-2 border-t-2": type === "4",
        "relative h-full w-full overflow-x-hidden border-black p-0": true,
      })}
    >
      {/* Labels */}
      <div>
        {type === "1" ? <MatrixLabel type="Due Soon" /> : null}
        {type === "1" ? <MatrixLabel type="Important" /> : null}
        {type === "2" ? <MatrixLabel type="Due Later" /> : null}
        {type === "3" ? <MatrixLabel type="Not Important" /> : null}
      </div>
      {/* Tasks */}
      <div className="h-full w-full pl-8 pt-8">
        <ul className="custom-scroll h-full w-full overflow-y-scroll pl-8 pt-8">
          {tasks.map((task) => (
            <Todo key={task.id} task={task} />
          ))}
        </ul>
      </div>
      {/* Number */}
      <div
        className={cn({
          "bottom-0 right-0 pb-1 pr-2": type === "1",
          "bottom-0 pb-1 pl-2": type === "2",
          "right-0 top-0 pr-2 pt-1": type === "3",
          "top-0 pl-2 pt-1": type === "4",
          "absolute text-gray-500": true,
        })}
      >
        {type}
      </div>
    </div>
  );
};

interface IMatrixLabel {
  type: "Due Soon" | "Due Later" | "Important" | "Not Important";
}

const MatrixLabel: React.FC<IMatrixLabel> = ({ type }) => {
  return (
    <h2
      className={cn({
        "truncate bg-white text-xl": true,
        "absolute top-0 w-full text-center font-light":
          type === "Due Soon" || type === "Due Later",
        "absolute left-0 top-0 h-full -rotate-180 text-center font-light":
          type === "Important" || type === "Not Important",
      })}
      style={
        type === "Important" || type === "Not Important"
          ? { writingMode: "vertical-rl" }
          : {}
      }
    >
      {type}
    </h2>
  );
};
