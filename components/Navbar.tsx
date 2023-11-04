import React from 'react';
import { Affix, Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons'; // Importa el icono de usuario

const { Header } = Layout;

const Navbar: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Affix offsetTop={0}>
      <Header className="header-navbar">
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
          <Menu.Item key="home" onClick={() => scrollToSection('home')}>
            Home
          </Menu.Item>
          <Menu.Item key="about" onClick={() => scrollToSection('about-section')}>
            Quienes somos
          </Menu.Item>
          <Menu.Item key="nurses" onClick={() => scrollToSection('nurses')}>
            Nuestro Equipo
          </Menu.Item>
          <Menu.Item key="plans" onClick={() => scrollToSection('plans')}>
            Planes
          </Menu.Item>
          <Menu.Item key="login"  style={{marginLeft: 'auto'}}icon={<UserOutlined />}>
            <a href="/login"> Iniciar sesión </a>
          </Menu.Item>
        </Menu>
      </Header>
    </Affix>
  );
};

export default Navbar;
