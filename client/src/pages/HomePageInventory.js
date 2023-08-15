import { Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../redux/loaderSlice";
import { GetDateFormat } from "../utils/helper";
import { GetInventoryForSpecificOrganization } from "../apicalls/inventoryCalls";

function HomePageInventory(filters) {
    const { currentUser } = useSelector((state) => state.users);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  let columns = null;
  if(currentUser.userType === "organization") {
    columns = [
        {
          title: "Inventory Type",
          dataIndex: "inventoryType",
          render: (text) => text.toUpperCase(),
        },
        {
          title: "Blood Group",
          dataIndex: "bloodGroup",
          render: (text) => text.toUpperCase(),
        },
        {
          title: "Quantity (ML)",
          dataIndex: "quantity",
          render: (text) => text + " ML",
        },
        {
          title: "Reference",
          dataIndex: "reference",
          render: (text, record) => {
            if (record.inventoryType === "in") {
              return record.donar.name.toUpperCase();
            } else {
              return record.hospital.hospitalName.toUpperCase();
            }
          },
        },
        {
          title: "Date",
          dataIndex: "createdAt",
          render: (text) => GetDateFormat(text),
        },
      ];
  }
  else {
    columns = [
        {
          title: "Blood Group",
          dataIndex: "bloodGroup",
          render: (text) => text.toUpperCase()
        },
        {
          title: "Quantity (ML)",
          dataIndex: "quantity",
          render: (text) => text + " ML"
        },
        {
          title: "Reference",
          dataIndex: "reference",
          render: (text, record) => record.organization.organizationName.toUpperCase()
        },
        {
          title: "Phone No.",
          dataIndex: "phoneNo",
          render: (text, record) => record.organization.phone
        },
        {
          title: "Website",
          dataIndex: "Website",
          render: (text, record) => record.organization.website
        },
        {
          title: "Date",
          dataIndex: "createdAt",
          render: (text) => GetDateFormat(text)
        }
      ];
      columns[5].title = currentUser.userType === "hospital" ? "Taken on" : "Donated on";
      columns.splice(4, 1);
      columns[2].title = "Organization Name";
  }
  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetInventoryForSpecificOrganization(filters);
      dispatch(SetLoading(false));
      if (response.success) {
        setData(response.data);
        //   message.success(response.message);
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
  return (
    <div>
        {currentUser.userType === "organization" && (
            <>
            <Table className="mt-4" columns={columns} dataSource={data} />
            </>
        )}
        {(currentUser.userType === "donar" || currentUser.userType === "hospital") && (
            <>
            <Table className="mt-4" columns={columns} dataSource={data} />
            </>
        )}
    </div>
  );
}

export default HomePageInventory;
