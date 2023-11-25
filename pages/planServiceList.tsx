import React, { useEffect, useState } from 'react';
import { Table, Layout, Button, message, notification, Popconfirm } from 'antd';
import MenuComponent from '../components/menu'; // Ajusta la ruta de importación según la ubicación de MenuComponent
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Content, Footer, Sider } = Layout;

export default function PlanServiceList() {
  const [collapsed, setCollapsed] = useState(false);
  const [messageApi] = message.useMessage();
  const [list, setList] = useState([] as Array<any>);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);
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
  const inactivePlanService = async (planServiceId: number) => {
    const requestBody = {
      planServiceId: planServiceId,
    };
    console.log(requestBody, "planServiceId");
  
    try {
      const response = await fetch("/api/inactivePlanservice", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      console.log(requestBody, 'body')
      if (response.ok) {
        console.log(response, 'error data');
        await response.json();
        showSuccessNotification("Plan de servicio ha sido dado de baja con exito!!");
       
      } else {
        const errorData = await response.json();
        console.log(errorData, 'error data');
        showErrorNotification(
          errorData.message || "Plan de servicio ya se encuentra desactivado"
        );
      }
    } catch (error) {
      console.log(error, 'error data');
      showErrorNotification(error || "Error de conexion, consulte con soporte");
    }
  };

  const activePlanService = async (planServiceId: number) => {
    const requestBody = {
      planServiceId: planServiceId,
    };
    console.log(requestBody, "planServiceId");
  
    try {
      const response = await fetch("/api/activePlanService", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        await response.json();
        showSuccessNotification("Plan de servicio ha sido dado de baja con exito!!");
       
      } else {
        const errorData = await response.json();
        console.log(errorData, 'error data');
        showErrorNotification(
          errorData.message || "Plan de servicio ya se encuentra activado"
        );
      }
    } catch (error) {
      console.error(error);
      showErrorNotification(error || "Error de conexion, consulte con soporte");
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
      render: (item: any)=>  '$' + item.price ?? 'No Data',
      key: 'price',
      sorter: true,
    },
    {
      title: 'Descripcion',
      width: 100,
      render: (item: any) => (
        <div style={{ textAlign: 'justify' }}>
          {item.description ?? 'No Data'}
        </div>
      ),
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
      width: 100,
      render: (item: any ) => (
        <div>
          <Popconfirm
            title="Desactivar"
            description="¿Esta seguro que quiere desactivar a este plan?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }}/>}
            onConfirm={() => inactivePlanService(item.plan_serviceId)}
            onCancel={() => console.log("Cancelar confirmación")}
            okText="Sí"
            cancelText="No"
          >
            <Button style={{ width: '150px', marginBottom: '20px' }} danger>Desactivar</Button>
          </Popconfirm>
          <Popconfirm
            title="Activar"
            description="¿Esta seguro de activar este plan?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }}/>}
            onConfirm={() => activePlanService(item.plan_serviceId)}
            onCancel={() => console.log("Cancelar confirmación")}
            okText="Sí"
            cancelText="No"
          >
            <Button style={{ width: '150px', marginBottom: '20px' }} type="primary">Activar</Button>
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
          <div  className='tabsList' style={{backgroundColor: 'Background'}}>
            <Table columns={columns} dataSource={list} scroll={{ x: 1300 }} />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </Layout>
  );
}
