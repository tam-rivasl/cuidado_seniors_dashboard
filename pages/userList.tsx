import React, { useEffect, useState } from "react";
import {
  Table,
  Layout,
  theme,
  Button,
  message,
  Popconfirm,
  notification,
  Col,
  Row,
} from "antd";
import MenuComponent from "../components/menu"; // Ajusta la ruta de importación según la ubicación de MenuComponent
import moment from "moment";
import { QuestionCircleOutlined } from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [messageApi] = message.useMessage();
  const [list, setList] = useState([] as Array<any>);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["1"]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0); 
  
  useEffect(() => {
    console.log(localStorage.getItem("email"));
    getUsers();
  }, []);
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
  const getUsers = async () => {
    try {
      const response = await fetch("/api/getUsers");
      if (!response.ok) {
        throw new Error("La solicitud no tuvo éxito");
      }
      const data = await response.json();
      console.log("data", data);
      setList(data);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error?.message ?? "La solicitud no tuvo éxito",
      });
    }
  };

  const handleMenuSelect = (keys: string[]) => {
    setSelectedKeys(keys);
  };

  const handlePaginationChange = (page, pageSize) => {
    setLimit(pageSize);
    setOffset((page - 1) * pageSize);
  };

  const handleShowSizeChange = (current, size) => {
    setLimit(size);
    setOffset(0); // Puedes cambiar esto según tus necesidades
  };

  const inactiveUser = async (userId: number) => {
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
        showSuccessNotification("Usuario ha sido dado de baja con exito!!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const errorData = await response.json();
        console.log(errorData, "error data");
        showErrorNotification(
          errorData.message || "Usuario ya se encuentra desactivado"
        );
      }
    } catch (error) {
      console.error(error);
      showErrorNotification(
        error || "Error al consultar API, consulte con soporte"
      );
    }
  };

  const columns = [
    {
      title: "Nombre",
      width: 100,
      dataIndex: "firstName",
      key: "firstName",
      sorter: true,
    },
    {
      title: "Apellido",
      width: 100,
      dataIndex: "lastName",
      key: "lastName",
      sorter: true,
    },
    {
      title: "Número de Teléfono",
      width: 100,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      sorter: true,
    },
    {
      title: "Edad",
      width: 100,
      dataIndex: "age",
      key: "age",
      sorter: true,
    },
    {
      title: "Género",
      width: 100,
      dataIndex: "gender",
      key: "gender",
      sorter: true,
    },
    {
      title: "RUT",
      width: 100,
      dataIndex: "identificationNumber",
      key: "rut",
      sorter: true,
    },
    {
      title: "Email",
      width: 150,
      dataIndex: "email",
      key: "email",
      sorter: true,
    },
    {
      title: "Fecha de Nacimiento",
      width: 150,
      dataIndex: "birthDate",
      key: "birthDate",
      render: (text: string) => moment(text).format("DD/MM/YYYY") || "No Data",
      sorter: true,
    },
    {
      title: "Status",
      width: 150,
      dataIndex: "status",
      key: "status",
      sorter: true,
    },
    {
      title: "Acciones",
      key: "operation",
      fixed: "right",
      width: 100,
      render: (item: any) => (
        <div>
          <Popconfirm
            title="Cancelar Cita"
            description="¿Esta seguro que quiere dar de baja a este usuario?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
            onConfirm={() => inactiveUser(item.userId)}
            onCancel={() => console.log("Cancelar confirmación")}
            okText="Sí"
            cancelText="No"
          >
            <Button style={{ width: "150px", marginBottom: "20px" }} danger>
              Dar de baja
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <MenuComponent
          selectedKeys={selectedKeys}
          onMenuSelect={handleMenuSelect}
        />
      </Sider>
      <Layout>
        <Content>
          <div className="tabsList" style={{ backgroundColor: "Background" }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Table
                  pagination={{
                    current: Math.floor(offset / limit) + 1,
                    total: list.length,
                    pageSize: limit,
                    onChange: handlePaginationChange,
                    showSizeChanger: true,
                    onShowSizeChange: handleShowSizeChange,
                  }}
                  columns={columns}
                  dataSource={list}
                  scroll={{ x: 1300 }}
                />
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}></Footer>
      </Layout>
    </Layout>
  );
}
