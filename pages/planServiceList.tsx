import React, { useEffect, useState } from 'react';
import { Table, Layout, Button, message } from 'antd';
import MenuComponent from '../components/menu'; // Ajusta la ruta de importación según la ubicación de MenuComponent

const { Content, Footer, Sider } = Layout;

export default function PlanServiceList() {
  const [collapsed, setCollapsed] = useState(false);
  const [messageApi] = message.useMessage();
  const [list, setList] = useState([] as Array<any>);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);

  useEffect(() => {
    getPlanService();
  }, []);

  const getPlanService = async () => {
    try {
      const response = await fetch('/api/getPlanService');
      if (!response.ok) {
        throw new Error('La solicitud no tuvo éxito');
      }
      const data = await response.json();
      setList(data);
      console.log('data', data);
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
      title: 'Nombre Plan',
      width: 100,
      render: (item: any)=>  item.planServiceName ?? 'No Data',
      key: 'planServiceName',
      sorter: true,
    },
    {
      title: 'Precio',
      width: 100,
      render: (item: any)=>  item.price ?? 'No Data',
      key: 'price',
      sorter: true,
    },
    {
      title: 'Descripcion',
      width: 100,
      render: (item: any)=>  item.description ?? 'No Data',
      key: 'description',
      sorter: true,
    },
    {
      title: 'Hora inicio',
      width: 100,
      render: (item: any)=>  item.startTime ?? 'No Data',
      key: 'startTime',
      sorter: true,
    },
    {
      title: 'Hora Termino',
      width: 100,
      render: (item: any)=>  item.endTime ?? 'No Data',
      key: 'endTime',
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
      title: 'Acciones',
      key: 'operation',
      fixed: 'right',
      width: 100,
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
          <div  className='tabsList' style={{backgroundColor: 'Background'}}>
            <Table columns={columns} dataSource={list} scroll={{ x: 1300 }} />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </Layout>
  );
}
