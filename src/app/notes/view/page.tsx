"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getNotes } from "../../../../components/notes";
import { useSession } from "@clerk/nextjs";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import { Loader2, BookOpen } from "lucide-react";

export default function ViewNotes() {
  const session = useSession();
  const viewRef = useRef<HTMLButtonElement>(null);
  const [first, setFirst] = useState(false);
  const [viewdata, setViewData] = useState<React.ReactNode[]>([]);
  const [loading, setLoading] = useState(false);

  async function getData() {
    const notes = await getNotes({
      id: session.session?.user.emailAddresses[0].emailAddress,
    });
    return notes;
  }

  useEffect(() => {
    if (!first) {
      viewRef.current?.click();
    }
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">View Notes</h1>
          <p className="text-sm text-muted-foreground">
            Browse all your saved notes.
          </p>
        </div>
        <Button
          ref={viewRef}
          variant="outline"
          size="sm"
          onClick={async () => {
            setLoading(true);
            setFirst(true);
            const record = await getData();
            const items: React.ReactNode[] = [];
            for (let i = 0; i < record.length; i++) {
              items.push(
                <Card key={record[i].id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {record[i].title || "Untitled"}
                    </CardTitle>
                    {record[i].description && (
                      <CardDescription>{record[i].description}</CardDescription>
                    )}
                  </CardHeader>
                  {record[i].html && (
                    <CardContent>
                      <div
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(record[i].html),
                        }}
                      />
                    </CardContent>
                  )}
                </Card>,
              );
            }
            setViewData(items);
            setLoading(false);
          }}
          className="hidden"
        >
          Load Notes
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : viewdata.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <BookOpen className="mb-3 h-12 w-12" />
          <p className="text-lg font-medium">No notes yet</p>
          <p className="text-sm">Create your first note to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {viewdata.map((record) => record)}
        </div>
      )}
    </div>
  );
}
