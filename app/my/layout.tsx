import authenticatePage from "@/app/api/authenticatePage";

export default async function RootLayout({ children }: { children: React.ReactElement }) {
    await authenticatePage(true);
    return (
        <>
            {children}
        </>
    )
}