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
  orderBy,
  Timestamp,
  getDocs
} from "firebase/firestore";
import { db } from "../../../services/firebase";
import { Message } from "../types";

const COLLECTION = "messages";

export const createMessage = async (
  clientId: string, 
  connectionId: string, 
  contactIds: string[], 
  content: string, 
  scheduledAt: Date | null = null
) => {
  const status = scheduledAt ? "scheduled" : "sent";
  const sentAt = scheduledAt ? null : serverTimestamp();
  
  return await addDoc(collection(db, COLLECTION), {
    clientId,
    connectionId,
    contactIds,
    content,
    status,
    scheduledAt: scheduledAt ? Timestamp.fromDate(scheduledAt) : null,
    sentAt,
    createdAt: serverTimestamp(),
  });
};

export const updateMessage = async (id: string, content: string, scheduledAt: Date | null) => {
  const messageRef = doc(db, COLLECTION, id);
  const status = scheduledAt ? "scheduled" : "sent";
  await updateDoc(messageRef, { 
    content, 
    scheduledAt: scheduledAt ? Timestamp.fromDate(scheduledAt) : null,
    status
  });
};

export const deleteMessage = async (id: string) => {
  const messageRef = doc(db, COLLECTION, id);
  await deleteDoc(messageRef);
};

export interface MessageFilters {
  status?: 'scheduled' | 'sent';
  connectionId?: string;
}

export const subscribeToMessages = (
  clientId: string, 
  filters: MessageFilters,
  callback: (messages: Message[]) => void
) => {
  let constraints: any[] = [where("clientId", "==", clientId)];
  
  if (filters.status) {
    constraints.push(where("status", "==", filters.status));
  }
  
  if (filters.connectionId) {
    constraints.push(where("connectionId", "==", filters.connectionId));
  }

  constraints.push(orderBy("createdAt", "desc"));
  
  const q = query(collection(db, COLLECTION), ...constraints);
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Message[];
    callback(messages);
  });
};

const activeTimeouts = new Map<string, any>();

export const startClientSideScheduler = (clientId: string) => {
  const q = query(
    collection(db, COLLECTION), 
    where("clientId", "==", clientId),
    where("status", "==", "scheduled")
  );

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const id = change.doc.id;
      const message = change.doc.data() as Message;

      if (change.type === "removed") {
        if (activeTimeouts.has(id)) {
          clearTimeout(activeTimeouts.get(id));
          activeTimeouts.delete(id);
        }
        return;
      }

      if (message.status === "scheduled" && message.scheduledAt) {
        if (activeTimeouts.has(id)) {
          clearTimeout(activeTimeouts.get(id));
        }

        const scheduledTime = (message.scheduledAt as Timestamp).toMillis();
        const now = Date.now();
        const delay = Math.max(0, scheduledTime - now);

        const timeoutId = setTimeout(async () => {
          try {
            await updateDoc(doc(db, COLLECTION, id), {
              status: "sent",
              sentAt: Timestamp.now(),
            });
            activeTimeouts.delete(id);
          } catch (error) {
            console.error("Error sending scheduled message:", error);
          }
        }, delay);

        activeTimeouts.set(id, timeoutId);
      }
    });
  });
};
