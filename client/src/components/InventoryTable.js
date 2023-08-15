import { Table, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { SetLoading } from '../redux/loaderSlice';
import { GetDateFormat } from '../utils/helper';
import { GetInventoryWithFilters } from '../apicalls/inventoryCalls';

function InventoryTable() {
    const [data, setData] = useState([]);
    const dispatch = useDispatch();
    const columns = [
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
    const getData = async () => {
      try {
        dispatch(SetLoading(true));
        const response = await GetInventoryWithFilters();
        dispatch(SetLoading(false));
        if(response.success) {
          setData(response.data);
        //   message.success(response.message);
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

export default InventoryTable