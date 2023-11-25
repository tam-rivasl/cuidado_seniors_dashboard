import React from "react";
import { LoginOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Row,
  DatePicker,
  Select,
  Form,
  Input,
  Card,
  Checkbox,
  notification,
  InputNumber,
} from "antd";
import Link from 'next/link';
export default function Home() {
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
      if (response.ok) {
        showSuccessNotification("Usuario registrado  exitosamente !!");
        formData.resetFields();
        window.location.href = "/login";
      } else {
        formData.resetFields();
        const data = await response.json();
        showErrorNotification(
          data.error ||
            "Error al crear usuario, revice si lleno los ratos correctamente"
        );
      }
    } catch (error) {
      console.error(error);
      showErrorNotification(error || "Error de conexion, consulte soporte");
      formData.resetFields();
    }
  };

  return (
    <div className="container">
      <Card className="card-register">
      <Link href="/" color='primary'>
            Volver a Inicio
          </Link>
        <img
          src="/img/register.png" // Ruta relativa a la carpeta "public"
          className="logo-register"
          alt="logo-register"
        />
        <Form
          form={formData}
          name="basic"
          onFinish={onFinish}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Nombre"
                name="firstName"
                rules={[{ required: true, message: "Campo obligatorio" }]}
              >
                <Input
                  size="large"
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
                rules={[{ required: true, message: "Campo obligatorio" }]}
              >
                <Input
                  size="large"
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
                rules={[{ required: true, message: "Campo obligatorio" }]}
              >
                <Input
                  size="large"
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
                rules={[{ required: true, message: "Campo obligatorio" }]}
              >
                <InputNumber
                  size="large"
                  min={1}
                  style={{ width: "100%" }}
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
                rules={[{ required: true, message: "Campo obligatorio" }]}
              >
                <Input
                  size="large"
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
                rules={[{ required: true, message: "Campo obligatorio" }]}
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
                rules={[{ required: true, message: "Campo obligatorio" }]}
              >
                <InputNumber
                  size="large"
                  min={1}
                  style={{ width: "100%" }}
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
                rules={[{ required: true, message: "Campo obligatorio" }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Genero"
                name="gender"
                rules={[{ required: true, message: "Campo obligatorio" }]}
              >
                <Select
                size="large"
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
                rules={[{ required: true, message: "Campo obligatorio" }]}
              >
                <Input.Password
                  size="large"
                  className="your-custom-class"
                  placeholder="Contraseña"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="nurseConfirmation" valuePropName="checked">
                <Checkbox style={{ paddingTop: 35 }}>
                  ¿Eres enfermera/o?
                </Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Button
                htmlType="submit"
                block
                className="w-100"
                type="primary"
                icon={<LoginOutlined />}
              >
                Registrarse
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}
