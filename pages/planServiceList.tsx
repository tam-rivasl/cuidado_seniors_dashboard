import React, { useEffect, useState } from 'react';
import { Table, Layout, theme, Button, message } from 'antd';
import MenuComponent from '../components/menu'; // Ajusta la ruta de importación según la ubicación de MenuComponent

const { Header, Content, Footer, Sider } = Layout;

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

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const columns = [
    {
      title: 'Plan Service Name',
      width: 100,
      render: (item: any)=>  item.planServiceName ?? 'No Data',
      key: 'planServiceName',
      sorter: true,
    },
    {
      title: 'Price',
      width: 100,
      render: (item: any)=>  item.price ?? 'No Data',
      key: 'price',
      sorter: true,
    },
    {
      title: 'Description',
      width: 100,
      render: (item: any)=>  item.description ?? 'No Data',
      key: 'description',
      sorter: true,
    },
    {
      title: 'Start Time',
      width: 100,
      render: (item: any)=>  item.startTime ?? 'No Data',
      key: 'startTime',
      sorter: true,
    },
    {
      title: 'End Time',
      width: 100,
      render: (item: any)=>  item.endTime ?? 'No Data',
      key: 'endTime',
      sorter: true,
    },
    {
      title: 'Status',
      width: 200,
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

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <MenuComponent selectedKeys={selectedKeys} onMenuSelect={handleMenuSelect} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px', background: colorBgContainer }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            <Table columns={columns} dataSource={list} scroll={{ x: 1300 }} />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </Layout>
  );
}
