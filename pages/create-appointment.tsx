import React, { useEffect, useState } from "react";
import {
  Select,
  Form,
  Button,
  Layout,
  message,
  DatePicker,
  Input,
  Row,
  Col,
} from "antd";
import type { MenuProps } from "antd";
import getPlanService from "./api/getPlanService";
import MenuComponent from '../components/menu';

const { Header, Content, Footer, Sider } = Layout;
const { Option } = Select;

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
  const [form] = Form.useForm();
  const [messageApi] = message.useMessage();
  const [planServiceData, setPlanService] = useState([] as any);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);
  const handleMenuSelect = (keys: string[]) => {
    setSelectedKeys(keys);
  };
  const onFinish = (formValues: any) => {
    console.log("form:", formValues);
    const date = formValues.date.format("YYYY-MM-DD");
    const requestBody = {
      date: date,
      plan_service: formValues.plan_service,
    };
    // Realiza la solicitud a la API con el objeto requestBody
    fetch("/api/createAppointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((_) => {
        messageApi.open({
          type: "success",
          content: "Cita creada correctamente !!",
        });
        // Puedes restablecer el formulario después de un éxito si es necesario
        form.resetFields();
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: error.message || "Error al crear la cita",
        });
      });
  };

  const validateEndTime = (rule, value, callback) => {
    if (value <= form.getFieldValue("startTime")) {
      callback("La Hora de Término debe ser posterior a la Hora de Inicio");
    } else {
      callback();
    }
  };

  useEffect(() => {
    getPlanService();
  }, []);

  const getPlanService = async () => {
    try {
      const response = await fetch("/api/getPlanService");
      if (!response.ok) {
        throw new Error("La solicitud no tuvo éxito");
      }
      const data = await response.json();
      console.log("data", data);
      setPlanService(data);
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error?.message ?? "La solicitud no tuvo éxito",
      });
    }
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
       <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <MenuComponent selectedKeys={selectedKeys} onMenuSelect={handleMenuSelect} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: "#fff" }} />
        <Content style={{ margin: "0 16px", background: "#fff", padding: 50 }}>
          <Form
            form={form}
            name="appointment"
            onFinish={onFinish}
            layout="vertical"
            style={{ padding: 20 }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Fecha"
                  name="date"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                  style={{ width: "100%" }}
                >
                  <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Plan de Servicio"
                  name="plan_service"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                  style={{ width: "100%" }}
                >
                  <Select
                    style={{ width: "100%" }}
                    options={planServiceData.map((item: any) => ({
                      value: item.plan_serviceId,
                      label: item.planServiceName,
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%", marginTop: 30 }}
                  >
                    Crear Cita
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Content>
        <Footer style={{ textAlign: "center" }}></Footer>
      </Layout>
    </Layout>
  );
}
