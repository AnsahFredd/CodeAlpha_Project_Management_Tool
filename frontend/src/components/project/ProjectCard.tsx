import { Link } from "react-router-dom";
import { FolderKanban, Calendar, Users, CheckSquare } from "lucide-react";
import { ROUTES } from "../../config/routes";
import { getStatusColor } from "../../utils/helpers";
import { PROJECT_STATUS_LABELS } from "../../utils/contants";
import type { Project, Task } from "../../interfaces";
import {
  Card,
  Text,
  Badge,
  Group,
  ThemeIcon,
  Stack,
  Box,
  Progress,
  Tooltip,
} from "@mantine/core";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const tasksCount = Array.isArray(project.tasks) ? project.tasks.length : 0;
  const completedTasks = Array.isArray(project.tasks)
    ? project.tasks.filter((t: Task) => t.status === "done").length
    : 0;
  const progress =
    tasksCount > 0 ? Math.round((completedTasks / tasksCount) * 100) : 0;

  return (
    <Box
      component={Link}
      to={ROUTES.PROJECT_DETAIL(project._id)}
      style={{ textDecoration: "none" }}
    >
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        className="hover:shadow-md transition-shadow group h-full"
      >
        <Stack gap="md" h="100%">
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <ThemeIcon size="xl" radius="md" variant="light" color="blue">
              <FolderKanban size={24} />
            </ThemeIcon>
            <Badge color={getStatusColor(project.status)} variant="light">
              {
                PROJECT_STATUS_LABELS[
                  project.status as keyof typeof PROJECT_STATUS_LABELS
                ]
              }
            </Badge>
          </Group>

          <Stack gap={4} style={{ flex: 1 }}>
            <Text
              fw={700}
              size="lg"
              className="group-hover:text-primary transition-colors line-clamp-1"
              c="text.primary"
            >
              {project.name}
            </Text>
            <Text size="sm" c="dimmed" lineClamp={2}>
              {project.description || "No description provided"}
            </Text>
          </Stack>

          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="xs" fw={700} c="dimmed">
                Progress
              </Text>
              <Text size="xs" fw={700} c="primary">
                {progress}%
              </Text>
            </Group>
            <Progress value={progress} size="sm" radius="xl" color="blue" />
          </Stack>

          <Group
            justify="space-between"
            pt="sm"
            style={{ borderTop: "1px solid var(--mantine-color-gray-1)" }}
          >
            <Tooltip label="Tasks">
              <Group gap={4}>
                <CheckSquare size={14} className="text-dimmed" />
                <Text size="xs" c="dimmed">
                  {tasksCount}
                </Text>
              </Group>
            </Tooltip>

            <Tooltip label="Team Members">
              <Group gap={4}>
                <Users size={14} className="text-dimmed" />
                <Text size="xs" c="dimmed">
                  {project.members?.length || 0}
                </Text>
              </Group>
            </Tooltip>

            {project.endDate && (
              <Group gap={4}>
                <Calendar size={14} className="text-dimmed" />
                <Text size="xs" c="dimmed">
                  {new Date(project.endDate).toLocaleDateString()}
                </Text>
              </Group>
            )}
          </Group>
        </Stack>
      </Card>
    </Box>
  );
}
