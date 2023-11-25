"use client";
import React, { useState } from "react";
import {
  Layout,
  Button,
  Col,
  Row,
  DatePicker,
  Select,
  Form,
  Input,
  Checkbox,
  notification,
  InputNumber,
} from "antd";
import MenuComponent from "@/components/menu";
const { Content, Footer, Sider } = Layout;
export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["1"]);
  const [formData] = Form.useForm();
  const showErrorNotification = (error: any) => {
    notification.error({
      message: "Error",
      description: error,
      placement: "topRight",
    });
  };

  const showSuccessNotification = (message: any) => {
    notification.success({
      message: "Éxito",
      description: message,
      placement: "topRight",
    });
  };

  const onFinish = async (form: any) => {
    try {
      console.log("form:", form);
      const response = await fetch("/api/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      console.log("Response status:", response.status);
      if (response.ok) {
        console.log("wtf??");
        showSuccessNotification("Usuario registrado  exitosamente !!");
        formData.resetFields();
      } else {
        const data = await response.json();
        formData.resetFields();
        console.log("eror data else:", data.error);
        showErrorNotification(
          data.error ||
            "Error al crear usuario, revice si lleno los ratos correctamente"
        );
      }
    } catch (error) {
      showErrorNotification(
        error.message || "Error de conexion, consulte soporte"
      );
      formData.resetFields();
    }
  };
  const handleMenuSelect = (keys: string[]) => {
    setSelectedKeys(keys);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <MenuComponent
          selectedKeys={selectedKeys}
          onMenuSelect={handleMenuSelect}
        />
      </Sider>
      <Layout>
        <Content>
          <Form
            form={formData}
            name="basic"
            onFinish={onFinish}
            layout="vertical"
            style={{
              boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
              borderRadius: "10px",
              padding: "20px",
              margin: "20px",
              marginBlock: "50px",
              backgroundColor: "Background",
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Nombre"
                  name="firstName"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Apellido"
                  name="lastName"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Telefono"
                  name="phoneNumber"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <InputNumber size="large" min={1} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="RUT"
                  name="identificationNumber"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Fecha Nacimiento"
                  name="birthDate"
                  style={{ width: "100%" }}
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Edad"
                  name="age"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <InputNumber size="large" min={1} style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Direccion"
                  name="adress"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Genero"
                  name="gender"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <Select size="large" >
                    <Select.Option value="male">Hombre</Select.Option>
                    <Select.Option value="female">Mujer</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Contraseña"
                  name="password"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <Input.Password size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="nurseConfirmation" valuePropName="checked">
                  <Checkbox style={{ paddingTop: 35 }}>
                    ¿El usuario es enfermera/o?
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%", marginTop: 30 }}
                >
                  Registrar
                </Button>
              </Col>
            </Row>
          </Form>
        </Content>
        <Footer style={{ textAlign: "center" }}></Footer>
      </Layout>
    </Layout>
  );
}
