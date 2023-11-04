import React, { useEffect, useState } from 'react';
import { Table, Layout, theme, Button, message } from 'antd';
import MenuComponent from '../components/menu'; // Ajusta la ruta de importación según la ubicación de MenuComponent

const { Header, Content, Footer, Sider } = Layout;

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [messageApi] = message.useMessage();
  const [list, setList] = useState([] as Array<any>);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);

  useEffect(() => {
    getAppointment();
  }, []);

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
      sorter: true,
    },
    {
      title: 'Acciones',
      key: 'operation',
      fixed: 'right',
      width: 150,
      render: () => <Button>Editar</Button>,
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
