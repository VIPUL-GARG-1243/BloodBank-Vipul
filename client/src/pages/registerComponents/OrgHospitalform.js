import React from "react";
import { Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { GetAntdInputValidation } from "../../utils/helper";

const OrgHospitalform = ({ type }) => {
  return (
    <>
      <Form.Item
        label={type === "hospital" ? "Hospital Name" : "Organization Name"}
        name={type === "hospital" ? "hospitalName" : "organizationName"}
        rules={GetAntdInputValidation()}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Owner" name="owner" rules={GetAntdInputValidation()}>
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email" rules={GetAntdInputValidation()}>
        <Input type="email" />
      </Form.Item>
      <Form.Item label="Phone" name="phone" rules={GetAntdInputValidation()}>
        <Input type="number" />
      </Form.Item>
      <Form.Item label="Website" name="website" rules={GetAntdInputValidation()}>
        <Input  />
      </Form.Item>
      <Form.Item label="Password" name="password" rules={GetAntdInputValidation()}>
        <Input type="password" />
      </Form.Item>
      <Form.Item label="Address" name="address" className="col-span-2" rules={GetAntdInputValidation()}>
        <TextArea />
      </Form.Item>
    </>
  );
};

export default OrgHospitalform;
