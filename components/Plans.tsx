import React, { useEffect, useState } from "react";
import { Button, Card, Col, Layout, Row, message } from "antd";

const Plans: React.FC = () => {
  const [messageApi] = message.useMessage();
  const [list, setList] = useState([] as Array<any>);
  const { Content, Footer } = Layout;
  useEffect(() => {
    getPlanService();
  }, []);

  const getPlanService = async () => {
    try {
      const response = await fetch("/api/getPlanService");
      if (!response.ok) {
        throw new Error("La solicitud no tuvo éxito");
      }
      const data = await response.json();
      setList(data);
      console.log("data", data);
    } catch (error: any) {
      messageApi.open({
        type: "error",
        content: error?.message ?? "La solicitud no tuvo éxito",
      });
    }
  };

  return (
          <Row id="plans" gutter={16}>
            {list.map((item, index) => (
              <Col span={8} key={index}>
                <Card className="card-plans" title={item.planServiceName} bordered={false}>
                <figure>
                  <img
                    src={'img/cuidado-3.jpg'}
                    className="img-responsive"
                    alt=""
                  />
                </figure>
                 <h5>Descripcion: {item.description} </h5>
                 <h5>Precio: ${item.price}</h5>
                 <div style={{textAlign: 'center'}}>
                 <Button href="/login"  type="primary" block> Contratar </Button>
                 </div>
                </Card>
              </Col>
            ))}
          </Row>
  );
};

export default Plans;
