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
  InputNumber,
} from "antd";
import moment from "moment";
import MenuComponent from "../components/menu";
import axios from "axios";
export default function userAppointment() {
  const [form] = Form.useForm();
  const [messageApi] = message.useMessage();
  const [planServiceData, setPlanService] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [nurses, setNurses] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["1"]);
  const [datePickerDisabled, setDatePickerDisabled] = useState(true);
  const [nursesSelectDisabled, setNursesSelectDisabled] = useState(true);
  const { TextArea } = Input;
  const [showSecondForm, setShowSecondForm] = useState(false);
  const { Content, Footer, Sider } = Layout;
  const [url, setUrl] = useState<null | string>(null);
  const showSuccessNotification = (message: any) => {
    notification.success({
      message: "Éxito",
      description: message,
      placement: "topRight", // Cambia la ubicación según tus necesidades
    });
  };

  // Función para mostrar notificaciones de error
  const showErrorNotification = (error: any) => {
    notification.error({
      message: "Error",
      description: error,
      placement: "topRight", // Cambia la ubicación según tus necesidades
    });
  };

  const handleDateChange = async (date: any) => {
    if (!date) {
      console.log("Fecha no seleccionada");
      setNursesSelectDisabled(true); // Deshabilitar el campo de selección de enfermeras
      return;
    }
    try {
      const requestBody = {
        date: date?.format("YYYY-MM-DD"),
        plan_serviceId: form.getFieldValue("plan_serviceId"),
      };
      console.log("requesbody?:", requestBody);
      const response = await fetch("/api/getAppointmentsByDate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("result", result);
        setNurses(
          result.map((data: any) => ({
            ...data.nurse,
            appointmentId: data.appointmentId,
          }))
        );
        setNursesSelectDisabled(false); // Habilitar el campo de selección de enfermeras
        //form.resetFields();
      } else {
        response.json().then((data) => {
          showErrorNotification(
            data.message || "No existe citas para la fecha indicada"
          );
          setNursesSelectDisabled(true);
        });
      }
    } catch (error) {
      console.log("error", error);
      showErrorNotification(error || "Error al crear la cita");
      setNursesSelectDisabled(true); // Deshabilitar el campo de selección de enfermeras en caso de error
    }
  };

  const handlePlanServiceChange = async (plan_serviceId: any) => {
    const foundPlanService: any = planServiceData.find(
      (data: any) => data.plan_serviceId === plan_serviceId
    );
    form.setFieldsValue({
      startTime: moment(foundPlanService.startTime, "HH:mm"),
      endTime: moment(foundPlanService.endTime, "HH:mm"),
      description: foundPlanService.description,
      price: foundPlanService.price,
    });
    setDatePickerDisabled(!plan_serviceId);
  };
  console.log(handlePlanServiceChange);
  const onFinish = async (formValues: any) => {
    try {
      await getUserData();
      console.log("pasa ");
      const requestBody = {
        patientId: localStorage.getItem("userId"),
        appointmentId: formValues.appointmentId,
      };

      console.log("user iddddd?,", requestBody.patientId);
      const response = await fetch("/api/createAppointmentPatient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        if (showSecondForm) {
          onFinishMedicalRecord(formValues);
        }
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
  const onFinishMedicalRecord = async (formValues: any) => {
    try {
      const requestBody = {
        alergias: formValues?.alergias,
        medicamentos: formValues?.medicamentos,
        dosisMedicamentos: formValues?.dosisMedicamentos,
        patientId: localStorage?.getItem("userId"),
        tipoEnfermedad: formValues?.tipoEnfermedad,
        descripcionPatologia: formValues?.descripcionPatologia,
      };

      const response = await fetch("/api/createMedicalRecord", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        showSuccessNotification("Ficha medica Creada Con exito !!");
        form.resetFields();
      } else {
        const data = await response.json();
        console.log(data, "llega la data?");
        showErrorNotification(
          data.error || "Error al crear ficha medica, consulte soporte"
        );
        form.resetFields();
      }
    } catch (error) {
      console.error(error);
      showErrorNotification(error || "Error de conexion, consulte soporte");
      form.resetFields();
    }
  };

  useEffect(() => {
    getPlanService();
  }, []);
  useEffect(() => {
    getUserData();
  }, []);
  const handleMenuSelect = (keys: string[]) => {
    setSelectedKeys(keys);
  };

  const generateLink = async () => {
    try {
      const requestBody ={
        title:  form.getFieldValue("planServiceName")  ?? "nombre",
        price:  form.getFieldValue("price") ?? "20000",
        quantity:1
      }
      const { data: preference } = await axios.post("/api/checkout", {
        requestBody,
      });

      setUrl(preference.url);
    } catch (error) {
      console.error(error);
    }
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
  const getUserData = async () => {
    try {
      const requestBody = {
        userId: localStorage.getItem("userId"),
      };
      const response = await fetch("/api/getUserById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data, "data useer ficha");
        if (data && !data.patient_medicalRecord) {
          console.log("tiene data?", data);
          setShowSecondForm(true);
        }
      } else {
        const data = await response.json();
        showErrorNotification(
          data.error || "Error al traer los datos de usuario, consulte soporte"
        );
      }
    } catch (error) {
      console.error(error);
      showErrorNotification(error || "Error de conexion, consulte soporte");
    }
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <MenuComponent
          selectedKeys={selectedKeys}
          onMenuSelect={handleMenuSelect}
        />
      </Sider>
      <Layout>
        <Content>
          <Form
            className="form-perfil"
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
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Hora de Inicio"
                  name="startTime"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <TimePicker
                    format="HH:mm"
                    style={{ width: "100%" }}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Hora de Término"
                  name="endTime"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <TimePicker
                    format="HH:mm"
                    style={{ width: "100%" }}
                    disabled
                  />
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
                <Form.Item
                  label="Precio"
                  name="price"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <Input style={{ width: "100%" }} disabled />
                </Form.Item>
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
                    disabled={datePickerDisabled}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} xl={8}>
                <Form.Item
                  label="Enfermeras"
                  name="appointmentId"
                  rules={[{ required: true, message: "Campo obligatorio" }]}
                >
                  <Select
                    style={{ width: "100%" }}
                    disabled={nursesSelectDisabled}
                    options={nurses.map((item) => ({
                      value: item.appointmentId,
                      label: item.firstName + " " + item.lastName,
                    }))}
                  ></Select>
                </Form.Item>
              </Col>
              {showSecondForm && (
                <>
                  <Col xs={24} md={12} xl={8}>
                    <Form.Item
                      label="Alergias"
                      name="alergias"
                      rules={[{ required: true, message: "Campo obligatorio" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} xl={8}>
                    <Form.Item
                      label="Medicamentos"
                      name="medicamentos"
                      rules={[{ required: true, message: "Campo obligatorio" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} xl={8}>
                    <Form.Item
                      label="Dosis de medicamentos"
                      name="dosisMedicamentos"
                      rules={[{ required: true, message: "Campo obligatorio" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} xl={8}>
                    <Form.Item
                      label="Tipo de Enfermedad"
                      name="tipoEnfermedad"
                      rules={[{ required: true, message: "Campo obligatorio" }]}
                    >
                      <Select style={{ width: "100%" }}>
                        <Select.Option value="autovalente">
                          Autovalente
                        </Select.Option>
                        <Select.Option value="semiAutovalente">
                          Semi Autovalente
                        </Select.Option>
                        <Select.Option value="noAutovalente">
                          No Autovalente
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} xl={8}>
                    <Form.Item
                      label="Descripcion Patologia"
                      name="descripcionPatologia"
                      rules={[{ required: true, message: "Campo obligatorio" }]}
                    >
                      <TextArea rows={4} />
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col xs={24} md={12} xl={8}>
                <Button 
                  href={url!}
                  type="primary"
                  htmlType="submit"
                  onClick={generateLink}
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
