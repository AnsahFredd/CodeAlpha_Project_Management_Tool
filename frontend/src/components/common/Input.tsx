import { TextInput, type TextInputProps } from "@mantine/core";
import type { ChangeEvent, FocusEvent } from "react";

// Combine Mantine props with generic HTML input props if needed, but Mantine handles most
interface CustomInputProps extends Omit<TextInputProps, "onChange" | "onBlur"> {
  helperText?: string;
  fullWidth?: boolean;
  // Re-define events if necessary for compatibility with standard React events
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}

export default function Input({
  label,
  error,
  helperText,
  fullWidth = true,
  className = "",
  onChange,
  onBlur,
  ...props
}: CustomInputProps) {
  return (
    <TextInput
      label={label}
      error={error}
      description={helperText}
      w={fullWidth ? "100%" : "auto"}
      className={className}
      onChange={onChange}
      onBlur={onBlur}
      radius="md"
      {...props}
    />
  );
}
