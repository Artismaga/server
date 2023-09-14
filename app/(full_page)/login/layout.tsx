import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
}

export default async function RootLayout({ children }: { children: React.ReactElement }) {
  return (
    <main>
        {children}
    </main>
  )
}