import React from 'react';
import { Layout, Row, Col } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';

const { Footer } = Layout;
const AppFooter: React.FC = () => {


  return (
    <Footer id='contact' className='footerStyle'>
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={6}>
          <div>
            <p>Cuidado Seniors SpA</p>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div>
           
            <p>  <PhoneOutlined /> Teléfono: +569 45678908</p>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div>
           
            <p>  <EnvironmentOutlined /> Dirección: Calle san Martin, Santiago Centro</p>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div>
           
            <p>  <MailOutlined /> cuidado_senior@gmail.com</p>
          </div>
        </Col>
      </Row>
    </Footer>
  );
};

export default AppFooter;
