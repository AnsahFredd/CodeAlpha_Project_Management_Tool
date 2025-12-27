import Card from "../common/Card";
import type { Project } from "../../interfaces";
import { PROJECT_STATUS } from "../../utils/contants";
import { Progress, Text, Group, Stack, ColorSwatch, Box } from "@mantine/core";

interface ProjectChartProps {
  projects: Project[];
}

export default function ProjectChart({ projects }: ProjectChartProps) {
  const statusCounts = {
    planning: projects.filter((p) => p.status === PROJECT_STATUS.PLANNING)
      .length,
    active: projects.filter((p) => p.status === PROJECT_STATUS.ACTIVE).length,
    "on-hold": projects.filter((p) => p.status === PROJECT_STATUS.ON_HOLD)
      .length,
    completed: projects.filter((p) => p.status === PROJECT_STATUS.COMPLETED)
      .length,
    cancelled: projects.filter((p) => p.status === PROJECT_STATUS.CANCELLED)
      .length,
  };

  const total = projects.length;

  const statusColors = {
    planning: "cyan",
    active: "green",
    "on-hold": "yellow",
    completed: "blue",
    cancelled: "red",
  };

  const statusLabels = {
    planning: "Planning",
    active: "Active",
    "on-hold": "On Hold",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <Card title="Projects by Status">
      {total === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          No projects yet
        </Text>
      ) : (
        <Stack gap="md">
          {Object.entries(statusCounts).map(([status, count]) => {
            if (count === 0) return null;
            const percentage = (count / total) * 100;
            const color = statusColors[status as keyof typeof statusColors];

            return (
              <Box key={status}>
                <Group justify="space-between" mb={5}>
                  <Group gap="xs">
                    <ColorSwatch
                      color={`var(--mantine-color-${color}-filled)`}
                      size={10}
                    />
                    <Text size="sm" fw={500}>
                      {statusLabels[status as keyof typeof statusLabels]}
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <Text size="sm" fw={600}>
                      {count}
                    </Text>
                    <Text size="xs" c="dimmed">
                      ({percentage.toFixed(0)}%)
                    </Text>
                  </Group>
                </Group>
                <Progress
                  value={percentage}
                  color={color}
                  size="sm"
                  radius="xl"
                />
              </Box>
            );
          })}
        </Stack>
      )}
    </Card>
  );
}
