"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getNotes } from "../../../../components/notes";
import { useRef, useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BookOpen } from "lucide-react";

export default function ViewNotes() {
  const { toast } = useToast();
  const [viewdata, setViewData] = useState<React.ReactNode[]>([]);
  const [loading, setLoading] = useState(false);
  const loaded = useRef(false);

  async function loadData() {
    setLoading(true);
    try {
      const notes = await getNotes();
      const items: React.ReactNode[] = [];
      for (let i = 0; i < notes.length; i++) {
        items.push(
          <Card key={notes[i].id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {notes[i].title || "Untitled"}
              </CardTitle>
              {notes[i].description && (
                <CardDescription>{notes[i].description}</CardDescription>
              )}
            </CardHeader>
            {notes[i].html && (
              <CardContent>
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(notes[i].html),
                  }}
                />
              </CardContent>
            )}
          </Card>,
        );
      }
      setViewData(items);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load notes",
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      loadData();
    }
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">View Notes</h1>
          <p className="text-sm text-muted-foreground">
            Browse all your saved notes.
          </p>
        </div>
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
