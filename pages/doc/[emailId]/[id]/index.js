import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import db from "../../../../firebase";
import PeopleIcon from "@material-ui/icons/People";
import DescriptionIcon from "@material-ui/icons/Description";
import TextEditor from "../../../../components/TextEditor";
import { Button } from "@material-ui/core";
import { authOptions } from "../../../api/auth/[...nextauth]";
import AccessDenied from "../../../../components/AccessDenied";
import { onSnapshot, doc, getDoc } from "firebase/firestore";

const Doc = ({ session }) => {
  const router = useRouter();
  const { id, emailId } = router.query;

  const [currentDoc, setCurrentDoc] = useState(null);
  const docRef = doc(db, `userDocs/${emailId}/docs/${id}`);

  useEffect(() => {
    if (!session) return;

    async function getUserDoc() {
      await getDoc(docRef)
        .then((data) => {
          if (data.data()) {
            setCurrentDoc(data.data());
          } else {
            router.replace("/");
          }
        })
        .catch((err) => alert(err));
    }
    getUserDoc();
  }, [id, session]);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, `userDocs/${emailId}/docs/${id}`),
      (snapshot) => {
        setCurrentDoc(snapshot.data());
      }
    );
    return unsub;
  }, []);

  if (!currentDoc || !session) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!currentDoc?.isPublic && emailId != session.user.email) {
    return (
      <AccessDenied
        button="Go to Home"
        buttonHref="/"
        title="Access Denied!"
        details="This is a private document. Please request owner of this
        document to get access"
      />
    );
  }

  return (
    <div>
      <header className="flex justify-between items-center p-3">
        <span
          onClick={() => router.push("/")}
          className="cursor-pointer text-5xl text-[#2196f3] grid place-items-center"
        >
          <DescriptionIcon fontSize="inherit" />
        </span>

        <div className="flex-grow px-2">
          <h2 className="text-gray-600">{currentDoc?.fileName}</h2>
          <div className="flex items-center text-sm space-x-2 -ml-1 h-8 text-gray-500">
            <p className="">File</p>
            <p className="">Edit</p>
            <p className="">View</p>
            <p className="">Insert</p>
            <p className="">Format</p>
            <p className="">Tools</p>
          </div>
        </div>

        <div className="idRight hidden md:inline-flex items-center">
          <Button>
            <PeopleIcon /> SHARE
          </Button>
          <img
            src={session?.user.image}
            className="rounded-full h-10 w-10 ml-2"
            alt="User Avatar"
          />
        </div>
      </header>

      {currentDoc && <TextEditor document={currentDoc} emailId={emailId} />}
    </div>
  );
};

export default Doc;

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: { session },
  };
}
