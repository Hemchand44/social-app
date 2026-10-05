import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav.jsx";

const AppLayout = () => {
    return (
        <div className="min-h-screen bg-gray-200">
            
            {/* Mobile App Container */}
            <div className="mx-auto min-h-screen w-full max-w-[430px] bg-white shadow-2xl">
                
                <main className="pb-20">
                    <Outlet />
                </main>

            </div>

            <BottomNav />
        </div>
    );
};

export default AppLayout;