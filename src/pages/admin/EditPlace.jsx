import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import PlaceForm from '../../components/admin/PlaceForm';
import Spinner from '../../components/Spinner';

export default function EditPlace() {
  const { id } = useParams();
  const [placeData, setPlaceData] = useState(null);
  const navigate = useNavigate();
  // sessionStorage.setItem('jwt', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmNiNGI5Y2IxYzM4ZmEyOTcxNmQ4ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1Mjg2NTExNywiZXhwIjoxNzUzNDY5OTE3fQ.mK_IB_vnpPCDul6TrBDXP6ilk4WSbpUWuFfwYyQ0Hpk');
  const token = sessionStorage.getItem('jwt');

// fetch post 
  useEffect(() => {
    if (!token) {
      console.error('No JWT found');
      return;
    }

    axios.get(`https://backend-mu-ten-26.vercel.app/places/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log(res.data.data);
        setPlaceData(res.data.data);
      })
      .catch(err => console.error('Error fetching place:', err));
  }, [id]);

  const handleSuccess = () => {
    navigate('/admin/places');
  };

  return (
    <div>
      {placeData ? (
        <PlaceForm initialData={placeData} onSubmitSuccess={handleSuccess} />
      ) : (
        <div className="p-6 text-center text-amber-800">
          <Spinner />
        </div>
      )}
    </div>
  );
}
