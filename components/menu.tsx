import React, { useEffect, useState } from "react";
import { Menu, Avatar, Space } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  UserAddOutlined,
  HomeOutlined,
  IdcardOutlined,
  ContactsOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

function createMenuItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode
): MenuItem {
  return {
    key,
    icon,
    label,
  };
}

const menuItems: MenuItem[] = [
  createMenuItem("Inicio", "dashboard", <HomeOutlined />),
  createMenuItem("Perfil", "perfil", <IdcardOutlined />),
  createMenuItem("Crear Usuario", "create-user", <UserAddOutlined />),
  createMenuItem("Listado de Usuario", "userList", <TeamOutlined />),
  createMenuItem("Crear Cita", "create-appointment", <CalendarOutlined />),
  createMenuItem("Agendar Cita", "user-appointment", <CalendarOutlined />),
  createMenuItem("Listado de Citas", "appointment-list", <ContactsOutlined />),
  createMenuItem("Mi Agenda", "patientAppointmentList", <ContactsOutlined />),
  createMenuItem("Mi Agenda", "nurseAppointmentList", <ContactsOutlined />),
  createMenuItem("Lista de Planes", "planServiceList", <ContactsOutlined />),
];

interface MenuComponentProps {
  selectedKeys: string[];
  onMenuSelect: (selectedKeys: string[]) => void;
}

function filterMenuItems(rolName: string): MenuItem[] {
  const menuItemsMap: { [rolName: string]: MenuItem[] } = {
    secretary: [
      menuItems[0],
      menuItems[1],
      menuItems[2],
      menuItems[3],
      menuItems[6],
      menuItems[9],
    ], // Muestra elementos específicos para enfermeras.
    patient: [menuItems[0], menuItems[1], menuItems[5], menuItems[7]], // Muestra elementos específicos para pacientes.
    nurse: [menuItems[0], menuItems[1], menuItems[4], menuItems[8]], // Muestra elementos específicos para secretarias.
  };
  return menuItemsMap[rolName] || [];
}

const MenuComponent: React.FC<MenuComponentProps> = ({
  selectedKeys,
  onMenuSelect,
}) => {
  useEffect(() => {
    const rolName = localStorage.getItem("rolName"); // Obtén el nombre del rol desde localStorage.
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");

    if (firstName && lastName) {
      setUserName(firstName + " " + lastName);
      setUserNameIcon(firstName[0] + lastName[0]);
      setUserRolName(rolName);
    }
  }, []);

  const [userName, setUserName] = useState<string>("");
  const [userNameIcon, setUserNameIcon] = useState<string>("");
  const [rolName, setUserRolName] = useState("" as any);
  const allowedMenuItems = filterMenuItems(rolName);
  allowedMenuItems.push(createMenuItem("Cerrar Sesión", "logout", <LogoutOutlined />));

  const handleLogout = () => {
    localStorage.removeItem("rolName");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    window.location.href = "/login"; 
  };
  
  return (
    <div className="menu-container">
      <Space direction="horizontal" wrap size={16}>
        <Avatar
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.88)",
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.6)",
          }}
          size={50}
        >
          {userNameIcon.toUpperCase()}
        </Avatar>
        <p className="welcome-message">
        Bienvenido,
        <br /> 
        {userName}
      </p>
        </Space>
        <Menu
          theme="dark"
          selectedKeys={selectedKeys}
          mode="inline"
          onClick={({ key }) => {
            if (key === "logout") {
              handleLogout(); // Llama a la función de cierre de sesión si se selecciona el botón de logout.
            } else {
              onMenuSelect([key]);
            }
          }}
        >
          {allowedMenuItems.map((item: MenuItem) => (
            <Menu.Item
              key={item.key}
              icon={item.icon}
              onClick={() => (window.location.href = item.key)}
            >
              {item.label}
            </Menu.Item>
          ))}
        </Menu>
    </div>
  );
};

export default MenuComponent;
