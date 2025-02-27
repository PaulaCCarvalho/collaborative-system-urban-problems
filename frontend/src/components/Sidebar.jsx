import { IoIosCloseCircleOutline } from "react-icons/io";
import FilterReports from "./FilterReports";
import DensityRegions from "./DensityRegions";
import DensityNeighborhood from "./DensityNeighborhood";
import NotificationList from "./NotificationList";
import AverageDistance from "./AverageDistance";

const Sidebar = ({ onClose, sidebarType }) => {
  return (
    <div
      className={`h-[calc(100vh-4rem)] bg-white shadow-xl transition-all duration-300 overflow-auto`}
    >
      <div className="p-1.5 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer"
        >
          <IoIosCloseCircleOutline className="text-red-500 hover:text-red-800 text-2xl" />
        </button>
        {sidebarType === "filters" && (
          <>
            <FilterReports />
            <DensityRegions />
            <DensityNeighborhood />
            <AverageDistance />
          </>
        )}
        {sidebarType === "notifications" && <NotificationList />}
      </div>
    </div>
  );
};

export default Sidebar;
