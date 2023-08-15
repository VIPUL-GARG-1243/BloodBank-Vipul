import { Modal, Table, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { SetLoading } from '../redux/loaderSlice';
import { GetDateFormat } from '../utils/helper';
import { GetAllOrganizationsForDonar, GetAllOrganizationsForHospital } from '../apicalls/userCalls';
import History from './History';

function Organizations({userType}) {
    const [showHistoryModel, setShowHistoryModel] = useState(false);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const [data, setData] = useState([]);
    const dispatch = useDispatch();
    const columns = [
      {
        title: "Organization Name",
        dataIndex: "organizationName",
        render: (text) => text.toUpperCase()
      },
      {
        title: "Email",
        dataIndex: "email",
        render: (text) => text.toLowerCase()
      },
      {
        title: "Phone No.",
        dataIndex: "phone"
      },
      {
        title: "Address",
        dataIndex: "address"
      },
      {
        title: "Date",
        dataIndex: "createdAt",
        render: (text) => GetDateFormat(text)
      }, 
      {
        title: "Action",
        dataIndex: "action",
        render: (text, record) => (
          <span className='underline text-md cursor-pointer' onClick={() => {
            setSelectedOrganization(record);
            setShowHistoryModel(true);
          }}>History</span>
        )
      }
    ];
    const getData = async () => {
      try {
        dispatch(SetLoading(true));
        let response = null;
        if(userType === "hospital") {
            response = await GetAllOrganizationsForHospital();
            // console.log(userType);
        }
        else {
            response = await GetAllOrganizationsForDonar();
            // console.log("donar");
        }
        dispatch(SetLoading(false));
        if(response.success) {
          setData(response.data);
          message.success(response.message);
        }
        else {
          throw new Error(response.message);
        }
      } catch (error) {
        dispatch(SetLoading(false));
        message.error(error.message);
      }
    }
    useEffect(() => {
      getData();
    }, [])
  return (
    <div>
        <Table className='mt-4' columns={columns} dataSource={data}/>

        {showHistoryModel && (
          <>
          <Modal
          title={userType === "hospital" ? `Consumption History in ${selectedOrganization.organizationName.toUpperCase()}` : `Donation History in ${selectedOrganization.organizationName.toUpperCase()}`}
          centered
          open={showHistoryModel}
          onCancel={() => setShowHistoryModel(false)}
          onOk={() => setShowHistoryModel(false)}
          width={1000}
          >
            <History filters={{organizationId: selectedOrganization._id}}/>
          </Modal>
          </>
        )}
    </div>
  )
}

export default Organizations