"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { getNotes } from "../../../../components/notes";
import { deleteNote } from "../../../../components/delete";
import { updateNote } from "../../../../components/update";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Editor from "@/components/MyEditor";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";
import { Loader2, Trash2, Pencil, BookOpen } from "lucide-react";

const Delta = Quill.import("delta");

const EditNote = () => {
  const { toast } = useToast();
  const [viewdata, setViewData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, setRange] = useState();
  const [, setLastChange] = useState();

  const quillRef = useRef(null);

  async function loadData() {
    setLoading(true);
    try {
      const record = await getNotes();
      const data = record.map((r) => (
        <Card key={r.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="break-words text-lg">
                  {r.title || "Untitled"}
                </CardTitle>
                {r.description && (
                  <CardDescription className="break-words">{r.description}</CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          {r.html && (
            <CardContent>
                <div
                  className="break-words text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(r.html),
                }}
              />
            </CardContent>
          )}
          <CardFooter className="border-t bg-muted/30 px-6 py-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={async () => {
                  try {
                    await deleteNote({ id: r.id });
                    await loadData();
                    toast({ description: "Note deleted." });
                  } catch (error) {
                    toast({
                      variant: "destructive",
                      title: "Uh oh! Something went wrong.",
                      description:
                        "There was a problem with your request. Please try again.",
                    });
                  }
                }}
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Delete
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm">
                    <Pencil className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Edit Note</DialogTitle>
                    <DialogDescription>
                      Make changes to your note here. Click save when you are
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Title</Label>
                      <Input id="edit-title" value={r.title} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Input id="edit-description" value={r.description} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-content">Content</Label>
                      <div className="overflow-hidden rounded-lg border">
                        <Editor
                          id="edit-content"
                          ref={quillRef}
                          readOnly={false}
                          defaultValue={
                            r.content
                              ? new Delta(JSON.parse(r.content))
                              : new Delta()
                          }
                          onSelectionChange={setRange}
                          onTextChange={setLastChange}
                          theme="snow"
                          placeholder="Edit your notes..."
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        onClick={async () => {
                          try {
                            const updateRecord = {
                              vid: r.id,
                              note: JSON.stringify(
                                quillRef.current.getContents(),
                              ),
                              content:
                                quillRef.current.getSemanticHTML(),
                            };
                            await updateNote(updateRecord);
                            await loadData();
                            toast({ description: "Note updated." });
                          } catch (error) {
                            toast({
                              variant: "destructive",
                              title: "Uh oh! Something went wrong.",
                              description:
                                "There was a problem with your request. Please try again.",
                            });
                          }
                        }}
                      >
                        Save
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardFooter>
        </Card>
      ));
      setViewData(data);
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
    loadData();
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Edit Notes</h1>
        <p className="text-sm text-muted-foreground">
          Update or delete your existing notes.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : viewdata.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <BookOpen className="mb-3 h-12 w-12" />
          <p className="text-lg font-medium">No notes yet</p>
          <p className="text-sm">Create a note first to edit it.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {viewdata.map((record) => record)}
        </div>
      )}
    </div>
  );
};

export default EditNote;
