import { useNavigate } from "react-router-dom";

const BottomNav = () => {
    const navigate = useNavigate();

    return (
        <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] -translate-x-1/2 border-t border-gray-200 bg-white">
            <div className="flex h-16 items-center justify-around">

                <button
                    onClick={() => navigate("/feed")}
                    className="flex flex-1 items-center justify-center py-4 text-sm font-medium text-gray-700"
                >
                    Feed
                </button>

                <button
                    onClick={() => navigate("/messages")}
                    className="flex flex-1 items-center justify-center py-4 text-sm font-medium text-gray-700"
                >
                    Message
                </button>

                <button
                    onClick={() => navigate("/profile")}
                    className="flex flex-1 items-center justify-center py-4 text-sm font-medium text-gray-700"
                >
                    Profile
                </button>

            </div>
        </nav>
    );
};

export default BottomNav;