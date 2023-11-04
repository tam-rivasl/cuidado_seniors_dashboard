import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about-section">
      <link
        rel="stylesheet"
        href="https://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css"
      />
      <div className="aboutus-section">
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-sm-6 col-xs-12">
              <div className="aboutus">
                <h2 className="aboutus-title">¿Quiénes somos?</h2>
                <p className="aboutus-text">
                  Somos un servicio dedicado a simplificar la vida de los adultos mayores. Con años de experiencia
                  en el cuidado de la tercera edad, entendemos las necesidades únicas de nuestros clientes.
                </p>
                <p className="aboutus-text">
                  Nuestra plataforma de agendamiento en línea les permite programar sus citas médicas,
                  eventos sociales y actividades de manera sencilla y conveniente.
                </p>
              </div>
            </div>
            <div className="col-md-5 col-sm-6 col-xs-12">
              <div className="feature">
                <div className="feature-box">
                  <div className="clearfix">
                    <div className="iconset">
                      <span className="glyphicon glyphicon-heart icon"></span>
                      {/* Reemplaza glyphicon-heart con el ícono de un corazón o cualquier otro ícono relacionado con la salud */}
                    </div>
                    <div className="feature-content">
                      <h4>Trabajamos con el corazón</h4>
                      <p>
                        En un mundo cada vez más ocupado, estamos aquí para asegurarnos de que nuestros seres queridos mayores
                        reciban la atención que necesitan.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="feature-box">
                  <div className="clearfix">
                    <div className="iconset">
                      <span className="glyphicon glyphicon-calendar icon"></span>
                      {/* Reemplaza glyphicon-calendar con un ícono de un calendario o similar */}
                    </div>
                    <div className="feature-content">
                      <h4>Sin complicaciones ni estrés</h4>
                      <p>
                        Confíe en nosotros para simplificar la gestión de citas y eventos,
                        proporcionando un servicio dedicado a mejorar la calidad de vida de nuestros mayores.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="feature-box">
                  <div className="clearfix">
                    <div className="iconset">
                      <span className="glyphicon glyphicon-plus icon"></span>
                      {/* Reemplaza glyphicon-plus con un ícono que represente cuidado y atención médica */}
                    </div>
                    <div className="feature-content">
                      <h4>Cuidamos de ti</h4>
                      <p>
                        Es un compromiso que va más allá de las palabras, es una promesa de atención y protección constante,
                        brindando apoyo y cariño en todo momento para garantizar tu bienestar y seguridad.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
