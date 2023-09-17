import type { Metadata } from 'next';
import RootStyleRegistry from '@/app/providers';
import { cookies } from "next/headers";
import { ColorScheme } from '@mantine/core';

export const metadata: Metadata = {
  title: {absolute: 'Artismaga', template: '%s - Artismaga'},
  description: 'A federated platform for publishing and consuming content.',
}

export default async function RootLayout({ children }: { children: React.ReactElement }) {
  let colorSchemeCookie = cookies().get('color-scheme');
  let colorScheme: ColorScheme | null = null;
  if (colorSchemeCookie !== undefined) {
    colorScheme = colorSchemeCookie.value as ColorScheme
  }
  return (
    <html lang="en">
      <body>
        <RootStyleRegistry isPageOnly serverColorScheme={colorScheme}>{children}</RootStyleRegistry>
      </body>
    </html>
  )
}