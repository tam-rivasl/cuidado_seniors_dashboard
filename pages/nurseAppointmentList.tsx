import React, { useEffect, useState } from "react";
import {
  Table,
  Layout,
  notification,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Col,
  Row,
  Tabs,
  Empty,
} from "antd";
import {
  AuditOutlined,
  BarsOutlined,
  CalendarOutlined,
  EditOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import MenuComponent from "@/components/menu";
import moment from "moment";
import { message } from "antd";
const { Content, Footer, Sider } = Layout;

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [list, setList] = useState([] as Array<any>);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["1"]);
  const [userId, setUserId] = useState("" as any);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDetailsVisible, setModalDetailsVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [observations, setObservations] = useState([] as Array<any>);
  const [contactEmergency, setContact] = useState([] as Array<any>);
  const [activeTabKey, setActiveTabKey] = useState<string>("observations");

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

  useEffect(() => {
    const userId: any = localStorage.getItem("userId");
    if (userId) {
      setUserId(parseInt(userId));
    }
  }, []);

  useEffect(() => {
    getAppointmentNurses();
  }, [userId]);

  const handleMenuSelect = (keys: string[]) => {
    setSelectedKeys(keys);
  };

  const handleOpenModal = (record: any) => {
    setSelectedRow(record);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
    setModalVisible(false);
  };

  const handleOpenModalDetails = (record: any) => {
    setSelectedRow(record);
    setActiveTabKey("observations");

    // Extract appointmentId from the current row
    const appointmentId = record?.appointmentId;
    const patientId = record?.patientId;
    // Check if appointmentId is available and observations array is empty
    if (appointmentId && observations.length >= 0) {
      getObservations(appointmentId);
      console.log("appointmentId", appointmentId);
    }
    if (patientId ) {
      getContactEmergency(patientId);
      console.log("patient id de contact", patientId);
    }
    setModalDetailsVisible(true);
  };

  const handleCloseModalDetails = () => {
    setSelectedRow(null);
    setContact([null]);
    setModalDetailsVisible(false);
  };

  const onFinish = async (formValues: any) => {
    try {
      const requestBody = {
        title: formValues?.title,
        description: formValues?.description,
        observationType: formValues?.observationType,
        nurseId: localStorage?.getItem("userId"),
        status: "active",
        appointmentId: selectedRow?.appointmentId,
      };

      const response = await fetch("/api/createObservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        showSuccessNotification("Observacion creada exitosamente !!");
        const newObservation = await response.json();
        setObservations([...observations, newObservation]);
        form.resetFields();
        handleCloseModal();
      } else {
        const data = await response.json();
        showErrorNotification(
          data.error || "Error al crear observacion, consulte soporte"
        );
        form.resetFields();
        handleCloseModal();
      }
    } catch (error) {
      console.error(error);
      showErrorNotification(error || "Error de conexion, consulte soporte");
      form.resetFields();
      handleCloseModal();
    }
  };

  const getAppointmentNurses = async () => {
    const requestBody = {
      userId: userId,
    };

    await fetch("/api/getAppointmentNurse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          setList(data[0]);
        } else {
          response.json().then((data) => {
            console.log(data.message, "error del contact?");
            showErrorNotification(
              data.message || "Error al cargar el listado de citas "
            );
          });
        }
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification(error.message || "Error al consultar Api ");
      });
  };

  const getObservations = async (appointmentId: string) => {
    try {
      const requestBody = {
        appointmentId: appointmentId,
      };
      console.log("request", requestBody);
      const response = await fetch("/api/getObservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        setObservations(data[0]);
      } else {
        const data = await response.json();
        console.log("data error?", data);
        showErrorNotification(data.message || "Error al cargar observaciones");
      }
    } catch (error) {
      console.error(error);
      showErrorNotification(error.message || "Error al consultar la API");
    }
  };

  const getContactEmergency = async (patientId: number) => {
    try {
      const requestBody = {
        patientId: patientId,
      };
  
      const response = await fetch("/api/getContactEmergency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        const emergencyContactData = responseData[0]?.map(item => item.emergency_contact);
  
          console.log("Emergency Contact Data:", emergencyContactData);
          setContact(emergencyContactData);
      } else {
        const data = await response.json();
        console.log("data error?", data);
        showErrorNotification(data.message || "Error al cargar contactos de emergencia");
      }
    } catch (error) {
      console.error(error);
      showErrorNotification(error.message || "Error al consultar la API");
    }
  };  
  const ObservationsList = () => {
    return (
      <div>
        <Table className="mi-tabla"
          columns={[
            {
              title: "Título",
              dataIndex: "title",
              key: "title",
            },
            {
              title: "Tipo Descripción",
              dataIndex: "observationType",
              key: "observationType",
              render: (observationType: string) => {
                switch (observationType) {
                  case "schedule_rutine":
                    return "Horario / Rutina";
                  case "recomendations":
                    return "Recomendaciones";
                  case "medical":
                    return "Medico / Tratamiento";
                  default:
                    return "No Data";
                }
              },
            },
            {
              title: "Descripción",
              dataIndex: "description",
              key: "description",
            },
          ]}
          dataSource={observations}
          pagination={{ pageSize: 10 }}
        />
      </div>
    );
  };
  console.log("contactEmergency en Home:", contactEmergency);

  const EmergencyContact = () => {
    const interfaceContact = contactEmergency.map((entry) => ({
      firstName: entry?.firstName,
      lastName: entry?.lastName,
      email: entry?.email,
      phoneNumber: entry?.phoneNumber,
      relationship: entry?.relationship,
    }));
    return (
      console.log(interfaceContact, "entry??"),
      (
        <div>
          <Table className="mi-tabla"
            columns={[
              { title: "Nombre", dataIndex: "firstName", key: "firstName" },
              { title: "Apellido", dataIndex: "lastName", key: "lastName" },
              { title: "Email", dataIndex: "email", key: "email" },
              {
                title: "Numero de telefono",
                dataIndex: "phoneNumber",
                key: "phoneNumber",
              },
              {
                title: "Relacion",
                dataIndex: "relationship",
                key: "relationship",
              },
            ]}
            dataSource={interfaceContact}
            pagination={{ pageSize: 10 }}
          />
        </div>
      )
    );
  };

  const MedicalRecord = () => {
    return <div>Contenido de la otra pestaña</div>;
  };
  const tabsConfig = [
    {
      key: "observations",
      label: "Lista de observaciones",
      icon: <BarsOutlined />,
      content: <ObservationsList />,
    },
    {
      key: "medicalRecord",
      label: "Ficha Medica",
      icon: <AuditOutlined />,
      content: <MedicalRecord />,
    },
    {
      key: "emergencyContact",
      label: "Contacto de emergencia",
      icon: <PhoneOutlined />,
      content: <EmergencyContact />,
    },
  ];

  const ModalDetails = (
    <Modal
      className="Modal"
      title="Detalles de Cita"
      open={modalDetailsVisible}
      onCancel={() => handleCloseModalDetails()}
      footer={null}
      style={{ width: "90%" }}
    >
      {modalDetailsVisible && (
        <Tabs 
          defaultActiveKey={tabsConfig[0].key}
          activeKey={activeTabKey}
          onChange={(key) => setActiveTabKey(key)}
        >
          {tabsConfig.map((tab) => (
            <Tabs.TabPane
              tab={
                <span>
                  {tab.icon}
                  {tab.label}
                </span>
              }
              key={tab.key}
            >
              {tab.content}
            </Tabs.TabPane>
          ))}
        </Tabs>
      )}
    </Modal>
  );

  const ModalForm = (
    <Modal
      title="Agregar Observacion"
      open={modalVisible}
      onCancel={() => {
        form.resetFields();
        handleCloseModal();
      }}
      footer={null}
      style={{ width: "90%" }}
    >
      <Form
        form={form}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 25 }}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ size: "default" }}
        size={"middle"}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Titulo"
          name="title"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Tipo Observacion"
          name="observationType"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <Select>
            <Select.Option value="schedule_rutine">
              Horario / Rutina
            </Select.Option>
            <Select.Option value="recomendations">
              Recomendaciones
            </Select.Option>
            <Select.Option value="medical">Medico / Tratamiento</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="Descripcion"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button className="responsive-button"
            type="primary"
            htmlType="submit"
            style={{ width: '100%', marginBottom: '5px' }}
          >
            Guardar Observacion
          </Button>
          <Button
            danger
            onClick={() => {
              form.resetFields();
              handleCloseModal();
            }}
            style={{ width: '100%', marginBottom: '5px' }}
          >
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  const columns = [
    {
      title: "Plan Service Name",
      width: 100,
      render: (item: any) => item.plan_service?.planServiceName ?? "No Data",
      key: "plan_service",
      sorter: true,
    },
    {
      title: "Price",
      width: 100,
      render: (item: any) => item.plan_service?.price ?? "No Data",
      key: "plan_service",
      sorter: true,
    },
    {
      title: "Description",
      width: 100,
      render: (item: any) => item.plan_service?.description ?? "No Data",
      key: "plan_service",
      sorter: true,
    },
    {
      title: "Start Time",
      width: 100,
      render: (item: any) => item.plan_service?.startTime ?? "No Data",
      key: "plan_service",
      sorter: true,
    },
    {
      title: "End Time",
      width: 100,
      render: (item: any) => item.plan_service?.endTime ?? "No Data",
      key: "plan_service",
      sorter: true,
    },
    {
      title: "Status",
      width: 100,
      dataIndex: "status",
      key: "status",
      sorter: true,
    },
    {
      title: "Date",
      width: 150,
      dataIndex: "date",
      render: (text: string) => moment(text).format("DD/MM/YYYY") || "No Data",
      key: "date",
      sorter: true,
    },
    {
      title: "Nombre Paciente",
      width: 150,
      render: (item: any) => item.patient?.firstName ?? "No Data",
      key: "patient",
      sorter: true,
    },
    {
      title: "Apellido Paciente",
      width: 150,
      render: (item: any) => item.patient?.lastName ?? "No Data",
      key: "patient",
      sorter: true,
    },
    {
      title: "Direccion",
      width: 150,
      render: (item: any) => item.patient?.address ?? "No Data",
      key: "patient",
      sorter: true,
    },
    {
      title: "Observaciones",
      key: "actions",
      render: (text: any, record: any) => (
        <Button
          type="primary"
          style={{ width: 100 }}
          onClick={() => handleOpenModal(record)}
        >
          <EditOutlined />
        </Button>
      ),
    },
    {
      title: "Detalles Cita",
      key: "actions",
      render: (text: any, record: any) => (
        <Button
          type="primary"
          style={{ width: 100 }}
          onClick={() => handleOpenModalDetails(record)}
        >
          <CalendarOutlined />
        </Button>
      ),
    },
  ];

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
          <div className="tabsList" style={{ backgroundColor: "Background" }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Table
                  columns={columns}
                  dataSource={list}
                  scroll={{ x: 1300 }}
                />
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}></Footer>
      </Layout>
      {ModalForm}
      {ModalDetails}
    </Layout>
  );
}
