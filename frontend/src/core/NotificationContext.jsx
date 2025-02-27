import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markNotificationAsRead } from "../core/requests";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { getUserId } = useAuth();
  const userId = getUserId();
  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    refetch,
  } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => getNotifications(userId),
    enabled: !!userId, 
    refetchInterval: 60000,
    staleTime: 30000, 
    onError: (err) => {
      console.error("Erro ao buscar notificações:", err);
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) => markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications", userId]);
    },
    onError: (err) => {
      console.error("Erro ao marcar notificação como lida:", err);
    },
  });

  const markNotificationRead = (notificationId) => {
    console.log("Marking notification", notificationId);
    markAsReadMutation.mutate(notificationId);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markNotificationRead,
        refetchNotifications: refetch,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
