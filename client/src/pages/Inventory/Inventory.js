import { Button, Table, message } from 'antd';
import React, { useEffect, useState } from 'react'
import InventoryForm from './InventoryForm';
import { useDispatch } from 'react-redux';
import { SetLoading } from '../../redux/loaderSlice';
import { GetInventory } from '../../apicalls/inventoryCalls';
import { GetDateFormat } from '../../utils/helper';

function Inventory() {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const dispatch = useDispatch();
    const columns = [
      {
        title: "Inventory Type",
        dataIndex: "inventoryType",
        render: (text) => text.toUpperCase()
      },
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
        render: (text, record) => {
          if(record.inventoryType === "in") {
            return record.donar.name.toUpperCase();
          }else {
            return record.hospital.hospitalName.toUpperCase();
          }
        }
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
        const response = await GetInventory();
        dispatch(SetLoading(false));
        if(response.success) {
          setData(response.data);
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
        <div className='flex justify-end'>
            <Button type='default' onClick={() => {setOpen(true)}}>Add Inventory</Button>
        </div>
        <Table className='mt-4' columns={columns} dataSource={data}/>
        {open && <InventoryForm open={open} setOpen={setOpen} reloadData={getData}></InventoryForm>}
    </div>
  )
}

export default Inventory