import React, { useEffect, useState } from 'react';
import { Table, Layout, notification} from 'antd';
import MenuComponent from '../components/menu'; // Ajusta la ruta de importación según la ubicación de MenuComponent


const { Content, Footer, Sider } = Layout;

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [list, setList] = useState([] as Array<any>);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);
  const [userId, setUserId] = useState('' as any);
  useEffect(() => {
    const userId: any = localStorage.getItem("userId");
    if (userId) {
        console.log('user id lo encontro', userId)
      setUserId(parseInt(userId)); // Establece el nombre del usuario en el estado
    }
  }, []);
  useEffect(() => {
    getAppointmentNurses();
  }, [userId]);
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
  
 const getAppointmentNurses = ()=> {
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
        setList(data[0])
      } else {
        response.json().then((data) => {
          showErrorNotification(data.message || "Error al cargar el listado de citas ");
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
      title: 'Plan Service Name',
      width: 100,
      render: (item: any)=>  item.plan_service?.planServiceName ?? 'No Data',
      key: 'plan_service',
      sorter: true,
    },
    {
      title: 'Price',
      width: 100,
      render: (item: any)=>  item.plan_service?.price ?? 'No Data',
      key: 'plan_service',
      sorter: true,
    },
    {
      title: 'Description',
      width: 100,
      render: (item: any)=>  item.plan_service?.description ?? 'No Data',
      key: 'plan_service',
      sorter: true,
    },
    {
      title: 'Start Time',
      width: 100,
      render: (item: any)=>  item.plan_service?.startTime ?? 'No Data',
      key: 'plan_service',
      sorter: true,
    },
    {
      title: 'End Time',
      width: 100,
      render: (item: any)=>  item.plan_service?.endTime ?? 'No Data',
      key: 'plan_service',
      sorter: true,
    },
    {
      title: 'Status',
      width: 100,
      dataIndex: 'status',
      key: 'status',
      sorter: true,
    },
    {
      title: 'Date',
      width: 150,
      dataIndex: 'date',
      key: 'date',
      sorter: true,
    },
    {
        title: 'Nombre Paciente',
        width: 150,
        render: (item: any)=> item.patient?.firstName  ?? 'No Data',
        key: 'patient',
        sorter: true,
 },
 {
    title: 'Apellido Paciente',
    width: 150,
    render: (item: any)=>  item.patient?.lastName ?? 'No Data',
    key: 'patient',
    sorter: true,
},
 {
    title: 'Direccion',
    width: 150,
    render: (item: any)=>  item.patient?.address ?? 'No Data',
    key: 'patient',
    sorter: true,
},
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <MenuComponent selectedKeys={selectedKeys} onMenuSelect={handleMenuSelect} />
      </Sider>
      <Layout>
        <Content>
          <div  className='tabsList' style={{backgroundColor: 'Background'}}>
            <Table columns={columns} dataSource={list} scroll={{ x: 1300 }} />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </Layout>
  );
}


