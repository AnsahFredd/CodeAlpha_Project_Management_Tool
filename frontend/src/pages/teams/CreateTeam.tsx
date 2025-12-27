import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ROUTES } from "../../config/routes";
import { teamService } from "../../api";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import { ArrowLeft } from "lucide-react";
import { useForm } from "@mantine/form";
import { Stack, Group, Title, Text, TextInput, Textarea } from "@mantine/core";
import Card from "../../components/common/Card";

export default function CreateTeam() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      members: [] as string[],
    },
    validate: {
      name: (value) =>
        value.trim().length > 0 ? null : "Team name is required",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setError(null);
    setIsLoading(true);
    try {
      await teamService.createTeam(
        values as Parameters<typeof teamService.createTeam>[0]
      );
      navigate(ROUTES.TEAMS);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create team. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack gap="lg">
      {/* Header */}
      <Group align="flex-start" gap="md">
        <Link to={ROUTES.TEAMS}>
          <Button variant="ghost" size="sm" style={{ paddingLeft: 0 }}>
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div>
          <Title order={2}>Create New Team</Title>
          <Text c="dimmed">Form a new team to collaborate</Text>
        </div>
      </Group>

      {/* Form */}
      <Card>
        {error && (
          <Alert
            type="error"
            onClose={() => setError(null)}
            dismissible
            className="mb-6"
          >
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Team Name"
              placeholder="Enter team name"
              required
              {...form.getInputProps("name")}
            />

            <Textarea
              label="Description"
              placeholder="Enter team description"
              rows={4}
              {...form.getInputProps("description")}
            />

            <Group
              justify="flex-end"
              mt="xl"
              pt="md"
              style={{
                borderTop: "1px solid var(--mantine-color-default-border)",
              }}
            >
              <Link to={ROUTES.TEAMS}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" isLoading={isLoading}>
                Create Team
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}
