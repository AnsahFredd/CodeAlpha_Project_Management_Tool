import {
  Avatar,
  Group,
  Stack,
  Text,
  Badge,
  Button,
  Paper,
} from "@mantine/core";
import type { User } from "../../interfaces";

interface MemberListProps {
  members: (string | User)[];
}

export default function MemberList({ members }: MemberListProps) {
  return (
    <Stack gap="sm">
      {members.map((member, index) => {
        const user = typeof member === "object" ? member : null;
        return (
          <Paper key={index} p="sm" withBorder radius="md">
            <Group justify="space-between">
              <Group gap="sm">
                <Avatar color="blue" radius="xl">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </Avatar>
                <div>
                  <Text size="sm" fw={600}>
                    {user?.name || "Unknown User"}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {user?.email || "N/A"}
                  </Text>
                </div>
              </Group>
              <Group gap="xs">
                <Badge size="sm" variant="light">
                  Member
                </Badge>
                <Button variant="subtle" size="xs" color="red">
                  Remove
                </Button>
              </Group>
            </Group>
          </Paper>
        );
      })}
      {members.length === 0 && (
        <Text ta="center" c="dimmed" py="xl">
          No members found
        </Text>
      )}
    </Stack>
  );
}
