// src/components/AdminUpload.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UploadPlate from './UploadPlate';
import EditPlate from './EditPlate';
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
          onClick={() => setActiveTab('upload')}
        >
          Cargar
        </button>
        <button
          className={`tab-button ${activeTab === 'edit' ? 'active' : ''}`}
          onClick={() => setActiveTab('edit')}
        >
          Buscar 
        </button>
      </div>

      <div className='tab-content'>
        {activeTab === 'upload' && (
          <UploadPlate tipos={tipos} onImageUrlChange={setImageUrl} />
        )}

        {activeTab === 'edit' && (
          <EditPlate tipos={tipos} />
        )}
      </div>
    </div>
  );
};

export default AdminUpload;
