import { useState } from "react";
import { Modal, TextInput, Select, Button, Stack, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { teamService } from "../../api";
import Alert from "../common/Alert";

interface AddMemberModalProps {
  opened: boolean;
  onClose: () => void;
  teamId: string;
  onSuccess: () => void;
}

export default function AddMemberModal({
  opened,
  onClose,
  teamId,
  onSuccess,
}: AddMemberModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: "",
      role: "member",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);
    try {
      await teamService.addMember(teamId, values);
      onSuccess();
      onClose();
      form.reset();
    } catch (err) {
      // If user not found, suggest inviting them?
      // For now just show error.
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to add member";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add Team Member">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {error && <Alert type="error">{error}</Alert>}
          <TextInput
            label="Email Address"
            placeholder="user@example.com"
            required
            {...form.getInputProps("email")}
          />
          <Select
            label="Role"
            data={[
              { value: "admin", label: "Admin" },
              { value: "member", label: "Member" },
              { value: "viewer", label: "Viewer" },
            ]}
            {...form.getInputProps("role")}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Add Member
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
