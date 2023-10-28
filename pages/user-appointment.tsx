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
} from "antd";
import moment from "moment";
import MenuComponent from "@/components/menu";

const { Header, Content, Footer, Sider } = Layout;
const { Option } = Select;

export default function Home() {
  const [form] = Form.useForm();
  const [messageApi] = message.useMessage();
  const [planServiceData, setPlanService] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [nurses, setNurses] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);


  const handleDateChange = async (date: any) => {
    // Hacer una solicitud para obtener los datos de los planes y las enfermeras disponibles para la fecha seleccionada
    try {
      const requestBody = {
        date: date.format("YYYY-MM-DD"),
        plan_serviceId: form.getFieldValue("plan_serviceId"),
      };

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

        messageApi.open({
          type: "success",
          content: "Datos cargados correctamente !!",
        });
      } else {
        throw new Error("Error al cargar los datos");
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.message || "Error al cargar los datos",
      });
    }
  };

  const handlePlanServiceChange = async(plan_service:any)=>{ 
    const foundPlanService: any = planServiceData.find((data: any) => data.plan_serviceId === plan_service);
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
        patient: localStorage.getItem('userId'),
        appointmentId:  formValues.appointmentId ,
      };

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
        <div className="demo-logo-vertical" />
        <MenuComponent selectedKeys={selectedKeys} onMenuSelect={handleMenuSelect} />
      </Sider>
      <Layout>
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
                  <DatePicker
                    format="YYYY-MM-DD"
                    style={{ width: "100%" }}
                    onChange={handleDateChange}
                  />
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
