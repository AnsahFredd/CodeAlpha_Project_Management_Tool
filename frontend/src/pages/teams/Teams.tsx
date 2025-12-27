import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { teamService } from "../../api";
import { ROUTES } from "../../config/routes";
import Button from "../../components/common/Button";
import Loading from "../../components/common/Loading";
import { Plus, Users } from "lucide-react";
import {
  Stack,
  Group,
  Title,
  Text,
  SimpleGrid,
  Paper,
  ThemeIcon,
  Avatar,
  Badge,
  Box,
} from "@mantine/core";
import type { Team } from "../../interfaces";
import Card from "../../components/common/Card";

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const data = await teamService.getAllTeams();
      setTeams(data);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen text="Loading teams..." />;
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end">
        <div>
          <Title order={2}>Teams</Title>
          <Text c="dimmed">Collaborate with your project members</Text>
        </div>
        <Link to={ROUTES.CREATE_TEAM}>
          <Button leftSection={<Plus size={16} />}>Create Team</Button>
        </Link>
      </Group>

      {teams.length === 0 ? (
        <Paper p="xl" withBorder radius="md" ta="center" py={80}>
          <Stack align="center">
            <ThemeIcon size={60} radius="xl" variant="light" color="gray">
              <Users size={30} />
            </ThemeIcon>
            <Title order={3}>No teams yet</Title>
            <Text c="dimmed" mb="xl">
              Start collaborating by creating your first team.
            </Text>
            <Link to={ROUTES.CREATE_TEAM}>
              <Button size="md">Create Team</Button>
            </Link>
          </Stack>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {teams.map((team) => (
            <Box
              key={team._id}
              component={Link}
              to={ROUTES.TEAM_DETAIL(team._id)}
              style={{ textDecoration: "none" }}
            >
              <Card hover padding="lg" className="h-full">
                <Stack gap="md" h="100%">
                  <Group justify="space-between" wrap="nowrap">
                    <Group gap="sm" wrap="nowrap">
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="light"
                        color="blue"
                      >
                        <Users size={18} />
                      </ThemeIcon>
                      <Text fw={700} size="lg" lineClamp={1} c="text.primary">
                        {team.name}
                      </Text>
                    </Group>
                    <Badge variant="light">{team.members.length} members</Badge>
                  </Group>

                  <Text size="sm" c="dimmed" lineClamp={2} style={{ flex: 1 }}>
                    {team.description}
                  </Text>

                  <Group mt="auto" align="center">
                    <Text size="xs" fw={700} tt="uppercase" c="dimmed">
                      Created By:
                    </Text>
                    <Group gap={6}>
                      <Avatar size="xs" radius="xl" color="blue">
                        {typeof team.createdBy === "object"
                          ? team.createdBy.name.charAt(0)
                          : "U"}
                      </Avatar>
                      <Text size="xs" fw={600}>
                        {typeof team.createdBy === "object"
                          ? team.createdBy.name
                          : "Unknown"}
                      </Text>
                    </Group>
                  </Group>
                </Stack>
              </Card>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
