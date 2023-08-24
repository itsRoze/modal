import { api } from "@/utils/api";
import { cn } from "@/utils/cn";

import Todo from "./todo";

const Matrix = () => {
  return (
    <div className="h-full w-full">
      <div className="flex h-1/2 w-full">
        <MatrixQuadrantOne />
        <MatrixQuadrantTwo />
      </div>

      <div className="flex h-1/2 w-full">
        <MatrixQuadrantThree />
        <MatrixQuadrantFour />
      </div>
    </div>
  );
};

export default Matrix;

const MatrixQuadrantOne = () => {
  const { data: tasks } = api.task.getImportantAndDueSoon.useQuery();

  return (
    <div
      className={cn({
        "border-b-2 border-r-2": true,
        "relative h-full w-full overflow-x-hidden border-black p-0": true,
      })}
    >
      {/* Labels */}
      <div>
        <MatrixLabel type="Due Soon" />
        <MatrixLabel type="Important" />
      </div>
      {/* Tasks */}
      <div className="h-full w-full pl-8 pt-8">
        <ul className="custom-scroll h-full w-full overflow-y-scroll pl-8 pt-8">
          {tasks
            ? tasks.map((task) => (
                <Todo key={task.id} task={task} displayList={true} />
              ))
            : null}
        </ul>
      </div>
      {/* Number */}
      <div
        className={cn({
          "bottom-0 right-0 pb-1 pr-2": true,
          "absolute text-gray-500": true,
        })}
      >
        1
      </div>
    </div>
  );
};

const MatrixQuadrantTwo = () => {
  const { data: tasks } = api.task.getImportantAndDueLater.useQuery();

  return (
    <div
      className={cn({
        "border-b-2 border-l-2": true,
        "relative h-full w-full overflow-x-hidden border-black p-0": true,
      })}
    >
      {/* Labels */}
      <div>
        <MatrixLabel type="Due Later" />
      </div>
      {/* Tasks */}
      <div className="h-full w-full pl-8 pt-8">
        <ul className="custom-scroll h-full w-full overflow-y-scroll pl-8 pt-8">
          {tasks
            ? tasks.map((task) => (
                <Todo key={task.id} task={task} displayList={true} />
              ))
            : null}
        </ul>
      </div>
      {/* Number */}
      <div
        className={cn({
          "bottom-0 pb-1 pl-2": true,
          "absolute text-gray-500": true,
        })}
      >
        2
      </div>
    </div>
  );
};

const MatrixQuadrantThree = () => {
  const { data: tasks } = api.task.getNotImportantAndDueSoon.useQuery();

  return (
    <div
      className={cn({
        "border-r-2 border-t-2": true,
        "relative h-full w-full overflow-x-hidden border-black p-0": true,
      })}
    >
      {/* Labels */}
      <div>
        <MatrixLabel type="Not Important" />
      </div>
      {/* Tasks */}
      <div className="h-full w-full pl-8 pt-8">
        <ul className="custom-scroll h-full w-full overflow-y-scroll pl-8 pt-8">
          {tasks
            ? tasks.map((task) => (
                <Todo key={task.id} task={task} displayList={true} />
              ))
            : null}
        </ul>
      </div>
      {/* Number */}
      <div
        className={cn({
          "right-0 top-0 pr-2 pt-1": true,
          "absolute text-gray-500": true,
        })}
      >
        3
      </div>
    </div>
  );
};

const MatrixQuadrantFour = () => {
  const { data: tasks } = api.task.getNotImportantAndDueLater.useQuery();

  return (
    <div
      className={cn({
        "border-l-2 border-t-2": true,
        "relative h-full w-full overflow-x-hidden border-black p-0": true,
      })}
    >
      {/* Labels */}
      <div></div>
      {/* Tasks */}
      <div className="h-full w-full pl-8 pt-8">
        <ul className="custom-scroll h-full w-full overflow-y-scroll pl-8 pt-8">
          {tasks
            ? tasks.map((task) => (
                <Todo key={task.id} task={task} displayList={true} />
              ))
            : null}
        </ul>
      </div>
      {/* Number */}
      <div
        className={cn({
          "top-0 pl-2 pt-1": true,
          "absolute text-gray-500": true,
        })}
      >
        4
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
