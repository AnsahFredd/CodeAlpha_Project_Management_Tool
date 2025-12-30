import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { taskService, projectService } from "../../api";
import { ROUTES } from "../../config/routes";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import { ArrowLeft, Edit, Trash2, Calendar, FolderKanban } from "lucide-react";
import { formatDate } from "../../utils/formateDate";
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from "../../utils/contants";
import type { Task, Project, User } from "../../interfaces";
import {
  Stack,
  Group,
  Title,
  Text,
  Grid,
  Badge,
  ThemeIcon,
  Avatar,
  Box,
  UnstyledButton,
} from "@mantine/core";
import Card from "../../components/common/Card";

export default function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const taskData = await taskService.getTaskById(id);
      setTask(taskData);

      // Fetch project if it's just an ID
      if (typeof taskData.project === "string") {
        try {
          const projectData = await projectService.getProjectById(
            taskData.project
          );
          setProject(projectData);
        } catch {
          // Project not found or error
        }
      } else {
        setProject(taskData.project as Project);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load task");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id, fetchTask]);

  const handleDelete = async () => {
    if (!id || !confirm("Are you sure you want to delete this task?")) return;

    try {
      await taskService.deleteTask(id);
      navigate(ROUTES.TASKS);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  const handleStatusChange = async (newStatus: Task["status"]) => {
    if (!id || !task) return;

    try {
      const updatedTask = await taskService.updateTaskStatus(id, newStatus);
      setTask(updatedTask);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "Failed to update task status"
      );
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading task..." />;
  }

  if (error || !task) {
    return (
      <Stack gap="md">
        <Link to={ROUTES.TASKS}>
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} />
            <Text span ml={8}>
              Back to Tasks
            </Text>
          </Button>
        </Link>
        <Alert type="error">{error || "Task not found"}</Alert>
      </Stack>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "green";
      case "in-progress":
        return "blue";
      case "review":
        return "yellow";
      case "blocked":
        return "red";
      default:
        return "gray";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between" align="flex-start">
        <Group align="flex-start">
          <Link to={ROUTES.TASKS}>
            <Button variant="ghost" size="sm" style={{ paddingLeft: 0 }}>
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <Title order={2} c="primary">
              {task.title}
            </Title>
            {project && (
              <Box
                component={Link}
                to={ROUTES.PROJECT_DETAIL(project._id)}
                style={{ textDecoration: "none" }}
              >
                <Group gap={6}>
                  <ThemeIcon variant="transparent" size="sm" color="gray">
                    <FolderKanban size={14} />
                  </ThemeIcon>
                  <Text
                    size="sm"
                    c="dimmed"
                    fw={500}
                    className="hover:text-primary transition-colors"
                  >
                    {project.name}
                  </Text>
                </Group>
              </Box>
            )}
          </div>
        </Group>
        <Group>
          <Link to={ROUTES.EDIT_TASK(task._id)}>
            <Button variant="outline" size="sm">
              <Edit size={14} style={{ marginRight: 6 }} />
              Edit
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 size={14} style={{ marginRight: 6 }} />
            Delete
          </Button>
        </Group>
      </Group>

      <Grid gutter="xl">
        {/* Main Content */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack gap="lg">
            {/* Description */}
            <Card title="Description">
              <Text
                size="md"
                style={{ whiteSpace: "pre-wrap" }}
                c="text.secondary"
              >
                {task.description || "No description provided"}
              </Text>
            </Card>

            {/* Status Update */}
            <Card title="Update Status">
              <Group gap="sm">
                {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                  <UnstyledButton
                    key={value}
                    onClick={() => handleStatusChange(value as Task["status"])}
                    p="xs"
                    style={{
                      borderRadius: "8px",
                      backgroundColor:
                        task.status === value
                          ? `var(--mantine-color-${getStatusColor(value)}-filled)`
                          : "var(--mantine-color-gray-0)",
                      color:
                        task.status === value
                          ? "white"
                          : "var(--mantine-color-text)",
                      transition: "all 0.2s",
                    }}
                    className="hover:scale-105"
                  >
                    <Text size="sm" fw={600} px="sm">
                      {label}
                    </Text>
                  </UnstyledButton>
                ))}
              </Group>
            </Card>
          </Stack>
        </Grid.Col>

        {/* Sidebar */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack gap="lg">
            {/* Task Info */}
            <Card title="Task Information">
              <Stack gap="md">
                <Box>
                  <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb={4}>
                    Status
                  </Text>
                  <Badge color={getStatusColor(task.status)} variant="filled">
                    {TASK_STATUS_LABELS[task.status]}
                  </Badge>
                </Box>

                <Box>
                  <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb={4}>
                    Priority
                  </Text>
                  <Badge
                    color={getPriorityColor(task.priority)}
                    variant="light"
                  >
                    {TASK_PRIORITY_LABELS[task.priority]}
                  </Badge>
                </Box>

                {task.dueDate && (
                  <Box>
                    <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb={4}>
                      Due Date
                    </Text>
                    <Group gap={6}>
                      <ThemeIcon size="sm" variant="transparent" color="gray">
                        <Calendar size={14} />
                      </ThemeIcon>
                      <Text size="sm" fw={500}>
                        {formatDate(task.dueDate, "long")}
                      </Text>
                    </Group>
                  </Box>
                )}

                {task.tags && task.tags.length > 0 && (
                  <Box>
                    <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb={8}>
                      Tags
                    </Text>
                    <Group gap="xs">
                      {task.tags.map((tag) => (
                        <Badge key={tag} variant="outline" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                  </Box>
                )}
              </Stack>
            </Card>

            {/* Assigned To */}
            {Array.isArray(task.assignedTo) && task.assignedTo.length > 0 && (
              <Card title="Assigned To">
                <Stack gap="sm">
                  {task.assignedTo.map((user: User | string, index: number) => {
                    const userObj = typeof user === "object" ? user : null;
                    return (
                      <Group key={index} gap="sm">
                        <Avatar color="blue" radius="xl" size="sm">
                          {userObj?.name?.charAt(0).toUpperCase() || "U"}
                        </Avatar>
                        <div>
                          <Text size="sm" fw={600}>
                            {userObj?.name || "Unknown User"}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {userObj?.email || ""}
                          </Text>
                        </div>
                      </Group>
                    );
                  })}
                </Stack>
              </Card>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
