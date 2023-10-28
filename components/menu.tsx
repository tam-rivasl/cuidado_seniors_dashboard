import React, { useEffect, useState } from "react";
import { Menu, Avatar } from "antd";
import {
  UserOutlined,
  DesktopOutlined,
  FileOutlined,
  TeamOutlined,
  CalendarOutlined,
  CarryOutOutlined,
  ContactsOutlined,
  UserAddOutlined,
  HomeOutlined,
  AuditOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Inicio", "/", <HomeOutlined />),
  getItem("Perfil", "", <IdcardOutlined />),
  getItem("Crear Usuario", "create-user", <UserAddOutlined />),
  getItem("Listado de Usuario", "userList", <TeamOutlined />),
  getItem("Crear Cita", "create-appointment", <CalendarOutlined />),
  getItem("Agendar Cita", "user-appointment", <CalendarOutlined />),
  getItem("Listado de Citas", "appointment-list", <ContactsOutlined />),
  getItem("Mi Agenda", "patientAppointmentList", <ContactsOutlined />),
  getItem("Mi Agenda", "nurseAppointmentList", <ContactsOutlined />),

  getItem("Lista de Planes", "planServiceList", <ContactsOutlined />),
  // Agrega otros elementos del menú según sea necesario.
];
interface MenuComponentProps {
  selectedKeys: string[];
  onMenuSelect: (selectedKeys: string[]) => void;
}

const MenuComponent: React.FC<MenuComponentProps> = ({
  selectedKeys,
  onMenuSelect,
}) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Accede a localStorage aquí después de que el componente se haya montado en el navegador.
    const email = localStorage.getItem("email");
    const firstName = localStorage.getItem("firstName");

    if (email) {
      console.log("Email from localStorage:", email);
      setUserName(firstName || ""); // Establece el nombre del usuario en el estado
    }
  }, []);

  return (
    <>
      <Avatar
        size={32}
        icon={<UserOutlined />}
        style={{ backgroundColor: "#87d068" }}
      >
        {userName && userName[0].toUpperCase()}{" "}
        {/* Mostrar la primera letra del nombre */}
      </Avatar>
      <Menu
        theme="dark"
        selectedKeys={selectedKeys}
        mode="inline"
        onClick={({ key }) => onMenuSelect([key])}
      >
        {items.map((item: any) => (
          <Menu.Item
            onClick={() => (window.location.href = item.key)}
            key={item.key}
            icon={item.icon}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    </>
  );
};

export default MenuComponent;
