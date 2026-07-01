import React, { useRef, useState } from "react";
import Editor from "@/components/MyEditor";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.core.css";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createNote } from "../../../../components/savenote";
import { useSession } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Delta = Quill.import("delta");

const PlivoEditor = () => {
  const [, setRange] = useState();
  const [, setLastChange] = useState();
  const [value, setContent] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const quillRef = useRef(null);

  async function saveNote() {
    try {
      setSaving(true);
      const notesrequest = {
        id: session.session?.user.username,
        note: JSON.stringify(quillRef.current.getContents()),
        email: session.session?.user.emailAddresses[0].emailAddress,
        title: value,
        desc: description,
        content: quillRef.current.getSemanticHTML(),
      };
      await createNote(notesrequest);
      setContent("");
      setDescription("");
      quillRef.current.setText("");
      toast({
        description: "Note created.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Create Note</h1>
        <p className="text-sm text-muted-foreground">
          Write a new note using the editor below.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          placeholder="Enter a title..."
          value={value}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          type="text"
          placeholder="Brief description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="editor">Content</Label>
        <div className="overflow-hidden rounded-lg border">
          <Editor
            id="editor"
            ref={quillRef}
            readOnly={false}
            defaultValue={new Delta()}
            onSelectionChange={setRange}
            onTextChange={setLastChange}
            theme="snow"
            placeholder="Type your notes..."
          />
        </div>
      </div>

      <Button
        onClick={saveNote}
        disabled={saving || !value.trim()}
        className="w-full sm:w-auto"
      >
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {saving ? "Creating..." : "Create Note"}
      </Button>
    </div>
  );
};

export default PlivoEditor;
