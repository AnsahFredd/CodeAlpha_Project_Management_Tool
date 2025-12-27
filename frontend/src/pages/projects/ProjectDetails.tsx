import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { projectService } from "../../api";
import { taskService } from "../../api";
import { ROUTES } from "../../config/routes";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import ProjectDetails from "../../components/project/ProjectDetails";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import type { Project, Task } from "../../interfaces";
import { Stack, Group, Title, Text } from "@mantine/core";

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const [projectData, tasksData] = await Promise.all([
        projectService.getProjectById(id),
        taskService.getAllTasks(id),
      ]);
      setProject(projectData);
      setTasks(tasksData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id, fetchProject]);

  const handleDelete = async () => {
    if (!id || !confirm("Are you sure you want to delete this project?"))
      return;

    try {
      await projectService.deleteProject(id);
      navigate(ROUTES.PROJECTS);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete project");
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading project..." />;
  }

  if (error || !project) {
    return (
      <Stack gap="md">
        <Link to={ROUTES.PROJECTS}>
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} style={{ marginRight: 8 }} />
            Back to Projects
          </Button>
        </Link>
        <Alert type="error">{error || "Project not found"}</Alert>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between" align="flex-start">
        <Group align="flex-start">
          <Link to={ROUTES.PROJECTS}>
            <Button variant="ghost" size="sm" style={{ paddingLeft: 0 }}>
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <Title order={2} c="primary">
              {project.name}
            </Title>
            <Text c="dimmed">{project.description}</Text>
          </div>
        </Group>
        <Group>
          <Link to={`${ROUTES.PROJECTS}/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit size={14} style={{ marginRight: 6 }} />
              Edit
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 size={14} style={{ marginRight: 6 }} />
            Delete
          </Button>
        </Group>
      </Group>

      {/* Project Details Component */}
      <ProjectDetails project={project} tasks={tasks} onUpdate={fetchProject} />
    </Stack>
  );
}
