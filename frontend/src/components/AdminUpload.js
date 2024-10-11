// src/components/AdminUpload.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubirPlato from './SubirPlato';
import Platos from './Platos';
import Pedidos from './Pedidos';
import '../styles/AdminUpload.css';

const AdminUpload = () => {
  const [tipos, setTipos] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tipos`);
        setTipos(response.data);
      } catch (error) {
        console.error('Error al obtener los tipos:', error);
      }
    };

    fetchTipos();
  }, []);

  return (
    <div className='admin-upload'>
      <div className='tabs'>
        <button
          className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}>
          Cargar
        </button>
        <button
          className={`tab-button ${activeTab === 'buscar' ? 'active' : ''}`}
          onClick={() => setActiveTab('buscar')}>
          Buscar
        </button>
        <button
          className={`tab-button ${activeTab === 'pedidos' ? 'active' : ''}`}
          onClick={() => setActiveTab('pedidos')}>
            Pedidos
        </button>
      </div>

      <div className='tab-content'>
        {activeTab === 'upload' && (
          <SubirPlato tipos={tipos} onImageUrlChange={setImageUrl} />
        )}

        {activeTab === 'buscar' && (
          <Platos tipos={tipos} />
        )}

        {activeTab === 'pedidos' && (
          <Pedidos />
        )}
      </div>
    </div>
  );
};

export default AdminUpload;
