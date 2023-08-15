import { message } from "antd";
import React, { useEffect, useState } from "react";
import { GetCurrentUser } from "../apicalls/userCalls";
import { useNavigate } from "react-router-dom";
import { GetLoggedInUserName } from "../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser } from "../redux/userSlice";
import { SetLoading } from "../redux/loaderSlice";

function ProtectedPage({ children }) {
  const navigate = useNavigate();
  let effectMessage = true;
  // const [currentUser, setCurrentUser] = useState(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);
  const getCurrentUser = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetCurrentUser();
      dispatch(SetLoading(false));
      if (response.success) {
        if(effectMessage) {
            message.success(response.message);
            effectMessage = false;
        }
        dispatch(SetCurrentUser(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);
  return (
    currentUser && (
      <div>
        {/* <h1>Welcome {GetLoggedInUserName(currentUser)}</h1> */}
        <div className="flex justify-between items-center bg-primary text-white px-5 py-3 mx-5 rounded-b">
          <div className="flex flex-col">
            <h1 className="text-2xl cursor-pointer" onClick={() => navigate("/")}>Blood Bank</h1>
            <span className="text-sm">{`(${currentUser.userType.toUpperCase()})`}</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="ri-shield-user-line mr-1"></i>
            <span className="mr-5 text-xl cursor-pointer underline" onClick={() => navigate("/profile")}>{GetLoggedInUserName(currentUser).toUpperCase()}</span>
            <i className="ri-logout-circle-r-line ml-5 cursor-pointer" onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}></i>
          </div>
        </div>

        <div className="px-5 py-2">{children}</div>
      </div>
    )
  );
}

export default ProtectedPage;
