import React, { useEffect, useState } from "react";
import { Table, Layout, Button, message, notification, Popconfirm } from "antd";
import MenuComponent from "../components/menu"; // Ajusta la ruta de importación según la ubicación de MenuComponent
import { useRouter } from "next/router";
import { error } from 'console';
import { QuestionCircleOutlined } from "@ant-design/icons";
import moment from "moment";
interface Appointment {
  appointmentId: number;
  plan_service?: {
    planServiceName: string;
    price: number;
    description: string;
    startTime: Date;
    endTime: Date;
  };
  status: string;
  date: Date;
  nurse?: {
    firstName: string;
    lastName: string;
  };
}

export default function PatientAppointmentList() {
  const [collapsed, setCollapsed] = useState(false);
  const [list, setList] = useState([] as Array<any>);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["1"]);
  const [userId, setUserId] = useState("" as any);
  const router = useRouter();
  const { Content, Footer, Sider } = Layout;
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

  const showInfoNotification = (message: any) => {
    notification.info({
      message: "Info",
      description: message,
      placement: "topRight", // Cambia la ubicación según tus necesidades
    });
  };
  const confirmCancelarCita = async (appointmentId: number) => {
    const requestBody = {
      appointmentId: appointmentId,
    };
    console.log(requestBody, "id apointment");
  
    try {
      const response = await fetch("/api/cancelAppointment", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        await response.json();
        showSuccessNotification("Cita Cancelada con éxito");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
       
      } else {
        const errorData = await response.json();
        console.log(errorData.message, 'error data');
        showErrorNotification(
          errorData.message || "Cita ya se encuentra cancelada o expirada"
        );
      }
    } catch (error) {
      console.error(error);
      showErrorNotification(error || "Error al consultar API");
    }
  };
  const confirmReagendarCita = async (appointmentId: number) => {
    // Lógica para reagendar la cita
    try {
      const requestBody = {
        appointmentId: appointmentId,
      };
      console.log(requestBody, "id apointment");
    
      try {
        const response = await fetch("/api/cancelAppointment", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
    
        if (response.ok) {
          await response.json();
          showInfoNotification("Su cita ha sido cancelada para que pueda agendar una nueva");
          setTimeout(() => {
            router.push('/user-appointment');
          }, 2000);
        } else {
          const errorData = await response.json();
          console.log(errorData.message, 'error data');
          showErrorNotification(
            errorData.message || "Cita ya se encuentra cancelada o expirada"
          );
        }
      } catch (error) {
        console.error(error);
        showErrorNotification(error || "Error al consultar API");
      }
    } catch (error) {
      console.error(error);
      showErrorNotification(error || "Error al reagendar la cita");
    }
  };
  useEffect(() => {
    const userId: any = localStorage.getItem("userId");
    if (userId) {
      console.log("user id lo encontro", userId);
      setUserId(parseInt(userId)); // Establece el nombre del usuario en el estado
    }
  }, []);
  useEffect(() => {
    getAppointmentNurses();
  }, [userId]);
  const handleMenuSelect = (keys: string[]) => {
    setSelectedKeys(keys);
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

  const columns = [
    {
      title: "Nombre Plan",
      dataIndex: ["plan_service", "planServiceName"],
      key: "planServiceName",
      width: 100,
      sorter: true,
      render: (text: string) => text || "No Data",
    },
    {
      title: "Precio",
      dataIndex: ["plan_service", "price"],
      key: "price",
      width: 100,
      sorter: true,
      render: (text: string) => '$' + text || "No Data",
    },
    {
      title: "Descripcion",
      dataIndex: ["plan_service", "description"],
      key: "description",
      width: 100,
      sorter: true,
      render: (text: string) => (
        <div style={{ textAlign: 'justify' }}>
          {text || "No Data"}
        </div>
          ),
    },
    {
      title: "Hora de inicio",
      dataIndex: ["plan_service", "startTime"],
      key: "startTime",
      width: 100,
      sorter: true,
      render: (text: string) => text || "No Data",
    },
    {
      title: "Hora de termino",
      dataIndex: ["plan_service", "endTime"],
      key: "endTime",
      width: 100,
      sorter: true,
      render: (text: string) => text || "No Data",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      sorter: true,
    },
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      width: 150,
      sorter: true,
      render: (text: string) => moment(text).format("DD/MM/YYYY") || "No Data",
    },
    {
      title: "Nombre Enfermera/o",
      dataIndex: ["nurse", "firstName"],
      key: "firstName",
      width: 150,
      sorter: true,
      render: (text: string) => text || "No Data",
    },
    {
      title: "Apellido Enfermera/o",
      dataIndex: ["nurse", "lastName"],
      key: "lastName",
      width: 150,
      sorter: true,
      render: (text: string) => text || "No Data",
    },
    {
      title: "Acciones",
      key: "operation",
      fixed: "right",
      width: 150,
      render: (item: Appointment) => (
        <div>
          <Popconfirm
            title="Cancelar Cita"
            description="¿Esta seguro de anular su cita?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }}/>}
            onConfirm={() => confirmCancelarCita(item.appointmentId)}
            onCancel={() => console.log("Cancelar confirmación")}
            okText="Sí"
            cancelText="No"
          >
            <Button style={{ width: '150px', marginBottom: '20px' }} danger>Cancelar cita</Button>
          </Popconfirm>
          <Popconfirm
            title="Reagendar cita"
            description="¿Esta seguro de anular su cita?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }}/>}
            onConfirm={() => confirmReagendarCita(item.appointmentId)}
            onCancel={() => console.log("Cancelar confirmación")}
            okText="Sí"
            cancelText="No"
          >
            <Button style={{ width: '150px', marginBottom: '20px' }} type="primary">Reagendar Cita</Button>
          </Popconfirm>
        </div>
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
            <Table columns={columns} dataSource={list} scroll={{ x: 1300 }} />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}></Footer>
      </Layout>
    </Layout>
  );
}
