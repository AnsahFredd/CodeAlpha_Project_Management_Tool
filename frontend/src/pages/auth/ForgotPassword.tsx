import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../config/routes";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import { Mail, ArrowLeft } from "lucide-react";
import {
  Stack,
  TextInput,
  Title,
  Text,
  Paper,
  Box,
  Group,
} from "@mantine/core";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, var(--mantine-color-blue-0) 0%, var(--mantine-color-indigo-0) 100%)",
      }}
    >
      <Paper
        shadow="xl"
        p={40}
        radius="lg"
        withBorder
        style={{ width: "100%", maxWidth: 440 }}
      >
        <Stack gap="xl">
          <Box ta="center">
            <Title order={1} fw={900} c="blue.7">
              Forgot Password
            </Title>
            <Text c="dimmed" mt={8}>
              Enter your email to receive a reset link
            </Text>
          </Box>

          {submitted ? (
            <Stack gap="md">
              <Alert type="success">
                If an account exists for {email}, you will receive a password
                reset link shortly.
              </Alert>
              <Link to={ROUTES.LOGIN} style={{ textDecoration: "none" }}>
                <Button variant="outline" fullWidth>
                  Back to Login
                </Button>
              </Link>
            </Stack>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                {error && (
                  <Alert
                    type="error"
                    onClose={() => setError(null)}
                    dismissible
                  >
                    {error}
                  </Alert>
                )}

                <TextInput
                  label="Email Address"
                  placeholder="your@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  leftSection={<Mail size={16} />}
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={isLoading}
                  variant="ghost"
                  mt="md"
                >
                  Send Reset Link
                </Button>

                <Group justify="center">
                  <Link
                    to={ROUTES.LOGIN}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "var(--mantine-color-dimmed)",
                      textDecoration: "none",
                      fontSize: "var(--mantine-font-size-sm)",
                    }}
                    className="hover:text-primary transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </Link>
                </Group>
              </Stack>
            </form>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
