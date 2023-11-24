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
} from "antd";
import MenuComponent from "../components/menu";
import {
  AndroidOutlined,
  AppleOutlined,
  CalendarOutlined,
  EditOutlined,
} from "@ant-design/icons";
import getObservations from "./api/getObservations";
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
      placement: "topRight", // Cambia la ubicación según tus necesidades
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
    setActiveTabKey("observations"); // Cambia la clave de la pestaña activa a 'observations'
    if (record.appointmentId && observations.length === 0) {
      getObservations(record.appointmentId);
    }
    
  };

  const handleCloseModalDetails = () => {
    setSelectedRow(null);
    setModalDetailsVisible(false);
  };

  const onFinish = async (formValues: any) => {
    try {
      console.log("form:", formValues);
      console.log(localStorage.getItem("userId"));
      const requestBody = {
        title: formValues.title,
        description: formValues.description,
        observationType: formValues.observationType,
        nurseId: localStorage.getItem("userId"),
        status: "active",
        appointmentId: selectedRow?.appointmentId,
      };

      console.log(formValues, "request del form");
      const response = await fetch("/api/createObservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        showSuccessNotification("Observacion creada exitosamente !!");
        form.resetFields();
        handleCloseModal();
      } else {
        const data = await response.json();
        console.log("dataaa", data);
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
  const getAppointmentNurses = () => {
    const requestBody = {
      userId: userId,
    };

    fetch("/api/getAppointmentNurse", {
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
 
  const ObservationsList = () => {
    useEffect(() => {
      const getObservations = async () => {
        try {
          // Lógica para obtener observaciones
          const requestBody = {
            appointmentId: selectedRow?.appointmentId,
          };

          const response = await fetch("/api/getObservations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });

          if (response.ok) {
            const data = await response.json();
            setObservations(data);
          } else {
            const data = await response.json();
            showErrorNotification(data.message || "Error al cargar observaciones");
          }
        } catch (error) {
          console.error(error);
          showErrorNotification(error.message || "Error al consultar la API");
        }
      };
    }, [selectedRow?.appointmentId]);

    return (
      <div>
        <Table
          columns={[
            {
              title: "ID",
              dataIndex: "id",
              key: "id",
            },
            {
              title: "Título",
              dataIndex: "title",
              key: "title",
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

  const OtherTabContent = () => {
    // Lógica para mostrar el contenido de la otra pestaña
    return <div>Contenido de la otra pestaña</div>;
  };
  const tabsConfig = [
    {
      key: "observations",
      label: "Lista de observaciones",
      icon: <AppleOutlined />,
      content: <ObservationsList />,
    },
    {
      key: "otherTab",
      label: "Otra pestaña",
      icon: <AndroidOutlined />,
      content: <OtherTabContent />,
    },
  ];

  const ModalDetails = (
    <Modal
      title="Detalles de Cita"
      open={modalDetailsVisible}
      onCancel={() => {
        // Lógica de cierre del modal
        handleCloseModalDetails();
      }}
      footer={null}
      style={{ width: "90%" }}
    >
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
    </Modal>
  );

  // Renderizar el formulario dentro del modal
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
      {/* Aquí deberías poner tu formulario */}
      <Form
        form={form}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 25 }}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ size: "default" }}
        size={"small"}
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
            ,
            <Select.Option value="recomendations">
              Recomendaciones
            </Select.Option>
            ,<Select.Option value="medical">Medico / Tratamiento</Select.Option>
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
          <Button
            type="primary"
            htmlType="submit"
            style={{ flex: 1, justifyContent: "space-between", width: "45%" }}
          >
            Guardar Observacion
          </Button>
          <Button
            danger
            onClick={() => {
              form.resetFields();
              handleCloseModal();
            }}
            style={{
              flex: 1,
              justifyContent: "space-between",
              width: "50%",
              marginLeft: 20,
            }}
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
