export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex flex-col items-center justify-center my-auto">
            {children}
        </main>
    )
}