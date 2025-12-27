import { Link } from "react-router-dom";
import { Calendar, MessageSquare, MoreVertical } from "lucide-react";
import { ROUTES } from "../../config/routes";
import { getPriorityColor, getStatusColor } from "../../utils/helpers";
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from "../../utils/contants";
import type { Task, User } from "../../interfaces";
import {
  Card,
  Text,
  Badge,
  Group,
  Stack,
  Box,
  Avatar,
  ActionIcon,
  Menu,
} from "@mantine/core";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <Card
      shadow="sm"
      p="md"
      radius="md"
      withBorder
      className="hover:shadow-md transition-shadow"
    >
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Badge
            color={getPriorityColor(task.priority)}
            variant="light"
            size="sm"
          >
            {
              TASK_PRIORITY_LABELS[
                task.priority as keyof typeof TASK_PRIORITY_LABELS
              ]
            }
          </Badge>
          <Menu position="bottom-end" shadow="md">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray" size="sm">
                <MoreVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item component={Link} to={ROUTES.TASK_DETAIL(task._id)}>
                View Details
              </Menu.Item>
              <Menu.Item color="red">Delete Task</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Box
          component={Link}
          to={ROUTES.TASK_DETAIL(task._id)}
          style={{ textDecoration: "none" }}
        >
          <Stack gap={4}>
            <Text
              fw={700}
              size="md"
              c="text.primary"
              lineClamp={1}
              className="hover:text-primary transition-colors"
            >
              {task.title}
            </Text>
            <Text
              size="sm"
              c="dimmed"
              lineClamp={2}
              style={{ minHeight: "2.5rem" }}
            >
              {task.description || "No description provided"}
            </Text>
          </Stack>
        </Box>

        <Group
          justify="space-between"
          align="center"
          mt="auto"
          pt="sm"
          style={{ borderTop: "1px solid var(--mantine-color-gray-1)" }}
        >
          <Group gap="xs">
            <Badge
              size="xs"
              variant="filled"
              color={getStatusColor(task.status)}
            >
              {
                TASK_STATUS_LABELS[
                  task.status as keyof typeof TASK_STATUS_LABELS
                ]
              }
            </Badge>
            {task.dueDate && (
              <Group gap={4}>
                <Calendar size={12} className="text-dimmed" />
                <Text size="xs" c="dimmed">
                  {new Date(task.dueDate).toLocaleDateString()}
                </Text>
              </Group>
            )}
          </Group>

          <Group gap={8}>
            <Group gap={4}>
              <MessageSquare size={12} className="text-dimmed" />
              <Text size="xs" c="dimmed">
                3
              </Text>
            </Group>
            <Avatar.Group spacing="xs">
              <Avatar size="xs" radius="xl" color="blue">
                {Array.isArray(task.assignedTo) && task.assignedTo.length > 0
                  ? (task.assignedTo[0] as User).name?.charAt(0) || "U"
                  : (task.assignedTo as User)?.name?.charAt(0) || "U"}
              </Avatar>
            </Avatar.Group>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}
