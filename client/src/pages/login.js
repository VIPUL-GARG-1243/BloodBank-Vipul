import React, { useEffect, useState } from "react";
import { Form, Input, Button, Radio, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../apicalls/userCalls";
import { useDispatch } from "react-redux";
import { SetLoading } from "../redux/loaderSlice";
import { GetAntdInputValidation } from "../utils/helper";

const Login = () => {
  const [type, setType] = useState("donar");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const finish = async (values) => {
    try {
      dispatch(SetLoading(true));
      const response = await LoginUser({
        ...values,
        userType: type
      });
      dispatch(SetLoading(false));
      if(response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        navigate("/");
      }
      else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };
  useEffect(() => {
    if(localStorage.getItem("token")) {
      navigate("/");
    }
  }, [])
  return (
    <div className="flex h-screen justify-center items-center bg-primary">
      <Form
        layout="vertical"
        className="bg-white rounded shadow grid gap-5 p-5 w-1/3"
        onFinish={finish}
      >
        <h1 className=" uppercase">
          <span className="text-primary">
            {type.toUpperCase()} - Registration
          </span>
          <hr />
        </h1>
        <Radio.Group
          onChange={(e) => setType(e.target.value)}
          value={type}
        >
          <Radio value="donar">Donar</Radio>
          <Radio value="hospital">Hospital</Radio>
          <Radio value="organization">Organization</Radio>
        </Radio.Group>
        <Form.Item name="email" label="Email" rules={GetAntdInputValidation()}>
          <Input type="email" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={GetAntdInputValidation()}>
          <Input type="password" />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
        <Link
          to="/register"
          className=" text-center text-gray-700 underline"
        >
          Don't have an account? Register
        </Link>
      </Form>
    </div>
  );
};

export default Login;
