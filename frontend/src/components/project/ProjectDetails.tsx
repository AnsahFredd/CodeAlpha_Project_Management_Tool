import { Link } from "react-router-dom";
import Card from "../common/Card";
import { ROUTES } from "../../config/routes";
import { formatDate } from "../../utils/formateDate";
import {
  PROJECT_STATUS_LABELS,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from "../../utils/contants";
import type { Project, Task, User } from "../../interfaces";
import { Calendar, Users, CheckSquare } from "lucide-react";
import {
  Grid,
  Text,
  Badge,
  Group,
  Stack,
  ThemeIcon,
  Avatar,
  Box,
  Divider,
} from "@mantine/core";
import Button from "../common/Button";

interface ProjectDetailsProps {
  project: Project;
  tasks: Task[];
  onUpdate?: () => void;
}

export default function ProjectDetails({
  project,
  tasks,
}: ProjectDetailsProps) {
  const membersCount = Array.isArray(project.members)
    ? project.members.length
    : 0;
  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === "todo").length,
    "in-progress": tasks.filter((t) => t.status === "in-progress").length,
    review: tasks.filter((t) => t.status === "review").length,
    done: tasks.filter((t) => t.status === "done").length,
    blocked: tasks.filter((t) => t.status === "blocked").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "green";
      case "completed":
        return "blue";
      case "on-hold":
        return "yellow";
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

  const getTaskStatusColor = (status: string) => {
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

  return (
    <Grid gutter="xl">
      {/* Main Content */}
      <Grid.Col span={{ base: 12, lg: 8 }}>
        <Stack gap="lg">
          {/* Project Info */}
          <Card title="Project Information">
            <Grid>
              <Grid.Col span={{ base: 6, sm: 3 }}>
                <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                  Status
                </Text>
                <Badge
                  mt={4}
                  color={getStatusColor(project.status)}
                  variant="light"
                >
                  {
                    PROJECT_STATUS_LABELS[
                      project.status as keyof typeof PROJECT_STATUS_LABELS
                    ]
                  }
                </Badge>
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 3 }}>
                <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                  Priority
                </Text>
                <Badge
                  mt={4}
                  color={getPriorityColor(project.priority)}
                  variant="light"
                >
                  {
                    TASK_PRIORITY_LABELS[
                      project.priority as keyof typeof TASK_PRIORITY_LABELS
                    ]
                  }
                </Badge>
              </Grid.Col>
              {project.startDate && (
                <Grid.Col span={{ base: 6, sm: 3 }}>
                  <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                    Start Date
                  </Text>
                  <Group gap={6} mt={4}>
                    <Calendar size={16} className="text-primary" />
                    <Text size="sm" fw={500}>
                      {formatDate(project.startDate, "short")}
                    </Text>
                  </Group>
                </Grid.Col>
              )}
              {project.endDate && (
                <Grid.Col span={{ base: 6, sm: 3 }}>
                  <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                    End Date
                  </Text>
                  <Group gap={6} mt={4}>
                    <Calendar size={16} className="text-primary" />
                    <Text size="sm" fw={500}>
                      {formatDate(project.endDate, "short")}
                    </Text>
                  </Group>
                </Grid.Col>
              )}
            </Grid>
          </Card>

          {/* Tasks */}
          <Card
            title={
              <Group justify="space-between" align="center" w="100%">
                <Text fw={700} size="lg">
                  Tasks
                </Text>
                <Link to={`${ROUTES.CREATE_TASK}?project=${project._id}`}>
                  <Button size="sm" variant="outline">
                    + Add Task
                  </Button>
                </Link>
              </Group>
            }
            noPadding
          >
            {tasks.length === 0 ? (
              <Stack align="center" py="xl">
                <ThemeIcon size="xl" radius="xl" color="gray" variant="light">
                  <CheckSquare size={24} />
                </ThemeIcon>
                <Text fw={500} c="dimmed">
                  No tasks yet
                </Text>
                <Text size="sm" c="dimmed">
                  Create a task to get started
                </Text>
              </Stack>
            ) : (
              <Stack gap={0}>
                {tasks.map((task) => (
                  <Box
                    key={task._id}
                    component={Link}
                    to={ROUTES.TASK_DETAIL(task._id)}
                    p="md"
                    style={{
                      borderBottom:
                        "1px solid var(--mantine-color-default-border)",
                      textDecoration: "none",
                    }}
                    className="group hover:bg-bg-hover transition-colors"
                  >
                    <Group
                      justify="space-between"
                      align="flex-start"
                      wrap="nowrap"
                    >
                      <div style={{ flex: 1 }}>
                        <Text
                          fw={600}
                          c="text.primary"
                          className="group-hover:text-primary transition-colors"
                        >
                          {task.title}
                        </Text>
                        <Text size="sm" c="dimmed" lineClamp={1}>
                          {task.description}
                        </Text>
                      </div>
                      <Badge
                        color={getTaskStatusColor(task.status)}
                        variant="light"
                        size="sm"
                      >
                        {
                          TASK_STATUS_LABELS[
                            task.status as keyof typeof TASK_STATUS_LABELS
                          ]
                        }
                      </Badge>
                    </Group>
                  </Box>
                ))}
              </Stack>
            )}
          </Card>
        </Stack>
      </Grid.Col>

      {/* Sidebar */}
      <Grid.Col span={{ base: 12, lg: 4 }}>
        <Stack gap="lg">
          {/* Stats */}
          <Card title="Statistics">
            <Stack gap="md">
              <Group justify="space-between">
                <Group gap="xs">
                  <ThemeIcon size="md" variant="light" color="gray">
                    <Users size={14} />
                  </ThemeIcon>
                  <Text size="sm" fw={500} c="dimmed">
                    Members
                  </Text>
                </Group>
                <Text fw={700} size="lg">
                  {membersCount}
                </Text>
              </Group>
              <Group justify="space-between">
                <Group gap="xs">
                  <ThemeIcon size="md" variant="light" color="gray">
                    <CheckSquare size={14} />
                  </ThemeIcon>
                  <Text size="sm" fw={500} c="dimmed">
                    Total Tasks
                  </Text>
                </Group>
                <Text fw={700} size="lg">
                  {tasks.length}
                </Text>
              </Group>

              <Divider />

              <Stack gap="xs">
                {[
                  { label: "To Do", value: tasksByStatus.todo, color: "gray" },
                  {
                    label: "In Progress",
                    value: tasksByStatus["in-progress"],
                    color: "blue",
                  },
                  {
                    label: "Review",
                    value: tasksByStatus.review,
                    color: "yellow",
                  },
                  { label: "Done", value: tasksByStatus.done, color: "green" },
                ].map((stat) => (
                  <Group key={stat.label} justify="space-between">
                    <Group gap="xs">
                      <Box
                        w={8}
                        h={8}
                        style={{
                          borderRadius: "50%",
                          backgroundColor: `var(--mantine-color-${stat.color}-filled)`,
                        }}
                      />
                      <Text size="sm" c="dimmed">
                        {stat.label}
                      </Text>
                    </Group>
                    <Text fw={700} size="sm">
                      {stat.value}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Stack>
          </Card>

          {/* Members */}
          {membersCount > 0 && (
            <Card title="Team Members">
              <Stack gap="sm">
                {Array.isArray(project.members) &&
                  project.members
                    .slice(0, 5)
                    .map((member: User | string, index: number) => {
                      const user = typeof member === "object" ? member : null;
                      return (
                        <Group
                          key={index}
                          gap="sm"
                          p="xs"
                          style={{ borderRadius: "8px" }}
                          className="hover:bg-bg-hover transition-colors"
                        >
                          <Avatar color="blue" radius="xl">
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                          </Avatar>
                          <div>
                            <Text size="sm" fw={600}>
                              {user?.name || "Unknown User"}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {user?.email || ""}
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
  );
}
