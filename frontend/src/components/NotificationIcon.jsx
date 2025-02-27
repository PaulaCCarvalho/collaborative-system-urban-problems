import { FaBell } from "react-icons/fa";
import { useNotifications } from "../core/NotificationContext";

const NotificationIcon = ({ onClick }) => {
  const { notifications } = useNotifications();
  const unreadCount = Array.isArray(notifications.data)
    ? notifications.data.filter((n) => !n.lida).length
    : 0;

  return (
    <button
      type="button"
      className="relative inline-flex items-center cursor-pointer"
      onClick={onClick}
    >
      <FaBell className="text-2xl text-gray-600 hover:text-gray-800 transition-colors" />
      <span className="sr-only">Notificações</span>
      {unreadCount > 0 && (
        <div className="absolute inline-flex items-center justify-center w-4 h-4 text-[0.6rem] font-bold text-white bg-red-500 border border-white rounded-full -top-1.5 -end-1.5">
          {unreadCount}
        </div>
      )}
    </button>
  );
};

export default NotificationIcon;
