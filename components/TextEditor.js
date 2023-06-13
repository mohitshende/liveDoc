import React, { useState, useEffect, useRef } from "react";
import db from "../firebase";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { setDoc, doc } from "firebase/firestore";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(
  () => {
    return import("react-quill");
  },
  { ssr: false }
);

const TextEditor = ({ document, emailId }) => {
  // const { data: session } = useSession();

  const router = useRouter();
  const { id } = router.query;
  const docRef = doc(db, `userDocs/${emailId}/docs/${id}`);

  const [editorState, setEditorState] = useState("");

  useEffect(() => {
    if (document?.editorState) {
      setEditorState(document.editorState);
    }
  }, [document]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    const saveDoc = async () => {
      await setDoc(
        docRef,
        {
          editorState: editorState,
        },
        {
          merge: true,
        }
      );
    };
    saveDoc();
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen hadow-xl">
      <ReactQuill
        theme="snow"
        value={editorState}
        onChange={onEditorStateChange}
        modules={modules}
        formats={formats}
        style={{ height: "calc(100vh - 100px)" }}
      />
    </div>
  );
};

export default TextEditor;
