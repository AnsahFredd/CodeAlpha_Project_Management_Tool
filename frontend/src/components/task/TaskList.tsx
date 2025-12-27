import TaskCard from "./TaskCard";
import type { Task } from "../../interfaces";

interface TaskListProps {
  tasks: Task[];
  onUpdate?: () => void;
}

export default function TaskList({ tasks }: TaskListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}
