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
import { Connection } from "../types";

const COLLECTION = "connections";

export const createConnection = async (clientId: string, name: string) => {
  return await addDoc(collection(db, COLLECTION), {
    clientId,
    name,
    createdAt: serverTimestamp(),
  });
};

export const updateConnection = async (id: string, name: string) => {
  const connectionRef = doc(db, COLLECTION, id);
  await updateDoc(connectionRef, { name });
};

export const deleteConnection = async (id: string) => {
  const connectionRef = doc(db, COLLECTION, id);
  await deleteDoc(connectionRef);
};

export const subscribeToConnections = (clientId: string, callback: (connections: Connection[]) => void) => {
  const q = query(
    collection(db, COLLECTION), 
    where("clientId", "==", clientId),
    orderBy("createdAt", "desc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const connections = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Connection[];
    callback(connections);
  });
};
