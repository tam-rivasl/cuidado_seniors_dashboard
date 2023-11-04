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

  const columns = [
    {
      title: 'Nombre',
      width: 100,
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: true,
    },
    {
      title: 'Apellido',
      width: 100,
      dataIndex: 'lastName',
      key: 'lastName',
      sorter: true,
    },
    {
      title: 'Número de Teléfono',
      width: 100,
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
      width: 100,
      dataIndex: 'identificationNumber',
      key: 'rut',
      sorter: true,
    },
    {
      title: 'Email',
      width: 150,
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
