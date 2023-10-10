import type { Metadata } from 'next';
import RootStyleRegistry from './providers';
import { cookies } from "next/headers";
import { ColorScheme } from '@mantine/core';

export const metadata: Metadata = {
  title: "User Settings",
}

export default async function RootLayout({ children }: { children: React.ReactElement }) {
  let colorSchemeCookie = cookies().get('color-scheme');
  let colorScheme: ColorScheme | null = null;
  if (colorSchemeCookie !== undefined) {
    colorScheme = colorSchemeCookie.value as ColorScheme
  }
  return (
    <RootStyleRegistry isPageOnly serverColorScheme={colorScheme}>{children}</RootStyleRegistry>
  )
}