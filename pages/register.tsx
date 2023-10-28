import React from "react";
import { LoginOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  message,
  Layout,
  Button,
  Col,
  Row,
  DatePicker,
  Select,
  Form,
  Input,
  Card,
  Checkbox,
} from "antd";
//import 'public/styles/global.css'; // Asegúrate de usar la ruta correcta al archivo CSS
import { Container } from "postcss";

const { Content, Footer } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export default function Home() {
  const [messageApi] = message.useMessage();

  const onFinish = (form: any) => {
    console.log("form:", form);
    fetch("/api/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((_) => {
        messageApi.open({
          type: "success",
          content: "Usuario creado correctamente !!",
        });
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: error,
        });
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    messageApi.open({
      type: "error",
      content: "Debe rellenar los campos correctamente!",
    });
  };

  return (
    <div className="container">
      <Card className="card-register">
      <img
        src="/img/register.png" // Ruta relativa a la carpeta "public"
        className="logo-register"
        alt="logo-register"
      />
        <Form
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Nombre"
                name="firstName"
                rules={[
                  { required: true, message: "Campo obligatorio" },
                ]}
              >
                <Input
                  className="your-custom-class"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Nombre"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Apellido"
                name="lastName"
                rules={[
                  { required: true, message: "Campo obligatorio" },
                ]}
              >
                <Input
                  className="your-custom-class"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Apellido"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Campo obligatorio" },
                ]}
              >
                <Input
                  className="your-custom-class"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Telefono"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Campo obligatorio" },
                ]}
              >
                <Input
                  className="your-custom-class"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Telefono"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="RUT"
                name="identificationNumber"
                rules={[
                  { required: true, message: "Campo obligatorio" },
                ]}
              >
                <Input
                  className="your-custom-class"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="RUT"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Fecha Nacimiento"
                name="birthDate"
                style={{ width: "100%" }}
                rules={[
                  { required: true, message: "Campo obligatorio" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Fecha de Nacimiento"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Edad"
                name="age"
                rules={[
                  { required: true, message: "Campo obligatorio" },
                ]}
              >
                <Input
                  className="your-custom-class"
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Edad"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item
                  label="Direccion"
                  name="adress"
                  rules={[
                    { required: true, message: 'Campo obligatorio' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Genero"
                name="gender"
                rules={[
                  { required: true, message: "Campo obligatorio" },
                ]}
              >
                <Select
                  className="your-custom-class"
                  placeholder="Seleccione su género"
                >
                  <Select.Option value="male">Hombre</Select.Option>
                  <Select.Option value="female">Mujer</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Contraseña"
                name="password"
                rules={[
                  { required: true, message: "Campo obligatorio" },
                ]}
              >
                <Input.Password
                  className="your-custom-class"
                  placeholder="Contraseña"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="nurseConfirmation"   
                valuePropName="checked"
              >
                 <Checkbox style={{paddingTop:35}}>¿Eres enfermera/o?</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Button htmlType="submit" block className="w-100" type="primary"  icon={<LoginOutlined />}>
                Registrarse
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}
