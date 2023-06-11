import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import db from "../firebase";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { setDoc, doc } from "firebase/firestore";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  {
    ssr: false,
  }
);

const TextEditor = ({ document, emailId }) => {
  const { data: session } = useSession();

  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const router = useRouter();
  const { id } = router.query;

  const docRef = doc(db, `userDocs/${emailId}/docs/${id}`);

  useEffect(() => {
    if (document?.editorState) {
      setEditorState(
        EditorState.createWithContent(convertFromRaw(document?.editorState))
      );
    }
  }, [document]);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    const saveDoc = async () => {
      await setDoc(
        docRef,
        {
          editorState: convertToRaw(editorState.getCurrentContent()),
        },
        {
          merge: true,
        }
      );
    };
    saveDoc();
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-1">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto"
        editorClassName="bg-white shadow-lg max-w-5xl mx-auto border p-10 min-h-screen my-6"
      />
    </div>
  );
};

export default TextEditor;
