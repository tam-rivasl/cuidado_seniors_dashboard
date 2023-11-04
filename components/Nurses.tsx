// components/TeamSection.tsx
import React, { useEffect, useState } from 'react';
import {  message } from 'antd';

const TeamSection: React.FC = () => {
  const [messageApi] = message.useMessage();
  const [list, setList] = useState([] as Array<any>);
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await fetch('/api/getNurses');
      if (!response.ok) {
        throw new Error('La solicitud no tuvo éxito');
      }
      const data = await response.json();
      console.log('data', data);
      setList(data);
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: error?.message ?? 'La solicitud no tuvo éxito',
      });
    }
  };
  return (
    <section id='nurses'  className="our-webcoderskull padding-lg">
      <div className="container-teams">
        <ul className="row">
          {list.map((member, index) => (
            <li key={index} className="col-12 col-md-6 col-lg-3">
              <div className="cnt-block equal-height" style={{ height: '349px' }}>
                <figure>
                  <img
                    src={'img/nurses/enfermera-1.jpg'}
                    className="img-responsive"
                    alt=""
                  />
                </figure>
                <h5>
                  {member.firstName +(' ')+ member.lastName}
                </h5>
                <br></br>
                <h5>CONTACTO</h5>
                <h5>
                  {member.email}
                  <br></br>
                  {'+56' + member.phoneNumber}
                </h5>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TeamSection;
