import React, { useEffect, useState } from 'react';
import { Table, Layout, theme, Button, message, Popconfirm, notification } from 'antd';
import MenuComponent from '../components/menu'; // Ajusta la ruta de importación según la ubicación de MenuComponent
import moment from 'moment';
import { QuestionCircleOutlined } from '@ant-design/icons';
import router from 'next/router';

const { Header, Content, Footer, Sider } = Layout;

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [messageApi] = message.useMessage();
  const [list, setList] = useState([] as Array<any>);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);

  useEffect(() => {
    getAppointment();
  }, []);

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
  const getAppointment = async () => {
    try {
      const response = await fetch('/api/getAppointment');
      if (!response.ok) {
        throw new Error('La solicitud no tuvo éxito');
      }
      const data = await response.json();
      setList(data[0]);
      console.log('data', data[0]);
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: error?.message ?? 'La solicitud no tuvo éxito',
      });
    }
  };

  const handleMenuSelect = (keys: string[]) => {
    setSelectedKeys(keys);
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
  const columns = [
    {
      title: 'Nombre Enfermera',
      width: 180,
      render: (item: any)=>  item.nurse.firstName + (' ') + item.nurse.lastName,
      key: 'nurse',
    },
    {
      title: 'Nombre Plan',
        width: 180,
      render: (item: any)=>  item.plan_service?.planServiceName ?? 'No Data',
      key: 'plan_service',
      sorter: true,
    },
    {
      title: 'Precio',
        width: 150,
      render: (item: any)=>  item.plan_service?.price ?? 'No Data',
      key: 'plan_service',
      sorter: true,
    },
    {
      title: 'Descripcion',
        width: 150,
      render: (item: any)=>  item.plan_service?.description ?? 'No Data',
      key: 'plan_service',
      sorter: true,
    },
    {
      title: 'Hora de inicio',
        width: 150,
      render: (item: any)=>  item.plan_service?.startTime ?? 'No Data',
      key: 'plan_service',
      sorter: true,
    },
    {
      title: 'Hora de termino',
        width: 150,
      render: (item: any)=>  item.plan_service?.endTime ?? 'No Data',
      key: 'plan_service',
      sorter: true,
    },
    {
      title: 'Status',
      width: 150,
      dataIndex: 'status',
      key: 'status',
      sorter: true,
    },
    {
      title: 'Fecha',
      width: 150,
      dataIndex: 'date',
      key: 'date',
      render: (text: string) => moment(text).format("DD/MM/YYYY") || "No Data",
      sorter: true,
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
        </div>
      ),
    },
  ];


  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <MenuComponent selectedKeys={selectedKeys} onMenuSelect={handleMenuSelect} />
      </Sider>
      <Layout>
        <Content>
          <div className='tabsList' style={{backgroundColor: 'Background'}}>
            <Table columns={columns} dataSource={list} scroll={{ x: 1300 }} />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </Layout>
  );
}
