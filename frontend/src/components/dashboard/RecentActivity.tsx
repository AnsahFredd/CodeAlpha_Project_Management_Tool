import Card from "../common/Card";
import { formatRelativeTime } from "../../utils/formateDate";
import type { Activity } from "../../interfaces";
import { Clock } from "lucide-react";
import {
  Timeline,
  Text,
  Avatar,
  Center,
  ThemeIcon,
  Group,
} from "@mantine/core";

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <Card title="Recent Activity" className="h-full">
        <Center h={200} display="flex" style={{ flexDirection: "column" }}>
          <ThemeIcon size="xl" radius="xl" color="gray" variant="light" mb="md">
            <Clock size="1.5rem" />
          </ThemeIcon>
          <Text fw={500} c="dimmed">
            No recent activity
          </Text>
          <Text size="sm" c="dimmed">
            Your timeline is empty for now.
          </Text>
        </Center>
      </Card>
    );
  }

  return (
    <Card
      title={
        <Group gap="xs">
          <Clock size="1.2rem" className="text-primary" />
          <Text>Recent Activity</Text>
        </Group>
      }
      className="h-full"
    >
      <Timeline active={activities.length} bulletSize={32} lineWidth={2}>
        {activities.map((activity) => (
          <Timeline.Item
            key={activity._id}
            bullet={
              <Avatar size={32} radius="xl" color="blue">
                {activity.user.name.charAt(0).toUpperCase()}
              </Avatar>
            }
          >
            <Text size="sm">
              <Text span fw={600} inherit>
                {activity.user.name}
              </Text>{" "}
              {activity.description}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              {formatRelativeTime(activity.createdAt)}
            </Text>
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );
}
