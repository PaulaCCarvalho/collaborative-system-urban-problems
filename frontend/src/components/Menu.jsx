import { HiOutlineMenu } from "react-icons/hi";
import { useAuth } from "../core/AuthContext";
import { useNavigate } from "react-router";
import { HiOutlineLogout } from "react-icons/hi";
import NotificationIcon from "./NotificationIcon";

const Menu = ({ setSidebarType }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuth = () => {
    if (user) {
      logout();
    }
  };

  const handleNotificationClick = () => {
    setSidebarType((prev) =>
      prev === "notifications" ? null : "notifications"
    );
  };

  const handleMenuClick = () => {
    setSidebarType((prev) => (prev === "filters" ? null : "filters"));
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-lg py-3 h-16 flex justify-center">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          Problemas Urbanos BH
        </div>

        <nav>
          <ul className="flex space-x-6 items-center">
            {user && (
              <li>
                <NotificationIcon onClick={handleNotificationClick} />
              </li>
            )}
            {!user && (
              <>
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer font-semibold"
                  >
                    <span>Entrar</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/cadastro")}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer font-semibold"
                  >
                    <span>Cadastrar</span>
                  </button>
                </li>
              </>
            )}
            {user && (
              <li>
                <button
                  onClick={handleAuth}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer font-semibold px-4"
                >
                  <HiOutlineLogout className="text-xl" />
                  <span>Sair</span>
                </button>
              </li>
            )}
            <li>
              <button
                onClick={handleMenuClick}
                className="flex justify-center cursor-pointer"
              >
                <HiOutlineMenu className="text-2xl text-gray-600 hover:text-gray-900 transition-colors" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Menu;
