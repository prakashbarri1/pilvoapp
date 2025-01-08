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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

import { Checkbox } from "@/components/ui/checkbox";

const EditNote = () => {
  const session = useSession();
  const editRef = useRef(null);
  const { toast } = useToast();
  const [first, setFirst] = useState(false);
  const [viewdata, setViewData] = useState(Array());
  const [othernotes, setOthersNotes] = useState(Array());
  const [, setRange] = useState();
  const [, setLastChange] = useState();

  // Use a ref to access the quill instance directly
  const quillRef = React.createRef(Quill);
  const myData = Array();
  const othersData = Array();

  async function getData() {
    const notesRequest = {
      data: {
        id:
          session.session?.user.emailAddresses[0].emailAddress ||
          localStorage.getItem("email"),
      },
      published: false,
    };

    const response = await fetch("/api/notes", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify(notesRequest),
    });
    const data = await response.json();
    return data;
  }

  async function getOthersData() {
    const notesRequest = {
      data: {
        id:
          session.session?.user.emailAddresses[0].emailAddress ||
          localStorage.getItem("email"),
      },
      published: true,
    };

    const response = await fetch("/api/notes", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify(notesRequest),
    });
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    if (!first) {
      editRef.current?.click();
    }
  });

  async function saveData(rid, mail, publish) {
    let updateRecord = {
      vid: rid,
      id: session.session?.user.username,
      email: mail,
      note: JSON.stringify(quillRef.current.getContents()),
      content: quillRef.current.getSemanticHTML(),
      published: publish,
    };
    const response = await fetch("/api/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateRecord),
    });
    const data = await response.json();
    return data;
  }

  async function deleteData(nid) {
    const deleteRequest = {
      id: nid,
    };
    const response = await fetch("/api/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteRequest),
    });
    const data = await response.json();
    return data;
  }

  return (
    <div>
      <div className="m-2 hidden">
        <Button
          ref={editRef}
          onClick={async () => {
            setFirst(true);
            let record = await getData();
            console.log(record);
            editDataFunctionality(
              record,
              myData,
              deleteData,
              editRef,
              toast,
              quillRef,
              setRange,
              setLastChange,
              saveData,
              false
            );
            setViewData(myData);
            record = await getOthersData();
            console.log(record);
            editDataFunctionality(
              record,
              othersData,
              deleteData,
              editRef,
              toast,
              quillRef,
              setRange,
              setLastChange,
              saveData,
              true
            );
            setOthersNotes(othersData);
          }}
          className="bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-400 shadow-md"
        >
          View Data
        </Button>
      </div>
      <div>
        <div>
          <Tabs defaultValue="mydata" className="border-2 rounded-xl p-1">
            <TabsList>
              <TabsTrigger value="mydata" className="text-white">
                My Notes
              </TabsTrigger>
              <TabsTrigger value="othersdata" className="text-white">
                Other Notes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="mydata">
              <div className="grid grid-cols-3 items-left overflow-scroll">
                {viewdata.map((record) => {
                  return record;
                })}
              </div>
            </TabsContent>
            <TabsContent value="othersdata">
              <div className="grid grid-cols-3 items-left overflow-scroll">
                {othernotes.map((record) => {
                  return record;
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

function editDataFunctionality(
  record,
  myData,
  deleteData,
  editRef,
  toast,
  quillRef,
  setRange,
  setLastChange,
  saveData,
  disabled
) {
  const checkBoxes = Array();
  for (let i = 0; i < record.length; i++) {
    checkBoxes.push(false);
    myData.push(
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
                disabled={disabled}
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
                      Make changes to your note here. Click save when you are
                      done.
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
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={record[i].description}
                        className="col-span-3"
                        onChange={(e) => setDescription(e.target.value)}
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
                    <div className="items-center gap-1">
                      <Checkbox
                        id="publish"
                        // checked={checkBoxes[i]}
                        className="border-2"
                        value={checkBoxes[i]}
                        onCheckedChange={(e) => {
                          checkBoxes[i] = e;
                        }}
                      />
                      <Label htmlFor="publish"> Publish</Label>
                    </div>
                  </div>
                  <DialogClose asChild>
                    <Button
                      type="submit"
                      onClick={async () => {
                        try {
                          const savedRecord = await saveData(
                            record[i].id,
                            record[i].authorId,
                            checkBoxes[i]
                          );
                          console.log(checkBoxes[i], savedRecord);
                          toast({
                            description: "Note updated.",
                          });
                          editRef.current?.click();
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
}

export default EditNote;
