import { Text, Group, ThemeIcon, Stack } from "@mantine/core";
import type { LucideIcon } from "lucide-react";
import Card from "../common/Card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  trend?: {
    value: number;
    label: string;
  };
  color?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  color = "blue",
}: StatsCardProps) {
  return (
    <Card padding="md">
      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Text size="xs" fw={700} tt="uppercase" c="dimmed">
            {title}
          </Text>
          <ThemeIcon color={color} variant="light" size="lg" radius="md">
            <Icon size={20} />
          </ThemeIcon>
        </Group>

        <Group align="flex-end" gap="xs">
          <Text size="xl" fw={900}>
            {value}
          </Text>
          {trend && (
            <Text
              size="xs"
              c={trend.value >= 0 ? "teal" : "red"}
              fw={700}
              mb={4}
            >
              {trend.value >= 0 ? "+" : ""}
              {trend.value}%
            </Text>
          )}
        </Group>

        <Text size="xs" c="dimmed">
          {description}
        </Text>
      </Stack>
    </Card>
  );
}
