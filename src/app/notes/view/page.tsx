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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export default function ViewNotes() {
  const session = useSession();
  const viewRef = useRef<HTMLButtonElement>(null);
  const [first, setFirst] = useState(false);
  const [viewdata, setViewData] = useState(Array<React.ReactNode>());
  const [othernotes, setOthersNotes] = useState(Array<React.ReactNode>());
  async function getData() {
    const notes = await getNotes(
      {
        id:
          session.session?.user.emailAddresses[0].emailAddress ||
          localStorage.getItem("email"),
      },
      false
    );
    return notes;
  }

  async function getOthersData() {
    const notes = await getNotes(
      {
        id:
          session.session?.user.emailAddresses[0].emailAddress ||
          localStorage.getItem("email"),
      },
      true
    );
    return notes;
  }
  const myData = Array<React.ReactNode>();
  const othersData = Array<React.ReactNode>();

  useEffect(() => {
    if (!first) {
      viewRef.current?.click();
    }
  }, [first]);

  return (
    <div>
      <div className="m-2">
        <Button
          ref={viewRef}
          onClick={async () => {
            setFirst(true);
            let record = await getData();
            console.log(localStorage.getItem("email"));
            console.log(record);
            for (let i = 0; i < record.length; i++) {
              myData.push(
                <div className="flex m-2" key={record[i].id}>
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>{record[i].title}</CardTitle>
                      <CardDescription>{record[i].description}</CardDescription>
                    </CardHeader>
                    <CardContent className="w-full overflow-scroll">
                      <div
                        className="w-full overflow-scroll"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(record[i].html),
                        }}
                      ></div>
                    </CardContent>
                  </Card>
                </div>
              );
            }

            setViewData(myData);

            record = await getOthersData();
            console.log(record);
            for (let i = 0; i < record.length; i++) {
              othersData.push(
                <div className="flex m-2" key={record[i].id}>
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>{record[i].title}</CardTitle>
                      <CardDescription>{record[i].description}</CardDescription>
                    </CardHeader>
                    <CardContent className="w-full overflow-scroll">
                      <div
                        className="w-full overflow-scroll"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(record[i].html),
                        }}
                      ></div>
                    </CardContent>
                  </Card>
                </div>
              );
            }
            setOthersNotes(othersData);
          }}
          className="bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-400 
          shadow-md hidden"
        >
          View Data
        </Button>
      </div>

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
  );
}
