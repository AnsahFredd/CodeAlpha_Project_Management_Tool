import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../config/routes";
import Button from "../../components/common/Button";
import Alert from "../../components/common/Alert";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import {
  Stack,
  TextInput,
  PasswordInput,
  Title,
  Text,
  Paper,
  Box,
} from "@mantine/core";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
              Create Account
            </Title>
            <Text c="dimmed" mt={8}>
              Start managing your projects with ease
            </Text>
          </Box>

          {error && (
            <Alert type="error" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="Full Name"
                placeholder="John Doe"
                name="name"
                value={formData.name}
                onChange={handleChange}
                leftSection={<User size={16} />}
                required
              />

              <TextInput
                label="Email"
                placeholder="your@email.com"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                leftSection={<Mail size={16} />}
                required
              />

              <PasswordInput
                label="Password"
                placeholder="Min 6 characters"
                name="password"
                value={formData.password}
                onChange={handleChange}
                leftSection={<Lock size={16} />}
                required
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Repeat password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                leftSection={<Lock size={16} />}
                required
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
                rightSection={<ArrowRight size={18} />}
                mt="lg"
              >
                Sign Up
              </Button>
            </Stack>
          </form>

          <Text ta="center" size="sm" c="dimmed">
            Already have an account?{" "}
            <Link
              to={ROUTES.LOGIN}
              style={{
                color: "var(--mantine-color-blue-6)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign In
            </Link>
          </Text>
        </Stack>
      </Paper>
    </Box>
  );
}
