import React from 'react';
import { Button, Checkbox, Form, Input, Card, Typography, notification } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Importa el enrutador de Next.js

const { Text } = Typography;
const showErrorNotification = (error: any) => {
  notification.error({
    message: 'Error',
    description: error,
    placement: 'topRight', // Cambia la ubicación según tus necesidades
  });
};

async function postData(data: any) {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      response.json().then((data) => {
        showErrorNotification(data.message || "Credenciales invalidas, intente nuevamente");
      });
    }

    return response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

const App: React.FC = () => {
  const router = useRouter(); 
  const onFinish = async (values: any) => {
    console.log('Success:', values);

    try {
      const response = await postData(values);
      console.log('Response from server:', response);
      localStorage.setItem('email', response.email);
      localStorage.setItem('rolId', response.rolId);
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('rolName', response.rolName);
      localStorage.setItem('firstName', response.firstName);
      localStorage.setItem('lastName', response.lastName);

      // Aquí puedes manejar la respuesta, como redireccionar al usuario a una página diferente.
      router.push('dashboard'); // Cambia '/dashboard' a la página a la que deseas redirigir al usuario.
    } catch (error) {
      console.error('Error:', error);
      // Maneja el error, por ejemplo, muestra un mensaje de error al usuario.
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  type FieldType = {
    email?: string;
    password?: string;
  };

  return (
    <div className="container">
      <Card className="card-login">
        <img
          src="/img/logo.png"
          className="logo"
          alt="Logo"
        />
        <Form
          layout='vertical'
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Ingresa un correo válido',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Ingresa tu correo"
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="Contraseña"
            name="password"
            rules={[
              {
                required: true,
                message: 'Ingresa tu contraseña',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Ingresa tu contraseña"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Recordar</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              icon={<LoginOutlined />}
            >
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <Text type="secondary">¿Aún no tienes una cuenta?&nbsp;</Text>
          <Link href="register" color='primary'>
            Registrarse
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default App;
