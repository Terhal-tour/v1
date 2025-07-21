import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AdminForm from '../../components/admin/AdminForm';
import Spinner from '../../components/Spinner';
function EditAdmin() {

    const { id } = useParams();
    const [adminData, setAdminData] = useState(null);
    const navigate = useNavigate();
    const token = sessionStorage.getItem('jwt');

    // fetch admin 
    useEffect(() => {
        if (!token) {
            console.error('No JWT found');
            return;
        }

        axios.get(`http://backend-mu-ten-26.vercel.app/admin/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                console.log(res.data.admin);
                setAdminData(res.data.admin);
            })
            .catch(err => console.error('Error fetching admin:', err));
    }, [id]);

    const handleSuccess = () => {
        navigate('/admin/manageAdmins');
    };

    return (
        <div>
            {adminData ? (
                <AdminForm initialData={adminData} onSubmitSuccess={handleSuccess} />
            ) : (
                <div className="p-6 text-center text-amber-800">
                    <Spinner />
                </div>
            )}

        </div>
    )
}

export default EditAdmin
