import React, { useEffect, useState } from "react";
import { Form, Input, Button, Radio, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import OrgHospitalform from "./registerComponents/OrgHospitalform";
import { RegisterUser } from "../apicalls/userCalls";
import { useDispatch } from "react-redux";
import { SetLoading } from "../redux/loaderSlice";
import { GetAntdInputValidation } from "../utils/helper";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [type, setType] = useState("donar");
  const finish = async (values) => {
    try {
      dispatch(SetLoading(true));
      const response = await RegisterUser({
        ...values,
        userType: type,
      });
      dispatch(SetLoading(false));
      if(response.success) {
        message.success(response.message);
        navigate("/login");
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
    if(localStorage.getItem("token")) {
      navigate("/");
    }
  }, [])
  return (
    <div className="flex h-screen justify-center items-center bg-primary">
      <Form
        layout="vertical"
        className="bg-white rounded shadow grid grid-cols-2 gap-5 p-5 w-1/2"
        onFinish={finish}
      >
        <h1 className="col-span-2 uppercase">
          <span className="text-primary">{type.toUpperCase()} - Registration</span>
          <hr />
        </h1>
        <Radio.Group onChange={(e) => setType(e.target.value)} value={type} className="col-span-2">
          <Radio value="donar">Donar</Radio>
          <Radio value="hospital">Hospital</Radio>
          <Radio value="organization">Organization</Radio>
        </Radio.Group>
        {type === "donar" && (
          <>
            <Form.Item name="name" label="Name" rules={GetAntdInputValidation()}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={GetAntdInputValidation()}>
              <Input type="email" />
            </Form.Item>
            <Form.Item name="phone" label="Phone" rules={GetAntdInputValidation()}>
              <Input type="number" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={GetAntdInputValidation()}>
              <Input type="password" />
            </Form.Item>
          </>
        )}
        {type !== "donar" && <OrgHospitalform type={type}/>}
        <Button type="primary" className="col-span-2" htmlType="submit">
          Register
        </Button>
        <Link
          to="/login"
          className="col-span-2 text-center text-gray-700 underline"
        >
          Already have an account? Login
        </Link>
      </Form>
    </div>
  );
};

export default Register;
