import { useState, useEffect } from "react";
import { subscribeToMessages, MessageFilters } from "../services/messages.service";
import { Message } from "../types";
import { useAuth } from "../../auth/hooks/useAuth";

export const useMessages = (connectionId: string | null = null, filters: Omit<MessageFilters, 'connectionId'> = {}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fullFilters: MessageFilters = { ...filters };
    if (connectionId) {
      fullFilters.connectionId = connectionId;
    }

    const unsubscribe = subscribeToMessages(user.uid, fullFilters, (data) => {
      setMessages(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, connectionId, JSON.stringify(filters)]);

  return { messages, loading };
};
