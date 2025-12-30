import {
  AppShell,
  Burger,
  Group,
  Text,
  // Avatar,
  // Menu,
  // RemovablePasswordInput,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import { ProjectProvider } from "../../context/ProjectContext";
import { Moon, Sun } from "lucide-react";

export default function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <ProjectProvider>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between">
            <Group>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              <div className="flex items-center gap-2">
                {/* Placeholder for Logo if needed */}
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <Text fw={700} size="xl" visibleFrom="xs">
                  ProjectMgr
                </Text>
              </div>
            </Group>

            <Group>
              <ActionIcon
                variant="default"
                size="lg"
                onClick={() =>
                  setColorScheme(
                    computedColorScheme === "light" ? "dark" : "light"
                  )
                }
                aria-label="Toggle color scheme"
              >
                <Sun
                  className={
                    computedColorScheme === "dark" ? "hidden" : "block"
                  }
                  size="1.2rem"
                />
                <Moon
                  className={
                    computedColorScheme === "light" ? "hidden" : "block"
                  }
                  size="1.2rem"
                />
              </ActionIcon>
              {/* User Menu could go here */}
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <Sidebar onClose={toggle} />
        </AppShell.Navbar>

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    </ProjectProvider>
  );
}
