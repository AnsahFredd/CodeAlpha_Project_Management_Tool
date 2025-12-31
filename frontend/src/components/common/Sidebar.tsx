import { NavLink, Stack, Text, Box } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
} from "lucide-react";
import { ROUTES } from "../../config/routes";
import { useAuth } from "../../hooks/useAuth";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  useAuth(); 
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      path: ROUTES.DASHBOARD,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      path: ROUTES.PROJECTS,
      label: "Projects",
      icon: FolderKanban,
    },
    {
      path: ROUTES.TASKS,
      label: "Tasks",
      icon: CheckSquare,
    },
    {
      path: ROUTES.TEAMS,
      label: "Teams",
      icon: Users,
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <Stack h="100%" justify="space-between">
      <Stack gap="xs">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            label={item.label}
            leftSection={<item.icon size="1.2rem" strokeWidth={1.5} />}
            active={
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`)
            }
            onClick={() => handleNavigate(item.path)}
            variant="light"
            autoContrast
          />
        ))}
      </Stack>

      <Stack
        gap="xs"
        pt="md"
        style={{ borderTop: "1px solid var(--mantine-color-default-border)" }}
      >
        <NavLink
          label="Settings"
          leftSection={<Settings size="1.2rem" strokeWidth={1.5} />}
          active={location.pathname === ROUTES.PROFILE}
          onClick={() => handleNavigate(ROUTES.PROFILE)}
          variant="light"
        />

        <Box
          p="sm"
          bg="gray.1"
          style={{ borderRadius: "var(--mantine-radius-md)" }}
        >
          <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb={4}>
            Alpha Plan
          </Text>
          <Text size="xs" c="dimmed" lh={1.2}>
            Pro features coming soon.
          </Text>
        </Box>
      </Stack>
    </Stack>
  );
}
