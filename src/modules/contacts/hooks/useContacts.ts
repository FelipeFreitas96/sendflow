import { useState, useEffect } from "react";
import { subscribeToContacts } from "../services/contacts.service";
import { Contact } from "../types";
import { useAuth } from "../../auth/hooks/useAuth";

export const useContacts = (connectionId: string | null = null) => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToContacts(user.uid, connectionId, (data) => {
      setContacts(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, connectionId]);

  return { contacts, loading };
};
