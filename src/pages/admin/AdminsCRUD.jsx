import React, { useEffect, useState } from 'react'
import "../../css/adminCrudPlacesPage.css";
import axios from 'axios';
import { NavLink } from 'react-router-dom';

import { TrashIcon } from '@heroicons/react/24/outline';


function AdminsCRUD() {

 const token = sessionStorage.getItem("jwt");
 axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

 // ✅ Replace with your real auth check
 const loggedInIsSuper = false; // true → current user is a super admin

 const [admins, setAdmins] = useState([]);
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);

 // Number of admins per page (adjust as needed)
 const adminsPerPage = 6;

 useEffect(() => {
  fetchAdmins();
 }, []);

 const fetchAdmins = async () => {
  try {
   const response = await axios.get('https://backend-mu-ten-26.vercel.app/admin');
   setAdmins(response.data); // you get full array
   setTotalPages(Math.ceil(response.data.length / adminsPerPage));
  } catch (error) {
   console.error('Error fetching admins:', error);
  }
 };

 const handleDeleteAdmin = async (admin) => {
  if (admin.isSuper) {
   alert('Super Admins cannot be deleted!');
   return;
  }

  if (!loggedInIsSuper) {
   alert('Only Super Admins can delete admins!');
   return;
  }

  const confirmDelete = window.confirm(`Are you sure you want to delete ${admin.name}?`);
  if (!confirmDelete) return;

  try {
   await axios.delete(`https://backend-mu-ten-26.vercel.app/admin/${admin._id}`);
   setAdmins(prevAdmins => prevAdmins.filter(a => a._id !== admin._id));

   const newTotalPages = Math.ceil((admins.length - 1) / adminsPerPage);
   if (currentPage > newTotalPages) {
    setCurrentPage(newTotalPages);
   }
   setTotalPages(newTotalPages);
  } catch (error) {
   console.error('Error deleting admin:', error);
  }
 };


 // Calculate the current page's admins slice
 const indexOfLastAdmin = currentPage * adminsPerPage;
 const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
 const currentAdmins = admins.slice(indexOfFirstAdmin, indexOfLastAdmin);

 const handleNextPage = () => {
  if (currentPage < totalPages) {
   setCurrentPage(prev => prev + 1);
  }
 };

 const handlePrevPage = () => {
  if (currentPage > 1) {
   setCurrentPage(prev => prev - 1);
  }
 };


 return (
  <div>
   <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
    <div className="max-w-7xl mx-auto">
     <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Admins</h1>
      {/* add new admin */}
      <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-[var(--oasis-green)] text-white text-sm font-medium shadow-sm hover:bg-green-700 transition-colors">
       <svg fill="currentColor" height={20} viewBox="0 0 256 256" width={20} xmlns="http://www.w3.org/2000/svg">
        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
       </svg>
       <NavLink to="/admin/addNewAdmin" className="truncate">Add New Admin</NavLink>
      </button>
     </div>

     <div className="bg-white shadow-md rounded-lg p-4">

      {/* admins  */}
      <div className="overflow-x-auto @container">
       <div className="align-middle inline-block min-w-full">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
         <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
           <tr>
            <th className="table-header-cell" scope="col">Name</th>
            <th className="table-header-cell" scope="col">Email</th>
            <th className="table-header-cell" scope="col">is_Super</th>
            <th className="table-header-cell" scope="col">updatedAt</th>
            <th className="relative px-6 py-3" scope="col"><span className="sr-only">Actions</span></th>
           </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
           {currentAdmins && currentAdmins.map(admin => (
            <tr className="hover:bg-gray-50 transition-colors" key={admin._id}>
             <td className="table-body-cell ">{admin.name}</td>
             <td className="table-body-cell">{admin.email}</td>
             <td className="table-body-cell">{admin.isSuper ? 'Yes' : 'No'}</td>
             <td className="table-body-cell">{new Date(admin.updatedAt).toLocaleString()}</td>

             <td className="table-body-cell text-right ">
              {/* edit icon */}
              <NavLink
               to={`/admin/editAdmin/${admin._id}`}
               className="action-link mr-3"
              >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 inline text-blue-500 hover:text-blue-700 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
               </svg>
              </NavLink>
              {/* delete admin */}
              <button
               onClick={() => handleDeleteAdmin(admin)}
               style={{ color: 'red' }}
              >
               <TrashIcon className="h-6 w-6 text-red-600" />
              </button>
             </td>
            </tr>

           ))}
          </tbody>
         </table>
        </div>
       </div>
      </div>
      {/* pagination */}
      <div className="mt-4 flex gap-4 items-center">
       <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:cursor-pointer"
       >
        Prev
       </button>
       <span>
        Page {currentPage} of {totalPages}
       </span>
       <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:cursor-pointer"
       >
        Next
       </button>
      </div>

     </div>
    </div>
   </main>

  </div>
 )
}

export default AdminsCRUD
