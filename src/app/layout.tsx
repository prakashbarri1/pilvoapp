import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { FilePenLine, Eye, Pencil } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlivoApp — Collaborative Notes",
  description: "Realtime collaborative note taking",
};

function SignedInLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="flex w-64 flex-col border-r bg-card">
        <div className="flex h-14 items-center gap-2 border-b px-6">
          <FilePenLine className="h-5 w-5 text-primary" />
          <span className="font-semibold tracking-tight">PlivoApp</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <a href="/notes/create" className="sidebar-link">
            <FilePenLine className="h-4 w-4" />
            Create Note
          </a>
          <a href="/notes/view" className="sidebar-link">
            <Eye className="h-4 w-4" />
            View Notes
          </a>
          <a href="/notes/edit" className="sidebar-link">
            <Pencil className="h-4 w-4" />
            Edit Notes
          </a>
        </nav>
        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
            <UserButton showName={true} />
          </div>
        </div>
      </aside>
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b bg-card px-6">
          <h1 className="text-lg font-semibold tracking-tight">
            Realtime collaborative note taking
          </h1>
        </header>
        <div className="flex-1 overflow-y-auto bg-muted/30 p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

function SignedOutLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex flex-col items-center gap-4 rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight">PlivoApp</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to start taking notes
        </p>
        <div className="flex gap-3">
          <div className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <SignInButton />
          </div>
          <div className="rounded-lg bg-secondary px-6 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">
            <SignUpButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <Show when="signed-out">
            <SignedOutLayout />
          </Show>
          <Show when="signed-in">
            <SignedInLayout>{children}</SignedInLayout>
            <Toaster />
          </Show>
        </body>
      </html>
    </ClerkProvider>
  );
}
