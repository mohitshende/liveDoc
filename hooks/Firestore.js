import { doc, onSnapshot } from "firebase/firestore";
import db from "../firebase";

export const subscribeDocument = (collectionName, documentName, cb) => {
  try {
    const unsub = onSnapshot(
      doc(db, collectionName, documentName),
      (snapshot) => {
        cb(snapshot.data());
      }
    );
    return unsub;
  } catch (e) {
    console.log(e);
  }
};
