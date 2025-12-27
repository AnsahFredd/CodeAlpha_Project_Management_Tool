import {
  Grid,
  SimpleGrid,
  Stack,
  Title,
  Text,
  Paper,
  Group,
  ThemeIcon,
  Button,
} from "@mantine/core";
import {
  LayoutGrid,
  CheckSquare,
  Users,
  Clock,
  ArrowRight,
  Plus,
  Calendar,
} from "lucide-react";
import StatsCard from "../../components/dashboard/StatsCard";
import ProjectChart from "../../components/dashboard/ProjectChart";
import { Link } from "react-router-dom";
import { ROUTES } from "../../config/routes";
import { useEffect, useState } from "react";
import { dashboardService, projectService } from "../../api";
import Loading from "../../components/common/Loading";
import type { DashboardStats, Project } from "../../interfaces";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, projectsData] = await Promise.all([
        dashboardService.getStats(),
        projectService.getAllProjects(),
      ]);
      setStats(statsData);
      setProjects(projectsData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <Loading fullScreen text="Loading dashboard data..." />;
  }

  return (
    <Stack gap="xl">
      {/* Welcome Section */}
      <Paper
        p="xl"
        radius="lg"
        bg="blue.7"
        style={{
          color: "white",
          backgroundImage:
            "linear-gradient(45deg, var(--mantine-color-blue-7) 0%, var(--mantine-color-indigo-7) 100%)",
        }}
      >
        <Group justify="space-between">
          <Stack gap={4}>
            <Title order={1}>Welcome back!</Title>
            <Text size="lg" opacity={0.9}>
              Here's what's happening in your projects today.
            </Text>
          </Stack>
          <Group>
            <Link to={ROUTES.CREATE_PROJECT}>
              <Button
                variant="white"
                color="blue"
                leftSection={<Plus size={18} />}
              >
                New Project
              </Button>
            </Link>
          </Group>
        </Group>
      </Paper>

      {/* Stats Overview */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
        <StatsCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={LayoutGrid}
          color="blue"
          description="Projects currently in progress"
          trend={{ value: 12, label: "vs last month" }}
        />
        <StatsCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={CheckSquare}
          color="teal"
          description="Tasks across all projects"
          trend={{ value: 5, label: "vs last week" }}
        />
        <StatsCard
          title="Team Members"
          value={stats.totalTeams}
          icon={Users}
          color="indigo"
          description="Collaborators in your workspace"
        />
        <StatsCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon={Clock}
          color="orange"
          description="Tasks awaiting completion"
        />
      </SimpleGrid>

      <Grid gutter="xl">
        {/* Project Distribution Chart */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <ProjectChart projects={projects} />
        </Grid.Col>

        {/* Recent Activity */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Paper
            p="xl"
            withBorder
            radius="lg"
            shadow="sm"
            style={{ height: "100%" }}
          >
            <Group justify="space-between" mb="xl">
              <Title order={3}>Recent Activity</Title>
              <Button
                variant="subtle"
                size="sm"
                rightSection={<ArrowRight size={16} />}
              >
                View All
              </Button>
            </Group>

            <Stack gap="lg">
              {stats.recentActivity.length === 0 ? (
                <Text ta="center" py="xl" c="dimmed">
                  No recent activity
                </Text>
              ) : (
                stats.recentActivity.map((activity: any) => (
                  <Group key={activity._id} align="flex-start" wrap="nowrap">
                    <ThemeIcon
                      color="blue"
                      variant="light"
                      radius="xl"
                      size="md"
                    >
                      <Calendar size={14} />
                    </ThemeIcon>
                    <Stack gap={2}>
                      <Text size="sm" fw={600}>
                        {activity.user?.name || "Someone"}{" "}
                        {activity.description}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {new Date(activity.createdAt).toLocaleDateString()} at{" "}
                        {new Date(activity.createdAt).toLocaleTimeString()}
                      </Text>
                    </Stack>
                  </Group>
                ))
              )}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Quick Access Area */}
      <Stack gap="md">
        <Title order={3}>Quick Access</Title>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
          <Paper
            p="lg"
            withBorder
            radius="md"
            className="hover:border-blue-500 transition-colors"
          >
            <Stack gap="sm">
              <ThemeIcon color="blue" size="lg" radius="md">
                <CheckSquare size={20} />
              </ThemeIcon>
              <Title order={4}>Tasks</Title>
              <Text size="sm" c="dimmed">
                Manage your personal tasks and assigned work items.
              </Text>
              <Link to={ROUTES.TASKS}>
                <Button
                  variant="subtle"
                  p={0}
                  rightSection={<ArrowRight size={14} />}
                >
                  Go to Tasks
                </Button>
              </Link>
            </Stack>
          </Paper>

          <Paper
            p="lg"
            withBorder
            radius="md"
            className="hover:border-indigo-500 transition-colors"
          >
            <Stack gap="sm">
              <ThemeIcon color="indigo" size="lg" radius="md">
                <LayoutGrid size={20} />
              </ThemeIcon>
              <Title order={4}>Projects</Title>
              <Text size="sm" c="dimmed">
                View status and updates for all active projects.
              </Text>
              <Link to={ROUTES.PROJECTS}>
                <Button
                  variant="subtle"
                  p={0}
                  rightSection={<ArrowRight size={14} />}
                >
                  Go to Projects
                </Button>
              </Link>
            </Stack>
          </Paper>

          <Paper
            p="lg"
            withBorder
            radius="md"
            className="hover:border-teal-500 transition-colors"
          >
            <Stack gap="sm">
              <ThemeIcon color="teal" size="lg" radius="md">
                <Users size={20} />
              </ThemeIcon>
              <Title order={4}>Teams</Title>
              <Text size="sm" c="dimmed">
                Collaborate with your team members and managers.
              </Text>
              <Link to={ROUTES.TEAMS}>
                <Button
                  variant="subtle"
                  p={0}
                  rightSection={<ArrowRight size={14} />}
                >
                  Go to Teams
                </Button>
              </Link>
            </Stack>
          </Paper>
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
