"use client"
import React, { useState } from 'react';
import type { MenuProps } from 'antd';
import { message, Layout, theme, Button, Col, Row, DatePicker, Select, Form, Input } from 'antd';
import MenuComponent from '@/components/menu';

const {Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);
  const [messageApi] = message.useMessage();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onFinish = (form: any) => {
    console.log('form:', form)
    fetch('/api/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then((_) => {
        messageApi.open({
          type: 'success',
          content: 'Usuario creado correctamente !!',
        });
      })
      .catch((error) => {
        messageApi.open({
          type: 'error',
          content: error,
        });
      });
  };
  const handleMenuSelect = (keys: string[]) => {
    setSelectedKeys(keys);
  };
  const onFinishFailed = (errorInfo: any) => {
    messageApi.open({
      type: 'error',
      content: 'Debe rellenar los campos correctamente!',
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }} >
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <MenuComponent selectedKeys={selectedKeys} onMenuSelect={handleMenuSelect} />
      </Sider>
      <Layout>
        <Content>
          <Form
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
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
                  rules={[
                    { required: true, message: 'Campo obligatorio' },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Apellido"
                  name="lastName"
                  rules={[
                    { required: true, message: 'Campo obligatorio' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Campo obligatorio' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Telefono"
                  name="phoneNumber"
                  rules={[
                    { required: true, message: 'Campo obligatorio' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="RUT"
                  name="identificationNumber"
                  rules={[
                    { required: true, message: 'Campo obligatorio' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Fecha Nacimiento"
                  name="birthDate"
                  style={{ width: "100%" }}
                  rules={[
                    { required: true, message: 'Campo obligatorio' }
                  ]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Edad"
                  name="age"
                  rules={[
                    { required: true, message: 'Campo obligatorio' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
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
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Genero"
                  name="gender"
                  rules={[
                    { required: true, message: 'Campo obligatorio' }
                  ]}
                >
                  <Select>
                    <Select.Option value="male">Hombre</Select.Option>
                    <Select.Option value="female">Mujer</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Contraseña"
                  name="password"
                  rules={[
                    { required: true, message: 'Campo obligatorio' }
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
              <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%", marginTop: 30 }}
                >
                  Registrarse
                </Button>
              </Col>
            </Row>
          </Form>
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </Layout>
  )
}
