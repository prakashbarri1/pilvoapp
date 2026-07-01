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
import { useSession } from "@clerk/nextjs";
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
  const session = useSession();
  const editRef = useRef(null);
  const { toast } = useToast();
  const [first, setFirst] = useState(false);
  const [viewdata, setViewData] = useState(Array());
  const [loading, setLoading] = useState(false);
  const [, setRange] = useState();
  const [, setLastChange] = useState();

  const quillRef = useRef(null);

  async function getData() {
    const notes = await getNotes({
      id: session.session?.user.emailAddresses[0].emailAddress,
    });
    return notes;
  }

  useEffect(() => {
    if (!first) {
      editRef.current?.click();
    }
  });

  async function saveData(rid, mail) {
    let updateRecord = {
      vid: rid,
      id: session.session?.user.username,
      email: mail,
      note: JSON.stringify(quillRef.current.getContents()),
      content: quillRef.current.getSemanticHTML(),
    };
    const updatedNote = await updateNote(updateRecord);
    return updatedNote;
  }

  async function deleteData(nid) {
    const notes = await deleteNote({
      id: nid,
    });
    return notes;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Edit Notes</h1>
        <p className="text-sm text-muted-foreground">
          Update or delete your existing notes.
        </p>
      </div>

      <div className="hidden">
        <Button
          ref={editRef}
          onClick={async () => {
            setLoading(true);
            setFirst(true);
            const record = await getData();
            const data = [];
            for (let i = 0; i < record.length; i++) {
              data.push(
                <Card key={record[i].id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {record[i].title || "Untitled"}
                        </CardTitle>
                        {record[i].description && (
                          <CardDescription>
                            {record[i].description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
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
                  <CardFooter className="border-t bg-muted/30 px-6 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={async () => {
                          try {
                            await deleteData(record[i].id);
                            editRef.current?.click();
                            toast({
                              description: "Note deleted.",
                            });
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
                              Make changes to your note here. Click save when
                              you are done.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-title">Title</Label>
                              <Input
                                id="edit-title"
                                value={record[i].title}
                                disabled
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-description">
                                Description
                              </Label>
                              <Input
                                id="edit-description"
                                value={record[i].description}
                                disabled
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-content">Content</Label>
                              <div className="overflow-hidden rounded-lg border">
                                <Editor
                                  id="edit-content"
                                  ref={quillRef}
                                  readOnly={false}
                                  defaultValue={
                                    record[i].content
                                      ? new Delta(
                                          JSON.parse(record[i].content),
                                        )
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
                                    await saveData(
                                      record[i].id,
                                      record[i].authorId,
                                    );
                                    toast({
                                      description: "Note updated.",
                                    });
                                    editRef.current?.click();
                                  } catch (error) {
                                    toast({
                                      variant: "destructive",
                                      title:
                                        "Uh oh! Something went wrong.",
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
                </Card>,
              );
            }
            setViewData(data);
            setLoading(false);
          }}
        >
          View Data
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
