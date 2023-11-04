import React, { useState, useEffect } from "react";
import { Card, Row, Col, Layout } from "antd";
import {
  UserAddOutlined,
  TeamOutlined,
  CalendarOutlined,
  ContactsOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import MenuComponent from "../components/menu";

const menuItems = [
  { label: "Perfil",  icon: <IdcardOutlined />, path: "perfil" },
  { label: "Crear Usuario", icon: <UserAddOutlined />, path: "create-user" },
  { label: "Listado de Usuario", icon: <TeamOutlined />, path: "userList" },
  {
    label: "Crear Cita",
    icon: <CalendarOutlined />,
    path: "create-appointment",
  },
  {
    label: "Agendar Cita",
    icon: <CalendarOutlined />,
    path: "user-appointment",
  },
  {
    label: "Listado de Citas",
    icon: <ContactsOutlined />,
    path: "appointment-list",
  },
  {
    label: "Mi Agenda",
    icon: <ContactsOutlined />,
    path: "patientAppointmentList",
  },
  {
    label: "Mi Agenda",
    icon: <ContactsOutlined />,
    path: "nurseAppointmentList",
  },
  {
    label: "Lista de Planes",
    icon: <ContactsOutlined />,
    path: "planServiceList",
  },
  // Agregar perfil después
];

const IndexPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["1"]);
  const [rolName, setUserRolName] = useState<string | null>(null);

  useEffect(() => {
    const rolName = localStorage.getItem("rolName");
    setUserRolName(rolName);
  }, []);

  const handleMenuSelect = (keys: string[]) => {
    setSelectedKeys(keys);
  };
  const { Sider, Content } = Layout;

  const menuItemsMap: { [rolName: string]: string[] } = {
    secretary: ["perfil","create-user", "userList", "appointment-list", "planServiceList"],
    patient: ["perfil","patientAppointmentList", "user-appointment"],
    nurse: ["perfil","create-appointment", "nurseAppointmentList", "nurseAppointmentList"],
  };

  const filteredMenuPaths = menuItemsMap[rolName] || [];

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
          <div style={{ padding: "16px" }}>
            <Row gutter={16}>
              {menuItems
                .filter((menuItem) => filteredMenuPaths.includes(menuItem.path))
                .map((menuItem, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={index}>
                    <Card
                      title={menuItem.label}
                      onClick={() => (window.location.href = `/${menuItem.path}`)}
                      style={{
                        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                        borderRadius: "10px",
                        padding: "20px",
                        margin: "20px",
                        marginBlock: "20px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "48px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "20vh",
                        }}
                      >
                        {menuItem.icon}
                      </div>
                    </Card>
                  </Col>
                ))}
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default IndexPage;
