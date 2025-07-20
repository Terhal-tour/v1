import React from 'react'
import { useNavigate } from 'react-router-dom';
import AdminForm from '../../components/admin/AdminForm'

function AddNewAdmin() {

    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/admin/manageAdmins');
    };
    return (
        <div>
            <AdminForm onSubmitSuccess={handleSuccess} />
        </div>
    )
}

export default AddNewAdmin
