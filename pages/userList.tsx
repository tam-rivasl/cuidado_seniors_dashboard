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
    console.log(localStorage.getItem('email'))
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await fetch('/api/getUsers');
      if (!response.ok) {
        throw new Error('La solicitud no tuvo éxito');
      }
      const data = await response.json();
      console.log('data', data);
      setList(data);
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
      title: 'Nombre',
      width: 100,
      dataIndex: 'firstName',
      key: 'firstName',
      fixed: 'left',
    },
    {
      title: 'Apellido',
      width: 100,
      dataIndex: 'lastName',
      key: 'lastName',
      fixed: 'left',
      sorter: true,
    },
    {
      title: 'Número de Teléfono',
      width: 150,
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      sorter: true,
    },
    {
      title: 'Edad',
      width: 100,
      dataIndex: 'age',
      key: 'age',
      sorter: true,
    },
    {
      title: 'Género',
      width: 100,
      dataIndex: 'gender',
      key: 'gender',
      sorter: true,
    },
    {
      title: 'RUT',
      width: 150,
      dataIndex: 'identificationNumber',
      key: 'rut',
      sorter: true,
    },
    {
      title: 'Email',
      width: 200,
      dataIndex: 'email',
      key: 'email',
      sorter: true,
    },
    {
      title: 'Fecha de Nacimiento',
      width: 150,
      dataIndex: 'birthDate',
      key: 'birthDate',
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
