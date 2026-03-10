import { useEffect } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { startClientSideScheduler } from "../services/messages.service";

export const useMessageScheduler = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = startClientSideScheduler(user.uid);

    return () => {
      unsubscribe();
    };
  }, [user]);
};
