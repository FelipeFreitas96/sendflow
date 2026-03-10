import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { db } from "../../../services/firebase";
import { Contact } from "../types";

const COLLECTION = "contacts";

export const createContact = async (clientId: string, connectionId: string, name: string, phone: string) => {
  return await addDoc(collection(db, COLLECTION), {
    clientId,
    connectionId,
    name,
    phone,
    createdAt: serverTimestamp(),
  });
};

export const updateContact = async (id: string, name: string, phone: string) => {
  const contactRef = doc(db, COLLECTION, id);
  await updateDoc(contactRef, { name, phone });
};

export const deleteContact = async (id: string) => {
  const contactRef = doc(db, COLLECTION, id);
  await deleteDoc(contactRef);
};

export const subscribeToContacts = (clientId: string, connectionId: string | null, callback: (contacts: Contact[]) => void) => {
  let q = query(
    collection(db, COLLECTION), 
    where("clientId", "==", clientId),
    orderBy("createdAt", "desc")
  );
  
  if (connectionId) {
    q = query(q, where("connectionId", "==", connectionId));
  }
  
  return onSnapshot(q, (snapshot) => {
    const contacts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Contact[];
    callback(contacts);
  });
};
