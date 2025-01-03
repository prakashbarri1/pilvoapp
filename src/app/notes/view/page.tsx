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
export default function ViewNotes() {
  const session = useSession();
  const viewRef = useRef<HTMLButtonElement>(null);
  const [first, setFirst] = useState(false);
  const [viewdata, setViewData] = useState(Array<React.ReactNode>());
  async function getData() {
    const notes = await getNotes({
      id: session.session?.user.emailAddresses[0].emailAddress,
    });
    return notes;
  }
  const data = Array<React.ReactNode>();

  useEffect(() => {
    if (!first) {
      viewRef.current?.click();
    }
  });

  return (
    <div>
      <div className="m-2">
        <Button
          ref={viewRef}
          onClick={async () => {
            setFirst(true);
            const record = await getData();
            console.log(record);
            for (let i = 0; i < record.length; i++) {
              data.push(
                <div className="flex m-2" key={record[i].id}>
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>{record[i].title}</CardTitle>
                      <CardDescription>{record[i].description}</CardDescription>
                    </CardHeader>
                    <CardContent className="w-full overflow-y-scroll overflow-x-scroll">
                      <div
                        className="w-full overflow-y-scroll overflow-x-scroll"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(record[i].html),
                        }}
                      ></div>
                    </CardContent>
                  </Card>
                </div>,
              );
            }
            console.log(data);
            setViewData(data);
          }}
          className="bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-400 
          shadow-md hidden"
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
}
