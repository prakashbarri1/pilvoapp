"use client";
import { useSession } from "@clerk/nextjs";
import { FilePenLine, Eye, Pencil } from "lucide-react";

export default function Home() {
  const session = useSession();

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome{session.session?.user.username ? `, ${session.session.user.username}` : ""}!
        </h1>
        <p className="text-muted-foreground">
          Get started with your collaborative notes.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        <a
          href="/notes/create"
          className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FilePenLine className="h-6 w-6" />
          </div>
          <h2 className="mb-1 font-semibold">Create Note</h2>
          <p className="text-sm text-muted-foreground">
            Write a new note with our rich text editor.
          </p>
        </a>
        <a
          href="/notes/view"
          className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Eye className="h-6 w-6" />
          </div>
          <h2 className="mb-1 font-semibold">View Notes</h2>
          <p className="text-sm text-muted-foreground">
            Browse and read all your saved notes.
          </p>
        </a>
        <a
          href="/notes/edit"
          className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Pencil className="h-6 w-6" />
          </div>
          <h2 className="mb-1 font-semibold">Edit Notes</h2>
          <p className="text-sm text-muted-foreground">
            Update or delete your existing notes.
          </p>
        </a>
      </div>
    </div>
  );
}
