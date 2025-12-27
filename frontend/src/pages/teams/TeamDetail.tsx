import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { teamService } from "../../api";
import { ROUTES } from "../../config/routes";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import MemberList from "../../components/team/MemberList";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users as UsersIcon,
  FolderKanban,
} from "lucide-react";
import type { Team } from "../../interfaces";
import {
  Stack,
  Group,
  Title,
  Text,
  Grid,
  Paper,
  ThemeIcon,
  SimpleGrid,
} from "@mantine/core";
import Card from "../../components/common/Card";

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTeam();
    }
  }, [id]);

  const fetchTeam = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const teamData = await teamService.getTeamById(id);
      setTeam(teamData);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message || "Failed to load team";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm("Are you sure you want to delete this team?")) return;

    try {
      await teamService.deleteTeam(id);
      navigate(ROUTES.TEAMS);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message || "Failed to delete team";
      setError(errorMessage);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading team..." />;
  }

  if (error || !team) {
    return (
      <Stack gap="md">
        <Link to={ROUTES.TEAMS}>
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} />
            <Text span ml={8}>
              Back to Teams
            </Text>
          </Button>
        </Link>
        <Alert type="error">{error || "Team not found"}</Alert>
      </Stack>
    );
  }

  const membersCount = Array.isArray(team.members) ? team.members.length : 0;
  const projectsCount = Array.isArray(team.projects) ? team.projects.length : 0;

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group justify="space-between" align="flex-start">
        <Group align="flex-start">
          <Link to={ROUTES.TEAMS}>
            <Button variant="ghost" size="sm" style={{ paddingLeft: 0 }}>
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <Title order={2} c="primary">
              {team.name}
            </Title>
            <Text c="dimmed">{team.description}</Text>
          </div>
        </Group>
        <Group>
          <Button variant="outline" size="sm">
            <Edit size={14} style={{ marginRight: 6 }} />
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 size={14} style={{ marginRight: 6 }} />
            Delete
          </Button>
        </Group>
      </Group>

      <Grid gutter="xl">
        {/* Main Content */}
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack gap="lg">
            {/* Team Info Cards */}
            <SimpleGrid cols={2}>
              <Card>
                <Stack gap={4} align="center">
                  <ThemeIcon color="blue" variant="light" size="lg">
                    <UsersIcon size={18} />
                  </ThemeIcon>
                  <Text size="xl" fw={700}>
                    {membersCount}
                  </Text>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Members
                  </Text>
                </Stack>
              </Card>
              <Card>
                <Stack gap={4} align="center">
                  <ThemeIcon color="teal" variant="light" size="lg">
                    <FolderKanban size={18} />
                  </ThemeIcon>
                  <Text size="xl" fw={700}>
                    {projectsCount}
                  </Text>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    Projects
                  </Text>
                </Stack>
              </Card>
            </SimpleGrid>

            {/* Members Section */}
            <Card
              title="Team Members"
              action={
                <Button size="xs" variant="ghost">
                  Add Member
                </Button>
              }
            >
              <MemberList members={team.members} />
            </Card>

            {/* Projects Section */}
            {projectsCount > 0 && (
              <Card title="Team Projects">
                <Stack gap="sm">
                  {Array.isArray(team.projects) &&
                    team.projects.map((project, index: number) => {
                      const projectObj =
                        typeof project === "object" ? project : null;
                      const projectId =
                        typeof project === "string" ? project : project._id;
                      return (
                        <Paper
                          key={index}
                          component={Link}
                          to={ROUTES.PROJECT_DETAIL(projectId)}
                          p="md"
                          withBorder
                          radius="md"
                          className="hover:bg-gray-0 transition-colors"
                          style={{ textDecoration: "none" }}
                        >
                          <h3 className="font-medium text-primary">
                            {projectObj?.name || "Unknown Project"}
                          </h3>
                          {projectObj?.description && (
                            <Text size="sm" c="dimmed" lineClamp={1} mt={4}>
                              {projectObj.description}
                            </Text>
                          )}
                        </Paper>
                      );
                    })}
                </Stack>
              </Card>
            )}
          </Stack>
        </Grid.Col>

        {/* Sidebar */}
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack gap="lg">
            <Card title="Quick Actions">
              <Stack gap="sm">
                <Button variant="outline" fullWidth>
                  Invite Members
                </Button>
                <Button variant="outline" fullWidth>
                  Create Project
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
