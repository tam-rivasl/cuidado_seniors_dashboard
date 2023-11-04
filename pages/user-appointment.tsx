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
  notification,
} from "antd";
import moment from "moment";
import MenuComponent from "../components/menu";

const { Content, Footer, Sider } = Layout;


export default function Home() {
  const [form] = Form.useForm();
  const [messageApi] = message.useMessage();
  const [planServiceData, setPlanService] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [nurses, setNurses] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);

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
  const handleDateChange = async (date: any) => {
      try {
      const requestBody = {
        date: date.format("YYYY-MM-DD"),
        plan_serviceId: form.getFieldValue("plan_serviceId"),
      };
      console.log('requesbody?:', requestBody)
      const response = await fetch("/api/getAppointmentsByDate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('result', result)
        setNurses(result.map((data:any)=>{return{ ...data.nurse , appointmentId: data.appointmentId}}));
        //form.resetFields();
      } else {
        response.json().then((data) => {
          showErrorNotification(data.message || "No existe citas para la fecha indicada");
        });
      }
    } catch (error) {
      showErrorNotification(error.message || "Error al crear la cita");
    }
  };

  const handlePlanServiceChange = async(plan_serviceId:any)=>{ 
    const foundPlanService: any = planServiceData.find((data: any) => data.plan_serviceId === plan_serviceId);
    form.setFieldsValue({
      startTime: moment(foundPlanService.startTime, "HH:mm"),
      endTime: moment(foundPlanService.endTime, "HH:mm"),
      description: foundPlanService.description,
      price: foundPlanService.price,
    });
  }
console.log(handlePlanServiceChange);
  const onFinish = async (formValues:any) => {
    try {
      // Realizar la creación de la cita
      const requestBody = {
        patientId: localStorage.getItem('userId'),
        appointmentId:  formValues.appointmentId ,
      };

      console.log('user iddddd?,', requestBody.patientId)
      const response = await fetch("/api/createAppointmentPatient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Procesar la respuesta, si es necesario
        messageApi.open({
          type: "success",
          content: "Cita creada correctamente !!",
        });
        form.resetFields();
      } else {
        throw new Error("Error al crear la cita");
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.message || "Error al crear la cita",
      });
    }
  };

  useEffect(() => {
    getPlanService();
  }, []);

  const handleMenuSelect = (keys: string[]) => {
    setSelectedKeys(keys);
  };

  const getPlanService = async () => {
    try {
      const response = await fetch("/api/getPlanService");
      if (response.ok) {
        const data = await response.json();
        setPlanService(data);
      } else {
        throw new Error("La solicitud no tuvo éxito");
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.message || "La solicitud no tuvo éxito",
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
          <Form className="form-perfil"
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
                  label="Plan de Servicio"
                  name="plan_serviceId"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                  style={{ width: "100%" }}
                >
                  <Select
                    style={{ width: "100%" }}
                    options={planServiceData.map((item) => ({
                      value: item.plan_serviceId,
                      label: item.planServiceName,
                    }))}
                    onChange={handlePlanServiceChange} 
                  />
                </Form.Item >
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Fecha"
                  name="date"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                  style={{ width: "100%" }}
                >
                  <DatePicker //disabled={!form.getFieldValue('plan_serviceId')}
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                    onChange={handleDateChange}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Hora de Inicio"
                  name="startTime"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <TimePicker format="HH:mm" style={{ width: "100%" }} inputReadOnly />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Hora de Término"
                  name="endTime"
                  rules={[
                    { required: true, message: "Campo obligatorio" },
                  ]}
                >
                  <TimePicker format="HH:mm" style={{ width: "100%" }} inputReadOnly />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Descripción"
                  name="description"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <Input style={{ width: "100%" }} readOnly />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Precio"
                  name="price"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <Input style={{ width: "100%" }} readOnly />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Enfermeras"
                  name="appointmentId"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <Select style={{ width: "100%" }}
                  options={nurses.map((item) => ({
                    value: item.appointmentId,
                    label: item.firstName + ' ' + item.lastName 
                  }))}>
                  </Select>
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
