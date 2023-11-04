import React, { useEffect, useState } from "react";
import { Descriptions, notification, Row, Col, Layout, theme } from "antd";
import MenuComponent from "../components/menu"; // Asegúrate de importar el componente del menú
import type { DescriptionsProps } from "antd";

const { Sider, Content, Footer } = Layout;

export default function UserProfile() {
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState("" as any);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["1"]);
  const [collapsed, setCollapsed] = useState(false); // Variable de estado para el colapso del menú

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      console.log(userId);
      setUserId(parseInt(userId));
    }
  }, []);

  useEffect(() => {
    getUserData();
  }, [userId]);

  const handleMenuSelect = (keys: string[]) => {
    setSelectedKeys(keys);
  };

  const getUserData = () => {
    const requestBody = {
      userId: userId,
    };
    fetch("/api/getUserById", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          console.log(data, "dataa");
          setUser(data);
        } else {
          response.json().then((data) => {
            showErrorNotification(
              data.message || "Error al cargar el listado de citas"
            );
          });
        }
      })
      .catch((error) => {
        console.error(error);
        showErrorNotification(error.message || "Error al consultar API");
      });
  };

  const showErrorNotification = (error: any) => {
    notification.error({
      message: "Error",
      description: error,
      placement: "topRight",
    });
  };

  const items: DescriptionsProps["items"] = [
    {
      label: "Nombre",
      children: user.firstName || "No Data",
    },
    {
      label: "Apellido",
      children: user.lastName || "N/A",
    },
    {
      label: "Genero",
      children: user.gender || "N/A",
    },
    {
      label: "Edad",
      children: user.age || "N/A",
    },
    {
      label: "Rut",
      children: user.identificationNumber || "N/A",
    },
    {
      label: "Fecha de Nacimiento",
      children: user.birthDate || "N/A",
    },
    {
      label: "Número de Teléfono",
      children: user.phoneNumber || "N/A",
    },
    {
      label: "Email",
      children: user.email || "N/A",
    },
    {
      label: "Direccion",
      children: user.address || "N/A",
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <MenuComponent selectedKeys={selectedKeys} onMenuSelect={handleMenuSelect} />
      </Sider>
      <Layout>
        <Content>
          <Row justify="center">
              <div
                style={{
                  boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                  borderRadius: "10px",
                  padding: '20px',
                  margin: '60px',
                  marginBlock: "50px"
                }}
              >
                <Descriptions
                  title="Mi Perfil"
                  bordered
                  column={{ xs: 1, sm: 1, md: 4, lg: 3, xl: 1, xxl: 4 }}
                  items={items}
                />
              </div>
          </Row>
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </Layout>
  );

}
