import React, { useEffect, useState } from 'react';
import { Table, Layout, Button, message, Popconfirm, notification } from 'antd';
import MenuComponent from '../components/menu';
import moment from 'moment';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [messageApi] = message.useMessage();
  const [list, setList] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(['1']);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    console.log(localStorage.getItem('email'))
    getUsers();
  }, []);

  const showSuccessNotification = (message) => {
    notification.success({
      message: "Éxito",
      description: message,
      placement: "topRight",
    });
  };

  const showErrorNotification = (error) => {
    notification.error({
      message: "Error",
      description: error,
      placement: "topRight",
    });
  };

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

  const getUserData = async (userId) => {
    try {
      const requestBody = {
        userId: userId
      };
      const response = await fetch("/api/getUserById", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data, "data user ficha");
        if (data && !data.patient_medicalRecord) {
          console.log("tiene data?", data);
        }
      } else {
        const data = await response.json();
        showErrorNotification(
          data.error || "Error al traer los datos de usuario, consulte soporte"
        );
      }
    } catch (error) {
      console.error(error);
      showErrorNotification(error || "Error de conexión, consulte soporte");
    }
  }

  const handleRowClick = (record, rowIndex) => {
    setSelectedRow(record);
    getUserData(record.userId);
  };
  const handleMenuSelect = (keys: string[]) => {
    setSelectedKeys(keys);
  };
  const rowSelection = {
    // Puedes ajustar la configuración de rowSelection según tus necesidades
    // Consulta la documentación de Ant Design para obtener más detalles: https://ant.design/components/table/#components-table-demo-row-selection
  };

  const columns = [
    {
      title: 'Nombre',
      width: 100,
      dataIndex: 'firstName',
      key: 'firstName',
      sorter: true,
    },
    // ... (otras columnas)
    {
      title: 'Acciones',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (item) => (
        <div>
          <Popconfirm
            title="Cancelar Cita"
            description="¿Está seguro de que quiere dar de baja a este usuario?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }}/>}
            onConfirm={() => inactiveUser(item.userId)}
            onCancel={() => console.log("Cancelar confirmación")}
            okText="Sí"
            cancelText="No"
          >
            <Button style={{ width: '150px', marginBottom: '20px' }} danger>Dar de baja</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const inactiveUser = async (userId) => {
    const requestBody = {
      userId: userId,
    };
    console.log(requestBody, "id USUARIO");
  
    try {
      const response = await fetch("/api/inactiveUser", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        await response.json();
        showSuccessNotification("Usuario ha sido dado de baja con éxito!!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
       
      } else {
        const errorData = await response.json();
        console.log(errorData, 'error data');
        showErrorNotification(
          errorData.message || "Usuario ya se encuentra desactivado"
        );
      }
    } catch (error) {
      console.error(error);
      showErrorNotification(error || "Error al consultar API, consulte con soporte");
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <MenuComponent selectedKeys={selectedKeys} onMenuSelect={handleMenuSelect} />
      </Sider>
      <Layout>
        <Content>
          <div className='tabsList' style={{ backgroundColor: 'Background' }}>
            <Table
              columns={columns}
              dataSource={list}
              scroll={{ x: 1300 }}
              onRow={(record, rowIndex) => ({
                onClick: () => handleRowClick(record, rowIndex),
              })}
              rowSelection={rowSelection}
            />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </Layout>
  );
};

export default Home;
