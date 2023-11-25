import React, { useEffect, useState } from "react";
import {
  Descriptions,
  notification,
  Row,
  Col,
  Layout,
  theme,
  Button,
  Modal,
  Input,
} from "antd";
import MenuComponent from "../components/menu"; // Asegúrate de importar el componente del menú
import type { DescriptionsProps } from "antd";
import moment from "moment";

const { Sider, Content, Footer } = Layout;

interface EmergencyContact {
  map: (
    contact: {
      emergency_contact: {
        emergencyContactId: number;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        relationship: string;
        status: string;
        createdDate: Date;
        updatedDate: Date;
        deletedDate: Date | null;
      };
    }, 
    subIndex: React.Key | null | undefined
  ) => React.ReactNode;
  patientContactId: number;
  createdDate: Date;
  updatedDate: Date;
  deletedDate: Date | null;
  emergency_contact: {
    emergencyContactId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    relationship: string;
    status: string;
    createdDate: Date;
    updatedDate: Date;
    deletedDate: Date | null;
  };
}



export default function UserProfile() {
  const [user, setUser] = useState({});
  const [selectedKeys, setSelectedKeys] = useState<string[]>(["1"]);
  const [collapsed, setCollapsed] = useState(false); // Variable de estado para el colapso del menú
  //const [userId, setUserId] = useState("" as any);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]); 
 
//mapamos todos los contactos de emergencia que tenga el usuario iterando en cada uno
  const mapEmergencyContacts = (emergencyContacts: any[]) => {
    return emergencyContacts.map((contactsArray, index) => (
      <div key={index}>
        {Array.isArray(contactsArray) ? (
          contactsArray.map((contact: {
            emergency_contact: {
              deletedDate: string;
              updatedDate: string;
              createdDate: string;
              status: string;
              relationship: string;
              phoneNumber: string;
              firstName: any;
              lastName: any;
              email: any;
            };
          }, subIndex: number) => {
            const contactItems = [
              {
                label: 'Nombre',
                children: contact.emergency_contact.firstName,
              },
              {
                label: 'Apellido',
                children: contact.emergency_contact.lastName,
              },
              {
                label: 'Email',
                children: contact.emergency_contact.email,
              },
              {
                label: "Número de Teléfono",
                children: contact.emergency_contact.phoneNumber,
              },
              {
                label: "Parentezco",
                children: contact.emergency_contact.relationship,
              },
            ];
  
            return (
              <Descriptions
                key={`${index}-${subIndex}`}
                title={`Contacto de Emergencia ${index + 1}-${subIndex + 1}`}
                bordered
                column={{ xs: 1, sm: 1, md: 4, lg: 3, xl: 1, xxl: 4 }}
                items={contactItems}
              />
            );
          })
        ) : (
          <div>
            <Button type="primary" onClick={showContactModal}>
             Agregar Contacto de Emergencia
            </Button>
          </div>
        )}
      </div>
    ));
  };
  

  //const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[][]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [newEmergencyContact, setNewEmergencyContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    relationship: '',
    status: 'active', //se mentiene active
  });

  useEffect(() => {
   const userId = localStorage.getItem("userId");
     if (userId) {
       console.log(userId);
       setUserId(parseInt(userId));
     }
   }, []);
   useEffect(() => {
     getUserData();
     console.log("Se ejecutó el useEffect con userId:", userId);
   }, [userId]);



  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setUserId(parseInt(userId));
    }
  }, []);
  useEffect(() => {
    if (userId !== null) {
      fetchEmergencyContacts(userId);
    }
  }, [userId]);



  const fetchEmergencyContacts = async (patientId: number) => {
    try {
      const apiUrl: string = `${process.env.NEXT_PUBLIC_API_URL}/emergency-contact/${patientId}`;
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error('Error al obtener datos de la API');
      }
  
      const data = await response.json();
      console.log('Datos de contactos de emergencia:', data); 
  
      setEmergencyContacts(data); //coloca los contactos de emergencia en el estado
    } catch (error) {
      console.error(error);
      throw new Error('Error al obtener datos de la API');    }
  };
  





// Función para abrir el modal del contacto de emergencia
  const [isContactModalVisible, setIsContactModalVisible] = useState(false);
  const showContactModal = () => { 
    setIsContactModalVisible(true);
  };
