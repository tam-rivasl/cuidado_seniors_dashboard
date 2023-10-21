import React from "react";
import { Menu } from "antd";
import {
  UserOutlined,
  DesktopOutlined,
  FileOutlined,
  TeamOutlined,
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
    { label:'Crear Usuario', value: '/create-user'},
    {label: 'Listado de usuario', value:'/'},
    { label:'Crear Cita', value: '/create-appointment'},
    {label: 'Listado de citas', value:'/appointment-list'},
   
    
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
  return (
    <Menu
      theme="dark"
      selectedKeys={selectedKeys}
      mode="inline"
      onClick={({ key }) => onMenuSelect([key])}
    >
      {items.map((item) => (
        <Menu.Item  onClick={()=>window.location.href=item.value} key={item.key} icon={item.icon}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default MenuComponent;
