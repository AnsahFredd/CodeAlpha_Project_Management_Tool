import {
  Card as MantineCard,
  Text,
  Group,
  Box,
  type CardProps as MantineCardProps,
  useMantineTheme,
} from "@mantine/core";
import { type ReactNode } from "react";

interface CustomCardProps extends Omit<MantineCardProps, "children" | "title"> {
  children: ReactNode;
  noPadding?: boolean;
  title?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  hover?: boolean;
  onClick?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}

export default function Card({
  children,
  className = "",
  noPadding = false,
  title,
  action,
  footer,
  onClick,
  hover = false,
  padding = "md",
  ...others
}: CustomCardProps) {
  const theme = useMantineTheme();

  return (
    <MantineCard
      padding={noPadding ? 0 : padding}
      radius="md"
      withBorder
      shadow="sm"
      className={`${hover || onClick ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200" : ""} ${className}`}
      onClick={onClick}
      {...others}
    >
      {(title || action) && (
        <MantineCard.Section withBorder inheritPadding py="xs">
          <Group justify="space-between">
            {title && (
              <Box>
                {typeof title === "string" ? (
                  <Text fw={600} size="lg" c="text.primary">
                    {title}
                  </Text>
                ) : (
                  title
                )}
              </Box>
            )}
            {action && <Box>{action}</Box>}
          </Group>
        </MantineCard.Section>
      )}

      {children}

      {footer && (
        <MantineCard.Section
          withBorder
          inheritPadding
          py="sm"
          bg="var(--bg-tertiary)"
          c="dimmed"
          style={{ fontSize: theme.fontSizes.sm }}
        >
          {footer}
        </MantineCard.Section>
      )}
    </MantineCard>
  );
}
