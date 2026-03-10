import { useState, useEffect } from "react";
import { subscribeToConnections } from "../services/connections.service";
import { Connection } from "../types";
import { useAuth } from "../../auth/hooks/useAuth";

export const useConnections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToConnections(user.uid, (data) => {
      setConnections(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { connections, loading };
};
