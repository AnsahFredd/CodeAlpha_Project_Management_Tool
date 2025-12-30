import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { taskService } from "../../api";
import { ROUTES } from "../../config/routes";
import TaskList from "../../components/task/TaskList";
import TaskBoard from "../../components/task/TaskBoard";
import TaskFilters from "../../components/task/TaskFilters";
import { Plus, LayoutGrid, List as ListIcon } from "lucide-react";
import {
  Stack,
  Group,
  Title,
  Text,
  SegmentedControl,
  Paper,
  Box,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import type { Task } from "../../interfaces";

export default function Tasks() {
  const { projects, refreshProjects } = useProjects();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");

  useEffect(() => {
    refreshProjects();
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const allTasks = await taskService.getAllTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusChange = async (
    taskId: string,
    newStatus: Task["status"]
  ) => {
    const previousTasks = [...tasks];

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await taskService.updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error("Failed to update task status:", error);
      setTasks(previousTasks); // Rollback
      notifications.show({
        title: "Error",
        message: "Failed to update task status. Please try again.",
        color: "red",
      });
    }
  };

  const filteredTasks = tasks.filter((task: Task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesProject =
      projectFilter === "all" ||
      (typeof task.project === "string"
        ? task.project === projectFilter
        : task.project._id === projectFilter);

    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  if (loading) {
    return <Loading fullScreen text="Loading tasks..." />;
  }

  return (
    <Stack gap="lg" align="stretch">
      {/* Header */}
      <Group justify="space-between" align="flex-end">
        <Stack gap={4}>
          <Title order={2}>Tasks</Title>
          <Text c="dimmed">Manage your project tasks and track progress.</Text>
        </Stack>
        <Group>
          <SegmentedControl
            value={viewMode}
            onChange={(value) => setViewMode(value as "board" | "list")}
            data={[
              {
                value: "board",
                label: (
                  <Group gap={6} wrap="nowrap" justify="center">
                    <LayoutGrid size={16} />
                    <span>Board</span>
                  </Group>
                ),
              },
              {
                value: "list",
                label: (
                  <Group gap={6} wrap="nowrap" justify="center">
                    <ListIcon size={16} />
                    <span>List</span>
                  </Group>
                ),
              },
            ]}
          />
          <Link to={ROUTES.CREATE_TASK}>
            <Button leftSection={<Plus size={16} />}>New Task</Button>
          </Link>
        </Group>
      </Group>

      {/* Filters */}
      <TaskFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        projectFilter={projectFilter}
        onProjectChange={setProjectFilter}
        projects={projects}
      />

      {/* View Content */}
      <Paper p="md" withBorder radius="md" style={{ flex: 1 }}>
        {filteredTasks.length === 0 ? (
          <Box ta="center" py={80}>
            <Text size="xl" fw={700} c="dimmed">
              No tasks found
            </Text>
            <Text c="dimmed">
              Try adjusting your filters or create a new task.
            </Text>
          </Box>
        ) : viewMode === "board" ? (
          <TaskBoard
            tasks={filteredTasks}
            onUpdate={fetchTasks}
            onTaskMove={handleTaskStatusChange}
          />
        ) : (
          <TaskList tasks={filteredTasks} />
        )}
      </Paper>
    </Stack>
  );
}
