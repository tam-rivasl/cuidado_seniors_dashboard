import React, { useEffect, useState } from "react";
import {
  Select,
  Form,
  Button,
  Layout,
  message,
  DatePicker,
  Input,
  TimePicker,
  Row,
  Col,
  notification,  // Importa notification de Ant Design
} from "antd";

import MenuComponent from "../components/menu";
import moment from "moment";

const { Content, Footer, Sider } = Layout;

export default function Home() {
  const [form] = Form.useForm();
  const [planServiceData, setPlanService] = useState([] as any);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["1"]);

  const handleMenuSelect = (keys: string[]) => {
    setSelectedKeys(keys);
  };

  // Función para mostrar notificaciones de éxito
  const showSuccessNotification = (message: any) => {
    notification.success({
      message: 'Éxito',
      description: message,
      placement: 'topRight', // Cambia la ubicación según tus necesidades
    });
  };

  // Función para mostrar notificaciones de error
  const showErrorNotification = (error: any) => {
    notification.error({
      message: 'Error',
      description: error,
      placement: 'topRight', // Cambia la ubicación según tus necesidades
    });
  };

  const onFinish = (formValues: any) => {
    console.log("form:", formValues);
    console.log(localStorage.getItem('userId'))
    const date = formValues.date.format("YYYY-MM-DD");
    const requestBody = {
      date: date,
      plan_serviceId: formValues.plan_serviceId,
      nurseId: localStorage.getItem('userId')
    };
    console.log(formValues.plan_serviceId,'req')
    fetch("/api/createAppointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.ok) {
          showSuccessNotification("Cita creada correctamente !!");
          form.resetFields();
        } else {
          response.json().then((data) => {
            showErrorNotification(data.message || "No existen citas para la fecha");
          });
        }
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification(error.message || "Error al crear la cita");
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
      setPlanService(data);
    } catch (error: any) {
      showErrorNotification(error?.message || "La solicitud no tuvo éxito");
    }
  };

  const handlePlanServiceChange = (value: any) => {
    // Busca el plan de servicio seleccionado en planServiceData
    const selectedPlan = planServiceData.find((plan: { plan_serviceId: any; }) => plan.plan_serviceId === value);

    if (selectedPlan) {
      // Actualiza el formulario con los datos del plan de servicio seleccionado
      form.setFieldsValue({
        startTime: moment(selectedPlan.startTime, "HH:mm"),
        endTime: moment(selectedPlan.endTime, "HH:mm"),
        description: selectedPlan.description,
      });
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <MenuComponent selectedKeys={selectedKeys} onMenuSelect={handleMenuSelect} />
      </Sider>
      <Layout>
        <Content>
          <Form
            form={form}
            name="appointment"
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
                  name="plan_serviceId"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                  style={{ width: "100%" }}
                >
                  <Select
                    style={{ width: "100%" }}
                    options={planServiceData.map((item: any) => ({
                      value: item.plan_serviceId,
                      label: item.planServiceName,
                    }))}
                    onChange={handlePlanServiceChange}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Hora de Inicio"
                  name="startTime"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <TimePicker format="HH:mm" style={{ width: "100%" }} disabled/>
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Hora de Término"
                  name="endTime"
                  rules={[
                    { required: true, message: "Campo obligatorio" },
                    { validator: validateEndTime },
                  ]}
                >
                  <TimePicker format="HH:mm" style={{ width: "100%" }} disabled/>
                </Form.Item>
              </Col>

              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Descripción"
                  name="description"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <Input style={{ width: "100%" }} disabled />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%", marginTop: 30 }}
                >
                  Crear Cita
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
