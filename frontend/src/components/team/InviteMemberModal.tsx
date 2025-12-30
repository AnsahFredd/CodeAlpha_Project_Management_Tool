import { useState } from "react";
import {
  Modal,
  TextInput,
  Select,
  Button,
  Stack,
  Group,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { teamService } from "../../api";
import Alert from "../common/Alert";

interface InviteMemberModalProps {
  opened: boolean;
  onClose: () => void;
  teamId: string;
  onSuccess: () => void;
}

export default function InviteMemberModal({
  opened,
  onClose,
  teamId,
  onSuccess,
}: InviteMemberModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
    setSuccessMsg(null);
    try {
      await teamService.inviteMember(teamId, values);
      setSuccessMsg(`Invitation sent to ${values.email}`);
      setTimeout(() => {
        onSuccess();
        onClose();
        form.reset();
        setSuccessMsg(null);
      }, 2000);
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to invite member";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Invite New Member">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {error && <Alert type="error">{error}</Alert>}
          {successMsg && <Alert type="success">{successMsg}</Alert>}

          <Text size="sm" c="dimmed">
            Send an email invitation to someone who isn't on the platform yet.
          </Text>

          <TextInput
            label="Email Address"
            placeholder="newuser@example.com"
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
              Send Invitation
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