// Función para cancelar y cerrar el modal del contacto de emergencia
  const handleContactCancel = () => { 
    setIsContactModalVisible(false);
  };
  const handleMenuSelect = (keys: string[]) => {
    setSelectedKeys(keys);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showErrorNotification = (error: any) => {
    notification.error({
      message: "Error",
      description: error,
      placement: "topRight",
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
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
      children: moment(user.birthDate).format("DD/MM/YYYY")  || "N/A",
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

    {
      label: "Direccion",
      children: user.address || "N/A",
    },
  ];


  //muestra los datos del usuario
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
          if (response.status >= 500) {
            console.error("Error en el servidor. Por favor, inténtalo de nuevo más tarde.");
          } else if (response.status >= 400 && response.status < 500) {
            const data = await response.json();
            console.error(data.message || "Error al cargar los datos del paciente");
          } else {
            // Si no es un error del cliente ni del servidor 
            console.error("Error al procesar la solicitud");
          }
        }
      })
      .catch((error) => {
        console.error(error);
        console.error('Error al consultar API:', error.message || "Error desconocido");
      });
  };




//Crea el contacto de emergencia
  const handleContactOk = async () => { 
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        notification.error({
          message: "Error",
          description: "ID de usuario no encontrado",
          placement: "topRight",
        });
        return;
      }
      const requestBody = {//cumpliendo con el dto
        patientId: parseInt(userId),
        contact: {
          firstName: newEmergencyContact.firstName,
          lastName: newEmergencyContact.lastName,
          email: newEmergencyContact.email,
          phoneNumber: newEmergencyContact.phoneNumber,
          relationship: newEmergencyContact.relationship,
          status: newEmergencyContact.status,
        },
      };
      const response = await fetch('/api/createContactEmergency', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Datos de emergencia enviados:", data);
        notification.success({
          message: "Éxito",
          description: "Contacto de emergencia enviado!",
          placement: "topRight",
        });
      } else {
        if (response.status === 400) {
          const data = await response.json();
          //datos invalidos 
          notification.error({
            message: "Error datos incorrectos",
            description: data.message || "Error en los datos ingresados",
            placement: "topRight",
          });
        } else if (response.status === 404) {
          // no se encuentra la ruta
          notification.error({
            message: "Recurso no encontrado",
            description: "No se encontró la ruta solicitada",
            placement: "topRight",
          });
        } else {
          // otros errores
          throw new Error("Error en la solicitud API");
        }
      }
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        console.error('Mensaje de error:', error.message); 
      }
    }
    setIsContactModalVisible(false);
  };

  // Función para manejar cambios en input cueando se este agregando nuevo contacto
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>, 
    fieldName: string): void {
    const { value } = e.target;
    setNewEmergencyContact((prevContact) => ({
      ...prevContact,
      [fieldName]: value,
      lastName: fieldName === 'lastName' ? value : prevContact.lastName,
      email: fieldName === 'email' ? value : prevContact.email,
      phoneNumber: fieldName === 'phoneNumber' ? value : prevContact.phoneNumber,
      status: fieldName === 'status' ? value : prevContact.status,
    }));
  }

  console.log('emergencyContacts:', emergencyContacts);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <MenuComponent
          selectedKeys={selectedKeys}
          onMenuSelect={handleMenuSelect}
        />
      </Sider>
      <Layout>
        <Content>
          <Row justify="center">
            <div
              style={{
                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                borderRadius: "10px",
                padding: "20px",
                margin: "60px",
                marginBlock: "50px",
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
          <Row justify="center">
            <div
              style={{
                boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                borderRadius: "10px",
                padding: "20px",
                margin: "60px",
                marginBlock: "50px",
                }}
              >
              {mapEmergencyContacts(emergencyContacts)}
            </div>
          </Row>  
          <>
            {/* se despliega para add un contacto x */}
              <Modal
                title="Agregar Contacto de Emergencia"
                visible={isContactModalVisible}
                onOk={handleContactOk}
                onCancel={handleContactCancel}
              >
              {/* datos del contacto de emergencia */}
              <Input
                placeholder="Nombre"
                value={(newEmergencyContact  && newEmergencyContact .firstName) || ''}
                onChange={(e) => handleInputChange(e, 'firstName')}
              />
              <Input
                placeholder="Apellido"
                value={(newEmergencyContact  && newEmergencyContact .lastName) || ''}
                onChange={(e) => handleInputChange(e, 'lastName')}
              />
              <Input
                placeholder="Email"
                value={(newEmergencyContact  && newEmergencyContact .email) || ''}
                onChange={(e) => handleInputChange(e, 'email')}
              />
              <Input
                placeholder="Número de Teléfono"
                value={(newEmergencyContact  && newEmergencyContact .phoneNumber) || ''}
                onChange={(e) => handleInputChange(e, 'phoneNumber')}
              />
              <Input
                placeholder="Parentezco"
                value={(newEmergencyContact  && newEmergencyContact .relationship) || ''}
                onChange={(e) => handleInputChange(e, 'relationship')}
              />
            </Modal>   
          </>
        </Content>
        <Footer style={{ textAlign: "center" }}></Footer>       
      </Layout>
    </Layout>
  );
}



