import {
  Avatar,
  Group,
  Stack,
  Text,
  Badge,
  ActionIcon,
  Paper,
  Menu,
  Loader,
} from "@mantine/core";
import { DotsThreeVertical } from "@phosphor-icons/react";
import type { User } from "../../interfaces";

interface MemberListProps {
  members: {
    user: User;
    role: "admin" | "member" | "viewer";
    joinedAt: string;
  }[];
  currentUserId?: string;
  onRemove?: (userId: string) => void;
  onRoleChange?: (userId: string, role: string) => void;
  isOwner?: boolean;
  processingMemberId?: string | null;
}

export default function MemberList({
  members,
  currentUserId,
  onRemove,
  onRoleChange,
  isOwner,
  processingMemberId,
}: MemberListProps) {
  return (
    <Stack gap="sm">
      {members.map((member, index) => {
        const user = member.user;
        const isSelf = user._id === currentUserId;
        // const canManage = isOwner || (currentUserRole === 'admin' && member.role !== 'admin');
        const canManage = isOwner && !isSelf; // Only owner can manage others for now
        const isProcessing = processingMemberId === user._id;

        return (
          <Paper key={index} p="sm" withBorder radius="md">
            <Group justify="space-between">
              <Group gap="sm">
                <Avatar color="blue" radius="xl">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </Avatar>
                <div>
                  <Text size="sm" fw={600}>
                    {user?.name || "Unknown User"} {isSelf && "(You)"}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {user?.email || "N/A"}
                  </Text>
                </div>
              </Group>
              <Group gap="xs">
                <Badge
                  size="sm"
                  variant="light"
                  color={
                    member.role === "admin"
                      ? "blue"
                      : member.role === "viewer"
                        ? "gray"
                        : "green"
                  }
                >
                  {member.role || "Member"}
                </Badge>

                {canManage && (
                  <>
                    {isProcessing ? (
                      <Loader size="xs" />
                    ) : (
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <DotsThreeVertical />
                          </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                          <Menu.Label>Role</Menu.Label>
                          <Menu.Item
                            onClick={() => onRoleChange?.(user._id, "admin")}
                            disabled={member.role === "admin"}
                          >
                            Make Admin
                          </Menu.Item>
                          <Menu.Item
                            onClick={() => onRoleChange?.(user._id, "member")}
                            disabled={member.role === "member"}
                          >
                            Make Member
                          </Menu.Item>
                          <Menu.Item
                            onClick={() => onRoleChange?.(user._id, "viewer")}
                            disabled={member.role === "viewer"}
                          >
                            Make Viewer
                          </Menu.Item>

                          <Menu.Divider />
                          <Menu.Label>Danger zone</Menu.Label>
                          <Menu.Item
                            color="red"
                            onClick={() => onRemove?.(user._id)}
                          >
                            Remove from Team
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    )}
                  </>
                )}
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
