import React, { useEffect, useState } from 'react';
import { Table, Layout, Button, message, notification, Popconfirm, Col, Row, DatePicker, Form, Input, Modal, Space, TimePicker, InputNumber } from 'antd';
import MenuComponent from '../components/menu'; // Ajusta la ruta de importación según la ubicación de MenuComponent
import { EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Content, Footer, Sider } = Layout;

export default function PlanServiceList() {
  const [collapsed, setCollapsed] = useState(false);
  const [messageApi] = message.useMessage();
  const [list, setList] = useState([] as Array<any>);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['1']);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0); 
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [planService, setPlanService] = useState([] as Array<any>);
  const { TextArea } = Input;
  const { RangePicker } = DatePicker;
  const [form] = Form.useForm();
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

  const handlePaginationChange = (page, pageSize) => {
    setLimit(pageSize);
    setOffset((page - 1) * pageSize);
  };

  const handleShowSizeChange = (current, size) => {
    setLimit(size);
    setOffset(0); // Puedes cambiar esto según tus necesidades
  };

  const handleOpenModal = (record: any) => {
    setSelectedRow(record);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedRow(null);
    setModalVisible(false);
  };


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

  const onFinish = async (formValues: any) => {
    try {
      const requestBody = {
        planServiceName: formValues?.planServiceName,
        price: formValues?.price,
        description: formValues?.description,
        startTime: formValues?.startTime.format("HH:mm"),
        endTime: formValues?.endTime.format("HH:mm"),
        status: 'active',
      };

      const response = await fetch("/api/createNewService", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        showSuccessNotification("Observacion creada exitosamente !!");
        const data = await response.json();
        setPlanService([data]);
        form.resetFields();
        //handleCloseModal();
      } else {
        const data = await response.json();
        showErrorNotification(
          data.error || "Error al crear observacion, consulte soporte"
        );
        form.resetFields();
      }
    } catch (error) {
      console.error(error);
      showErrorNotification(error || "Error de conexion, consulte soporte");
      form.resetFields();
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
  
  const ModalForm = (
    <Modal
      title="Agregar Plan de Servicio"
      open={modalVisible}
      onCancel={() => {
        form.resetFields();
        handleCloseModal();
      }}
      footer={null}
      style={{ width: "90%" }}
      centered
    >
      <Form
        form={form}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 25 }}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ size: "default" }}
        size={"middle"}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Nombre Plan de servicio"
          name="planServiceName"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Precio"
          name="price"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
         <InputNumber size="large" min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="description"
          label="Descripcion"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="startTime"
          label="Hora Inicio"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <TimePicker format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="endTime"
          label="Hora Termino"
          rules={[{ required: true, message: "Campo obligatorio" }]}
        >
          <TimePicker format="HH:mm" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item>
          <Button
            className="responsive-button"
            type="primary"
            htmlType="submit"
            style={{ width: "100%", marginBottom: "5px" }}
          >
            Guardar 
          </Button>
          <Button
            danger
            onClick={() => {
              form.resetFields();
              handleCloseModal();
            }}
            style={{ width: "100%", marginBottom: "5px" }}
          >
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  const CreateNewPlanButton = (
    <Button
      type="primary"
      className='button'
      style={{ marginBottom: '16px' }}  // Ajusta el estilo según tus necesidades
      onClick={() => handleOpenModal(null)}
    >
      Crear nuevo plan
    </Button>
  );
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
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            {CreateNewPlanButton}
            <Table 
            columns={columns} 
            dataSource={list} 
            scroll={{ x: 1300 }} 
            pagination={{
              current: Math.floor(offset / limit) + 1,
              total: list.length,
              pageSize: limit,
              onChange: handlePaginationChange,
              showSizeChanger: true,
              onShowSizeChange: handleShowSizeChange,
            }}
            />
            </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
        {ModalForm}
      </Layout>
    </Layout>
  );
}
