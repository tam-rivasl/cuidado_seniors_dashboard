import React, { useEffect, useState } from 'react';
import { Table, Layout, theme, Button, message, Form, notification} from 'antd';
import MenuComponent from '../components/menu'; // Ajusta la ruta de importación según la ubicación de MenuComponent
const { Content, Footer, Sider } = Layout;

export default function PatientAppointmentList() {
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
      title: 'Nombre Plan',
      width: 100,
      render: (item: any)=>  item.plan_service?.planServiceName ?? 'No Data',
      key: 'plan_service',
      sorter: true,
    },
    {
      title: 'Precio',
      width: 100,
      render: (item: any)=>  item.plan_service?.price ?? 'No Data',
      key: 'plan_service',
      sorter: true,
    },
    {
      title: 'Descripcion',
      width: 100,
      render: (item: any)=>  item.plan_service?.description ?? 'No Data',
      key: 'plan_service',
      sorter: true,
    },
    {
      title: 'Hora de inicio',
      width: 100,
      render: (item: any)=>  item.plan_service?.startTime ?? 'No Data',
      key: 'plan_service',
      sorter: true,
    },
    {
      title: 'Hora de termino',
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
      title: 'Fecha',
      width: 150,
      dataIndex: 'date',
      key: 'date',
      sorter: true,
    },
    {
        title: 'Nombre Enfermera/o',
        width: 150,
        render: (item: any)=> item.nurse?.firstName  ?? 'No Data',
        key: 'patient',
        sorter: true,
 },
 {
    title: 'Apellido Enfermera/o',
    width: 150,
    render: (item: any)=>  item.nurse?.lastName ?? 'No Data',
    key: 'patient',
    sorter: true,
},
{
  title: 'Acciones',
  key: 'operation',
  fixed: 'right',
  width: 100,
  render: () => <Button>Cancelar</Button>,
  //href para que direccione a crear cita. 
  //render: () => <Button>Reageandar</Button>,
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

