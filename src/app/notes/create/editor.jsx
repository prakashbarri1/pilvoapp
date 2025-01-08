import React, { useRef, useState } from "react";
import Editor from "@/components/MyEditor";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.core.css";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSession } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const Delta = Quill.import("delta");

const PlivoEditor = () => {
  const [, setRange] = useState();
  const [, setLastChange] = useState();
  const [value, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [publish, setPublish] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  // Use a ref to access the quill instance directly
  const quillRef = useRef(null);

  async function saveNote() {
    try {
      console.log(quillRef.current.getSemanticHTML());
      console.log(publish);
      const notesrequest = {
        id: session.session?.user.username,
        note: JSON.stringify(quillRef.current.getContents()),
        email: session.session?.user.emailAddresses[0].emailAddress,
        title: value,
        desc: description,
        publish: publish,
        content: quillRef.current.getSemanticHTML(),
      };
      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notesrequest),
      });

      const data = await response.json();
      console.log(data);
      // const response = await createNote(notesrequest);
      // console.log(response);
      setContent("");
      setDescription("");
      quillRef.current.setText("");
      toast({
        description: "Note created.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong." + error,
        description: "There was a problem with your request. Please try again.",
      });
    }
  }

  return (
    <div className="text-gray-700">
      <div className="mx-2">
        <Label htmlFor="title" className="font-semibold">
          Title
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="Title"
          value={value}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          required={true}
          className="border-2 p-1"
        />
      </div>

      <div className="m-2">
        <Label htmlFor="description" className="font-semibold">
          Description
        </Label>
        <Input
          id="description"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          className="border-2 p-1"
        />
      </div>

      <div className="m-2">
        <Label htmlFor="editor" className="font-semibold">
          Content
        </Label>
        <Editor
          id="editor"
          className="flex border-indigo-400 rounded-xl border-2 text-indigo-400"
          ref={quillRef}
          readOnly={false}
          defaultValue={new Delta()}
          onSelectionChange={setRange}
          onTextChange={setLastChange}
          theme="snow"
          placeholder="Type your notes..."
        />
      </div>

      <div className="m-2">
        <Checkbox
          id="publish"
          value={publish}
          onCheckedChange={(e) => {
            setPublish(e);
          }}
          className="border-2"
        />
        <Label htmlFor="publish" className="font-semibold">
          {" "}
          Publish
        </Label>
      </div>

      <div className="flex m-2">
        <Button
          onClick={() => {
            saveNote();
          }}
          className="bg-lime-500 text-white font-semibold hover:bg-lime-400 rounded-full"
        >
          Create Note
        </Button>
      </div>
    </div>
  );
};

export default PlivoEditor;
