"use client";
import { ThemeProvider } from "next-themes";
import { ComponentProps } from "react";

export function ClientThemeProvider(props: ComponentProps<typeof ThemeProvider>) {
  return <ThemeProvider {...props} />;
}
