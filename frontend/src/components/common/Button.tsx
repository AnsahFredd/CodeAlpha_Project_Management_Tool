import {
  Button as MantineButton,
  type ButtonProps as MantineButtonProps,
} from "@mantine/core";
import type { ButtonHTMLAttributes, ReactNode } from "react";

// Extend generic button attributes to allow onClick, type='submit', etc.
interface ButtonProps
  extends
    MantineButtonProps,
    Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      "style" | "color" | "children"
    > {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "white";
  isLoading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // Map custom variants to Mantine variants/colors
  const getVariantProps = () => {
    switch (variant) {
      case "primary":
        return { variant: "filled", color: "brand" } as const;
      case "secondary":
        return { variant: "light", color: "brand" } as const;
      case "outline":
        return { variant: "outline", color: "brand" } as const;
      case "ghost":
        return { variant: "subtle", color: "brand" } as const;
      case "danger":
        return { variant: "filled", color: "red" } as const;
      case "white":
        return { variant: "white", color: "brand" } as const;
      default:
        return { variant: "filled", color: "brand" } as const;
    }
  };

  const { variant: mantineVariant, color } = getVariantProps();

  return (
    <MantineButton
      variant={mantineVariant}
      color={color}
      size={size}
      loading={isLoading}
      fullWidth={fullWidth}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </MantineButton>
  );
}
