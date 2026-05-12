"use client";
import { ThemeProvider, ThemeProviderProps } from "next-themes";

export function ClientThemeProvider(props: ThemeProviderProps) {
  return <ThemeProvider {...props} />;
}
