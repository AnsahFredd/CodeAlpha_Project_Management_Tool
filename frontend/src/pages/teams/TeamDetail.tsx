import { useEffect, useState, useCallback } from "react";
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
import type { Project, Team } from "../../interfaces";
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
import { notifications } from "@mantine/notifications";
import Card from "../../components/common/Card";
import AddMemberModal from "../../components/team/AddMemberModal";
import InviteMemberModal from "../../components/team/InviteMemberModal";
import { useAuth } from "../../hooks/useAuth";

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, loading: authLoading } = useAuth();

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Operation loading states
  const [processingMemberId, setProcessingMemberId] = useState<string | null>(
    null
  );

  // Modals state
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [inviteMemberOpen, setInviteMemberOpen] = useState(false);

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate(ROUTES.LOGIN);
    }
  }, [currentUser, authLoading, navigate]);

  const fetchTeam = useCallback(async () => {
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
  }, [id]);

  // Re-fetch function
  const refreshTeam = useCallback(() => {
    fetchTeam();
  }, [fetchTeam]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const handleDelete = async () => {
    if (!id || !confirm("Are you sure you want to delete this team?")) return;

    try {
      await teamService.deleteTeam(id);
      notifications.show({
        title: "Success",
        message: "Team deleted successfully",
        color: "green",
      });
      navigate(ROUTES.TEAMS);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message || "Failed to delete team";
      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
      });
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!id || !confirm("Remove this member?")) return;

    setProcessingMemberId(userId);
    try {
      await teamService.removeMember(id, userId);
      notifications.show({
        title: "Success",
        message: "Member removed successfully",
        color: "green",
      });
      refreshTeam();
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error).message ||
        "Failed to remove member";
      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
      });
    } finally {
      setProcessingMemberId(null);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    if (!id) return;

    setProcessingMemberId(userId);
    try {
      await teamService.updateMemberRole(id, userId, role);
      notifications.show({
        title: "Success",
        message: "Role updated successfully",
        color: "green",
      });
      refreshTeam();
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ||
        (err as Error).message ||
        "Failed to update role";
      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
      });
    } finally {
      setProcessingMemberId(null);
    }
  };

  if (loading || authLoading) {
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

  const isOwner =
    team?.owner?._id && currentUser?._id
      ? team.owner._id === currentUser._id
      : false;

  return (
    <Stack gap={40}>
      <AddMemberModal
        opened={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        teamId={team._id}
        onSuccess={refreshTeam}
      />
      <InviteMemberModal
        opened={inviteMemberOpen}
        onClose={() => setInviteMemberOpen(false)}
        teamId={team._id}
        onSuccess={refreshTeam}
      />

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
          {isOwner && (
            <>
              <Button variant="outline" size="sm">
                <Edit size={14} style={{ marginRight: 6 }} />
                Edit
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                <Trash2 size={14} style={{ marginRight: 6 }} />
                Delete
              </Button>
            </>
          )}
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
                isOwner && (
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => setAddMemberOpen(true)}
                  >
                    Add Member
                  </Button>
                )
              }
            >
              <MemberList
                members={team.members}
                currentUserId={currentUser?._id}
                isOwner={isOwner}
                onRemove={handleRemoveMember}
                onRoleChange={handleRoleChange}
                processingMemberId={processingMemberId}
              />
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
                        typeof project === "string"
                          ? project
                          : (project as unknown as Project)._id;
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
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setInviteMemberOpen(true)}
                >
                  Invite Members
                </Button>
                <Link to={ROUTES.CREATE_PROJECT}>
                  <Button variant="outline" fullWidth>
                    Create Project
                  </Button>
                </Link>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
