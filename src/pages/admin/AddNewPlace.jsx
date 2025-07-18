import React from 'react'
import PlaceForm from '../../components/admin/PlaceForm'
import { Navigate, useNavigate } from 'react-router-dom';

function AddNewPlace() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/places');
  };
  return (
    <div>
      <PlaceForm onSubmitSuccess={handleSuccess} />
    </div>
  )
}

export default AddNewPlace
