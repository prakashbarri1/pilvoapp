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

const EditNote = () => {
  const session = useSession();
  const editRef = useRef(null);
  const { toast } = useToast();
  const [first, setFirst] = useState(false);
  const [viewdata, setViewData] = useState(Array());
  const [, setRange] = useState();
  const [, setLastChange] = useState();

  // Use a ref to access the quill instance directly
  const quillRef = React.createRef(Quill);

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
  const data = Array();

  return (
    <div>
      <div className="m-2 hidden">
        <Button
          ref={editRef}
          onClick={async () => {
            setFirst(true);
            const record = await getData();
            for (let i = 0; i < record.length; i++) {
              data.push(
                <div className="flex m-2" key={record[i].id}>
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>{record[i].title}</CardTitle>
                      <CardDescription>{record[i].description}</CardDescription>
                    </CardHeader>
                    <CardContent className="w-full overflow-scroll">
                      <div
                        className="w-full overflow-scroll "
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(record[i].html),
                        }}
                      ></div>
                    </CardContent>
                    <CardFooter>
                      <div className="grid grid-cols-2">
                        <Button
                          className="bg-lime-500 rounded-full hover:bg-red-500 m-1"
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
                                title: "Uh oh! Something went wrong." + error,
                                description:
                                  "There was a problem with your request. Please try again.",
                              });
                            }
                          }}
                        >
                          Delete
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="bg-lime-500 rounded-full hover:bg-amber-500 m-1">
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Note</DialogTitle>
                              <DialogDescription>
                                Make changes to your note here. Click save when
                                you are done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 gap-4 py-4">
                              <div className="items-center gap-4">
                                <Label htmlFor="title" className="text-right">
                                  Title
                                </Label>
                                <Input
                                  id="title"
                                  value={record[i].title}
                                  className="col-span-3"
                                  onChange={(e) => setTitle(e.target.value)}
                                  disabled
                                />
                              </div>
                              <div className="items-center gap-1">
                                <Label
                                  htmlFor="description"
                                  className="text-right"
                                >
                                  Description
                                </Label>
                                <Input
                                  id="description"
                                  value={record[i].description}
                                  className="col-span-3"
                                  onChange={(e) =>
                                    setDescription(e.target.value)
                                  }
                                  disabled
                                />
                              </div>
                              <div className="items-center gap-1">
                                <Label htmlFor="editor">Content</Label>
                                <Editor
                                  id="editor"
                                  className="flex border-indigo-400 rounded-xl border-2 text-indigo-400"
                                  ref={quillRef}
                                  readOnly={false}
                                  onSelectionChange={setRange}
                                  onTextChange={setLastChange}
                                  theme="snow"
                                  placeholder="Type your notes..."
                                />
                              </div>
                            </div>
                            <DialogClose asChild>
                              <Button
                                type="submit"
                                onClick={() => {
                                  try {
                                    saveData(record[i].id, record[i].authorId);
                                    toast({
                                      description: "Note updated.",
                                    });
                                    editRef.current?.click();
                                  } catch (error) {
                                    toast({
                                      variant: "destructive",
                                      title:
                                        "Uh oh! Something went wrong." + error,
                                      description:
                                        "There was a problem with your request. Please try again.",
                                    });
                                  }
                                }}
                              >
                                Save
                              </Button>
                            </DialogClose>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              );
            }
            setViewData(data);
          }}
          className="bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-400 shadow-md"
        >
          View Data
        </Button>
      </div>
      <div className="grid grid-cols-3 items-left overflow-scroll">
        {viewdata.map((record) => {
          return record;
        })}
      </div>
    </div>
  );
};

export default EditNote;
