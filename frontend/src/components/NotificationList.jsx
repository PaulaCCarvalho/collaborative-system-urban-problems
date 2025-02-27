import { useEffect } from "react";
import { useNotifications } from "../core/NotificationContext";
import { RiCheckDoubleFill } from "react-icons/ri";

const NotificationList = () => {
  const { notifications, markNotificationRead } = useNotifications();

  useEffect(() => {
    console.log({notifications})
  }, [notifications])
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Notificações</h2>
      {notifications.data && notifications.data.length > 0 ? (
        <ul className="space-y-2 ">
          {notifications.data.map((notification) => (
            <li
              key={notification.id}
              className={`flex flex-col border border-gray-200 rounded-lg py-2 px-3 mb-2 shadow-sm ${notification.lida && "bg-gray-100"}`}
            >
              <p className="text-sm font-sans font-semibold">
                {notification.assunto}
              </p>
              <p className="text-xs text-gray-500 my-2">
                {new Date(notification.timestamp).toLocaleString()}
              </p>

              {!notification.lida ? (
                <button
                  onClick={() => markNotificationRead(notification.id)}
                  className="text-blue-600 text-xs cursor-pointer mt-2 lex items-center justify-end"
                >
                  Marcar como lida
                </button>
              ) : (
                <div className="flex items-center justify-end text-xs">
                  <span className="text-blue-600">Lida</span>
                  <RiCheckDoubleFill className="text-blue-600" />
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma notificação encontrada.</p>
      )}
    </div>
  );
};

export default NotificationList;
