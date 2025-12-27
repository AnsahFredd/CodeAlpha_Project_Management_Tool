import { Alert as MantineAlert, type AlertProps } from "@mantine/core";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

interface CustomAlertProps extends Omit<AlertProps, "title" | "children"> {
  type?: "success" | "error" | "warning" | "info";
  title?: ReactNode;
  children: ReactNode;
  onClose?: () => void;
  dismissible?: boolean;
}

export default function Alert({
  type = "info",
  title,
  children,
  onClose,
  dismissible = false,
  className = "",
  ...props
}: CustomAlertProps) {
  const getAlertProps = () => {
    switch (type) {
      case "success":
        return { color: "green", icon: <CheckCircle size="1.1rem" /> };
      case "error":
        return { color: "red", icon: <AlertCircle size="1.1rem" /> };
      case "warning":
        return { color: "orange", icon: <AlertTriangle size="1.1rem" /> };
      case "info":
      default:
        return { color: "blue", icon: <Info size="1.1rem" /> };
    }
  };

  const { color, icon } = getAlertProps();

  return (
    <MantineAlert
      title={title}
      color={color}
      icon={icon}
      withCloseButton={dismissible}
      onClose={onClose}
      className={className}
      radius="md"
      variant="light"
      {...props}
    >
      {children}
    </MantineAlert>
  );
}
