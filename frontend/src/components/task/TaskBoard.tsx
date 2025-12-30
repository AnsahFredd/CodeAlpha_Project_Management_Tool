import { useState } from "react";
import Card from "../common/Card";
import { taskService } from "../../api/services/task.service";
import { TASK_STATUS, TASK_STATUS_LABELS } from "../../utils/contants";
import type { Task } from "../../interfaces";
import { Group, Stack, Text, Box, Paper, SimpleGrid } from "@mantine/core";

interface TaskBoardProps {
  tasks: Task[];
  onUpdate?: () => void;
  onTaskMove?: (taskId: string, newStatus: Task["status"]) => void;
}

export default function TaskBoard({
  tasks,
  onUpdate,
  onTaskMove,
}: TaskBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const columns = [
    { status: TASK_STATUS.TODO, label: TASK_STATUS_LABELS[TASK_STATUS.TODO] },
    {
      status: TASK_STATUS.IN_PROGRESS,
      label: TASK_STATUS_LABELS[TASK_STATUS.IN_PROGRESS],
    },
    {
      status: TASK_STATUS.REVIEW,
      label: TASK_STATUS_LABELS[TASK_STATUS.REVIEW],
    },
    { status: TASK_STATUS.DONE, label: TASK_STATUS_LABELS[TASK_STATUS.DONE] },
    {
      status: TASK_STATUS.BLOCKED,
      label: TASK_STATUS_LABELS[TASK_STATUS.BLOCKED],
    },
  ];

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: Task["status"]) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    if (onTaskMove) {
      onTaskMove(draggedTask._id, newStatus);
    } else {
      // Fallback if no specific handler
      try {
        await taskService.updateTaskStatus(draggedTask._id, newStatus);
        onUpdate?.();
      } catch (error) {
        console.error("Failed to update task status:", error);
      }
    }
    setDraggedTask(null);
  };

  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <Box style={{ overflowX: "auto", paddingBottom: 16 }}>
      <SimpleGrid cols={5} spacing="md" style={{ minWidth: 1200 }}>
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.status);
          return (
            <Stack key={column.status} gap="md" h="100%">
              <Group justify="space-between">
                <Text fw={600} size="sm" c="dimmed" tt="uppercase">
                  {column.label}
                </Text>
                <Text
                  size="xs"
                  fw={700}
                  c="dimmed"
                  bg="gray.1"
                  px={6}
                  py={2}
                  style={{ borderRadius: 4 }}
                >
                  {columnTasks.length}
                </Text>
              </Group>

              <Paper
                withBorder
                radius="md"
                p="xs"
                bg="gray.0"
                className="flex-1"
                style={{ minHeight: 400 }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                <Stack gap="sm">
                  {columnTasks.map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={() => handleDragStart(task)}
                      style={{ cursor: "move" }}
                    >
                      <Card
                        title={task.title}
                        hover
                        noPadding
                        padding="sm" // Override noPadding
                      >
                        {task.description && (
                          <Text size="xs" c="dimmed" lineClamp={2} mb="xs">
                            {task.description}
                          </Text>
                        )}
                        <Group justify="space-between">
                          <Text size="xs" c="dimmed">
                            {Array.isArray(task.assignedTo)
                              ? task.assignedTo.length
                              : 0}{" "}
                            assigned
                          </Text>
                          {task.dueDate && (
                            <Text size="xs" c="dimmed">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </Text>
                          )}
                        </Group>
                      </Card>
                    </div>
                  ))}
                  {columnTasks.length === 0 && (
                    <Text size="sm" c="dimmed" ta="center" py="xl">
                      No tasks
                    </Text>
                  )}
                </Stack>
              </Paper>
            </Stack>
          );
        })}
      </SimpleGrid>
    </Box>
  );
}
