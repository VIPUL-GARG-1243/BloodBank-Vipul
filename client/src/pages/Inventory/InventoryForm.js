import { Form, Input, Modal, Radio, message } from "antd";
import React, { useState } from "react";
import { GetAntdInputValidation } from "../../utils/helper";
import { useDispatch, useSelector } from 'react-redux';
import { AddInventory } from "../../apicalls/inventoryCalls";
import { SetLoading } from "../../redux/loaderSlice";

function InventoryForm({ open, setOpen, reloadData }) {
    const [form] = Form.useForm();
    const [inventoryType, setInventoryType] = useState("in");
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.users);
    const finish = async (values) => {
        try {
            dispatch(SetLoading(true));
            const response = await AddInventory({
                ...values,
                inventoryType: inventoryType,
                organization: currentUser._id
            });
            dispatch(SetLoading(false));
            if(response.success) {
                setOpen(false);
                reloadData();
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
  return (
    <Modal
      title="ADD INVENTORY"
      open={open}
      onCancel={() => setOpen(false)}
      centered
      onOk={() => {
        form.submit();
      }}
    >
        <Form layout="vertical" className="flex flex-col gap-3" form={form} onFinish={finish}>   
            <Form.Item label="Inventory Type">
                <Radio.Group value={inventoryType} onChange={(e) => {setInventoryType(e.target.value)}}>
                    <Radio value="in">In</Radio>
                    <Radio value="out">Out</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="Blood Group" name="bloodGroup" rules={GetAntdInputValidation()}>
                <select>
                    <option>Select an Option</option>
                    <option value="a+">A+</option>
                    <option value="a-">A-</option>
                    <option value="b+">B+</option>
                    <option value="b-">B-</option>
                    <option value="ab+">AB+</option>
                    <option value="ab-">AB-</option>
                    <option value="o+">O+</option>
                    <option value="o-">O-</option>
                </select>
            </Form.Item>
            <Form.Item name="email" rules={GetAntdInputValidation()} label={inventoryType === "in" ? "Donar Email" : "Hospital Email"}>
                <Input type="email"/>
            </Form.Item>
            <Form.Item label="Quantity (ML)" name="quantity" rules={GetAntdInputValidation()}>
                <Input type="number" />
            </Form.Item>
        </Form>
    </Modal>
  );
}

export default InventoryForm;