import { Component, type ErrorInfo, type ReactNode } from "react";
import { Stack, Title, Text, Button, Paper } from "@mantine/core";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Paper p="xl" withBorder radius="md">
          <Stack align="center" gap="md">
            <AlertCircle size={48} color="red" />
            <Title order={3}>Something went wrong</Title>
            <Text c="dimmed" ta="center">
              We're sorry, but an unexpected error occurred.
              {this.state.error && (
                <Text size="sm" mt="xs" c="red">
                  {this.state.error.message}
                </Text>
              )}
            </Text>
            <Button
              variant="light"
              color="blue"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </Stack>
        </Paper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
