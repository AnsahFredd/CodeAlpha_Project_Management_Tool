import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { ROUTES } from "../../config/routes";
import { Plus, Search, Filter } from "lucide-react";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import ProjectCard from "../../components/project/ProjectCard";
import { PROJECT_STATUS_LABELS } from "../../utils/contants";
import type { Project } from "../../interfaces";
import {
  Title,
  Text,
  Group,
  TextInput,
  Select,
  SimpleGrid,
  Stack,
  Paper,
  ThemeIcon,
} from "@mantine/core";

export default function Projects() {
  const { projects, refreshProjects, loading } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(
        (project: Project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (project: Project) => project.status === statusFilter
      );
    }

    return filtered;
  }, [projects, searchTerm, statusFilter]);

  if (loading) {
    return <Loading fullScreen text="Loading projects..." />;
  }

  return (
    <Stack gap="lg" align="stretch">
      {/* Header */}
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2}>Projects</Title>
          <Text c="dimmed">
            Manage and track all your projects in one unified workspace.
          </Text>
        </div>
        <Link to={ROUTES.CREATE_PROJECT}>
          <Button leftSection={<Plus size={16} />}>New Project</Button>
        </Link>
      </Group>

      {/* Filters */}
      <Paper p="md" shadow="sm" withBorder radius="md">
        <Group grow align="flex-start">
          <TextInput
            placeholder="Search projects..."
            leftSection={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
          <Select
            placeholder="Filter by status"
            leftSection={<Filter size={16} />}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value || "all")}
            data={[
              { value: "all", label: "All Status" },
              ...Object.entries(PROJECT_STATUS_LABELS).map(
                ([value, label]) => ({
                  value,
                  label,
                })
              ),
            ]}
          />
        </Group>
      </Paper>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Paper p="xl" withBorder radius="md" ta="center" py={80}>
          <Stack align="center" gap="md">
            <ThemeIcon size={60} radius="xl" variant="light" color="gray">
              <Search size={30} />
            </ThemeIcon>
            <Title order={3} mb="xs">
              No projects found
            </Title>
            <Text c="dimmed" mb="xl" maw={400} mx="auto">
              {projects.length === 0
                ? "You haven't started any projects yet. Let's build something amazing today."
                : "We couldn't find any projects matching your current filters."}
            </Text>
            {projects.length === 0 && (
              <Link to={ROUTES.CREATE_PROJECT}>
                <Button size="md">Create Your First Project</Button>
              </Link>
            )}
          </Stack>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          {filteredProjects.map((project: Project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
