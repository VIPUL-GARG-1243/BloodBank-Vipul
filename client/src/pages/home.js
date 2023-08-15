import { useSelector } from "react-redux";
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SetLoading } from "../redux/loaderSlice";
import { GetAllBloodGroupsDataFromInventory } from "../apicalls/dashBoardCalls";
import { GetLoggedInUserName } from "../utils/helper";
import HomePageInventory from "./HomePageInventory";

function Home() {
  const { currentUser } = useSelector((state) => state.users);
  const [bloodGroupsData, setBloodGroupsData] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllBloodGroupsDataFromInventory();
      dispatch(SetLoading(false));
      if (response.success) {
        setBloodGroupsData(response.data);
        message.success(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const colors = [
    "#CE5959",
    "#1A5F7A",
    "#886218",
    "#245953",
    "#2C3333",
    "#4E6E81",
    "#A84448",
    "#635985",
  ];
  return (
    <div className="mt-3">
      <span className="text-primary text-4xl flex justify-center font-semibold">
        Welcome {GetLoggedInUserName(currentUser).toUpperCase()}
      </span>
      {currentUser.userType === "organization" && (
        <>
          <div className="grid grid-cols-4 gap-5 mt-5">
            {bloodGroupsData.map((bloodGroup, index) => {
              const color = colors[index];
              return (
                <div
                  className="p-5 flex justify-between text-white rounded items-center"
                  style={{ backgroundColor: color }}
                >
                  <h1 className="text-5xl uppercase">
                    {bloodGroup.bloodGroup}
                  </h1>
                  <div className="flex flex-col justify-between gap-2">
                    <div className="flex justify-between gap-5">
                      <span>Total In</span>
                      <span>{bloodGroup.totalIn} ML</span>
                    </div>
                    <div className="flex justify-between gap-5">
                      <span>Total Out</span>
                      <span>{bloodGroup.totalOut} ML</span>
                    </div>
                    <div className="flex justify-between gap-5">
                      <span>Available</span>
                      <span>{bloodGroup.available} ML</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5">
            <span className="text-2xl text-primary font-semibold">
              Your Recent Inventory
            </span>
          </div>
          <div>
            <HomePageInventory filters={{ limit: 5 }} />
          </div>
        </>
      )}
      {(currentUser.userType === "donar" || currentUser.userType === "hospital") && (
        <>
          <div className="mt-5">
            <span className="text-2xl text-primary font-semibold">
              Your Recent Inventory
            </span>
          </div>
          <div>
            <HomePageInventory filters={{ limit: 5 }} />
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
