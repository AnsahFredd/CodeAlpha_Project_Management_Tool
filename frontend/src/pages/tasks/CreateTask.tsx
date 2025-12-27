import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { taskService } from "../../api";
import { ROUTES } from "../../config/routes";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import { ArrowLeft, Calendar, Tag, FolderKanban, X } from "lucide-react";
import { useForm } from "@mantine/form";
import {
  Stack,
  Group,
  Title,
  Text,
  TextInput,
  Textarea,
  Select,
  Box,
  Badge,
  ActionIcon,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import Card from "../../components/common/Card";
import type { Project } from "../../interfaces";

export default function CreateTask() {
  const navigate = useNavigate();
  const { projects, refreshProjects } = useProjects();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: null as Date | null,
      project: "",
      assignedTo: [] as string[],
      tags: [] as string[],
    },
    validate: {
      title: (value) => (value.trim().length > 0 ? null : "Title is required"),
      project: (value) => (value ? null : "Project selection is required"),
    },
  });

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  const handleSubmit = async (values: typeof form.values) => {
    setError(null);
    setIsLoading(true);
    try {
      await taskService.createTask({
        ...values,
        dueDate: values.dueDate?.toISOString(),
      } as Parameters<typeof taskService.createTask>[0]);
      navigate(ROUTES.TASKS);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !form.values.tags.includes(tagInput.trim())) {
      form.setFieldValue("tags", [...form.values.tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setFieldValue(
      "tags",
      form.values.tags.filter((t) => t !== tagToRemove)
    );
  };

  return (
    <Stack gap="lg">
      <Group align="flex-start">
        <Link to={ROUTES.TASKS}>
          <Button variant="ghost" size="sm" style={{ paddingLeft: 0 }}>
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div>
          <Title order={2}>Create New Task</Title>
          <Text c="dimmed">Add a new task to your project</Text>
        </div>
      </Group>

      <Card>
        {error && (
          <Alert type="error" mb="lg">
            {error}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Task Title"
              placeholder="What needs to be done?"
              required
              {...form.getInputProps("title")}
            />

            <Textarea
              label="Description"
              placeholder="Provide more details about this task..."
              rows={4}
              {...form.getInputProps("description")}
            />

            <Group grow align="flex-start">
              <Select
                label="Project"
                placeholder="Select project"
                required
                data={projects.map((p: Project) => ({
                  value: p._id,
                  label: p.name,
                }))}
                {...form.getInputProps("project")}
                leftSection={<FolderKanban size={16} />}
              />

              <DateTimePicker
                label="Due Date"
                placeholder="Pick date and time"
                clearable
                {...form.getInputProps("dueDate")}
                leftSection={<Calendar size={16} />}
              />
            </Group>

            <Group grow align="flex-start">
              <Select
                label="Status"
                data={[
                  { value: "todo", label: "To Do" },
                  { value: "in-progress", label: "In Progress" },
                  { value: "review", label: "Review" },
                  { value: "done", label: "Done" },
                  { value: "blocked", label: "Blocked" },
                ]}
                {...form.getInputProps("status")}
              />

              <Select
                label="Priority"
                data={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "urgent", label: "Urgent" },
                ]}
                {...form.getInputProps("priority")}
              />
            </Group>

            <Box>
              <TextInput
                label="Tags"
                placeholder="Press Enter to add tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.currentTarget.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                rightSection={
                  <ActionIcon variant="light" onClick={addTag}>
                    <Tag size={16} />
                  </ActionIcon>
                }
              />
              {form.values.tags.length > 0 && (
                <Group gap="xs" mt="xs">
                  {form.values.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="light"
                      rightSection={
                        <ActionIcon
                          size="xs"
                          color="blue"
                          radius="xl"
                          variant="transparent"
                          onClick={() => removeTag(tag)}
                        >
                          <X size={10} />
                        </ActionIcon>
                      }
                    >
                      {tag}
                    </Badge>
                  ))}
                </Group>
              )}
            </Box>

            <Group
              justify="flex-end"
              mt="xl"
              pt="md"
              style={{
                borderTop: "1px solid var(--mantine-color-default-border)",
              }}
            >
              <Link to={ROUTES.TASKS}>
                <Button variant="ghost" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" isLoading={isLoading}>
                Create Task
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>
    </Stack>
  );
}
