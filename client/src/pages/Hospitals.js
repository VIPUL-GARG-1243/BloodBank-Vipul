import { Table, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { SetLoading } from '../redux/loaderSlice';
import { GetDateFormat } from '../utils/helper';
import { GetAllHospitalsOfAnOrganization } from '../apicalls/userCalls';

function Hospitals() {
    const [data, setData] = useState([]);
    const dispatch = useDispatch();
    const columns = [
      {
        title: "Hospital Name",
        dataIndex: "hospitalName",
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
      }
    ];
    const getData = async () => {
      try {
        dispatch(SetLoading(true));
        const response = await GetAllHospitalsOfAnOrganization();
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
    </div>
  )
}

export default Hospitals