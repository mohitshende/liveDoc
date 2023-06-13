import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import db from "../../../../firebase";
import PeopleIcon from "@material-ui/icons/People";
import DescriptionIcon from "@material-ui/icons/Description";
import TextEditor from "../../../../components/TextEditor";
import { Button } from "@material-ui/core";
import { authOptions } from "../../../api/auth/[...nextauth]";
import AccessDenied from "../../../../components/AccessDenied";
import {
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import CustomModal from "../../../../components/CustomModal";
import { signOut } from "next-auth/react";

const Doc = ({ session }) => {
  const router = useRouter();
  const { id, emailId } = router.query;

  const [currentDoc, setCurrentDoc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isPublic, setIsPublic] = useState(false);

  const docRef = doc(db, `userDocs/${emailId}/docs/${id}`);

  useEffect(() => {
    if (!session) {
      router.replace("/");
    }

    async function getUserDoc() {
      await getDoc(docRef)
        .then((data) => {
          if (data.data()) {
            setCurrentDoc(data.data());
            setIsPublic(data.data().isPublic);
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
        setIsPublic(snapshot.data().isPublic);
      }
    );
    return unsub;
  }, []);
  console.log(currentDoc);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(isPublic);
    await setDoc(
      docRef,
      {
        timestamp: serverTimestamp(),
        isPublic: isPublic === "true",
      },
      {
        merge: true,
      }
    )
      .then(() => {
        setShowModal(false);
        e.target.reset();
      })
      .catch((err) => alert(err));
  };

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
          <h2 className="text-gray-600 text-xl">{currentDoc?.fileName}</h2>
        </div>

        <div className="idRight hidden md:inline-flex items-center">
          {emailId == session.user.email && (
            <Button onClick={() => setShowModal(true)} size="small">
              <PeopleIcon /> SHARE
            </Button>
          )}
          <img
            src={session?.user.image}
            className="rounded-full h-8 w-8 m-2"
            alt="User Avatar"
          />
          <p
            className="text-bold text-sx cursor-pointer hover:text-blue-500"
            onClick={signOut}
          >
            Logout
          </p>
        </div>
      </header>
      <CustomModal
        handleSubmit={handleSubmit}
        showModal={showModal}
        setShowModal={setShowModal}
        isPublic={isPublic}
        setIsPublic={setIsPublic}
      />
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
