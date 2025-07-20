import React, { useEffect, useState } from 'react'
import "../../css/adminCrudPlacesPage.css";
import axios from 'axios';
import { NavLink } from 'react-router-dom';


function AdminCrudPlaces() {
 // sessionStorage.setItem('jwt', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4Nzk1NmY4YjExMjk3YzI2MjFlOWYxZiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1Mjg2NTE3OSwiZXhwIjoxNzUzNDY5OTc5fQ.JJbcZ_rIrCfrPafxjdbAb_gnbpHnZE0nyDoWqy80VBQ');
 const token = sessionStorage.getItem("jwt");
 axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

 const [places, setPlaces] = useState([]);
 const [placeName, setPlaceName] = useState('');
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);

 // ✅ Fetch ALL places (paginated) OR searched places (no pagination)
 useEffect(() => {
  const fetchPlaces = async () => {
   try {
    let res;
    if (placeName.trim() !== "") {
     res = await axios.get(
      `https://backend-mu-ten-26.vercel.app/places/search?q=${placeName}`
     );
     setPlaces(res.data);
     setTotalPages(1);
    } else {
     res = await axios.get(
      `https://backend-mu-ten-26.vercel.app/admin/place?page=${currentPage}`
     );
     setPlaces(res.data.data);
     setTotalPages(res.data.totalPages);
    }
   } catch (err) {
    console.error("Error fetching places:", err);
   }
  };
  fetchPlaces();
 }, [placeName, currentPage]);

 // ✅ Toggle visibility
 const toggleVisibility = async (placeId) => {
  try {
   await axios.put(
    `https://backend-mu-ten-26.vercel.app/admin/place/${placeId}/visibility`
   );
   setPlaces((prev) =>
    prev.map((p) =>
     p._id === placeId ? { ...p, visible: !p.visible } : p
    )
   );
  } catch (err) {
   console.error('Error toggling visibility:', err);
  }
 };

 // ✅ Pagination handlers
 const goToPrevious = () => {
  setCurrentPage((prev) => Math.max(prev - 1, 1));
 };

 const goToNext = () => {
  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
 };

 return (
  <div>
   <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
    <div className="max-w-7xl mx-auto">
     <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Places</h1>
      {/* add new place */}
      <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-[var(--oasis-green)] text-white text-sm font-medium shadow-sm hover:bg-green-700 transition-colors">
       <svg fill="currentColor" height={20} viewBox="0 0 256 256" width={20} xmlns="http://www.w3.org/2000/svg">
        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
       </svg>
       <NavLink to="/admin/addNewPlace" className="truncate">Add New Place</NavLink>
      </button>
     </div>

     <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
       {/* search */}
       <div className="relative w-full sm:max-w-xs">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
         <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path clipRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" fillRule="evenodd" />
         </svg>
        </div>
        <input
         className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[var(--oasis-green)] focus:border-[var(--oasis-green)] sm:text-sm"
         id="search"
         name="search"
         placeholder="Search places with name .."
         type="text"
         value={placeName}
         onChange={(e) => {
          setPlaceName(e.target.value);
          setCurrentPage(1);
         }}
        />
       </div>
      </div>
      {/* places  */}
      <div className="overflow-x-auto @container">
       <div className="align-middle inline-block min-w-full">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
         <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
           <tr>
            <th className="table-header-cell" scope="col">Name</th>
            <th className="table-header-cell" scope="col">Category</th>
            <th className="table-header-cell" scope="col">Rating</th>
            <th className="table-header-cell" scope="col">Description</th>
            <th className="table-header-cell" scope="col">Address</th>
            <th className="relative px-6 py-3" scope="col"><span className="sr-only">Actions</span></th>
           </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
           {places && places.map(place => (
            <tr className="hover:bg-gray-50 transition-colors" key={place._id}>
             <td className="table-body-cell ">{place.name}</td>
             <td className="table-body-cell">{place.category}</td>
             <td className="table-body-cell">
              <div className="flex items-center">
               {[1, 2, 3, 4, 5].map((star) => (
                <span
                 key={star}
                 className={star <= Math.round(place.rating) ? 'text-yellow-500' : 'text-gray-300'}
                >
                 ★
                </span>
               ))}
               <span className="ml-2 text-gray-600">{place.rating.toFixed(1)}</span>
              </div>
             </td>
             <td className="table-body-cell">{place.description
              ? place.description.split(' ').slice(0, 4).join(' ')
              : 'No description'}
              {place.description && place.description.split(' ').length > 4 ? '...' : ''}
             </td>
             <td className="table-body-cell">{place.address.split(' ').slice(0, 4).join(' ')}{place.address.split(' ').length > 4 ? '...' : ''}</td>
             <td className="table-body-cell text-right ">
              {/* edit icon */}
              <NavLink
               to={`/admin/editPlace/${place._id}`}
               className="action-link mr-3"
              >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 inline text-blue-500 hover:text-blue-700 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
               </svg>
              </NavLink>
              {/* toggle visibality */}
              <button
               onClick={() => toggleVisibility(place._id)}
               className={`hover: cursor-pointer ${place.visible
                ? ' text-green-700'
                : ' text-red-700'
                }`}>


               {place.visible ? (
                <>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round"
                   d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round"
                   d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                 </svg>
                </>
               ) : (
                <>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round"
                   d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                 </svg>
                </>
               )}
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
      {placeName.trim() === "" && (
       <div className="mt-4 flex gap-4 items-center">
        <button
         onClick={goToPrevious}
         disabled={currentPage === 1}
         className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:cursor-pointer"
        >
         Prev
        </button>
        <span>
         Page {currentPage} of {totalPages}
        </span>
        <button
         onClick={goToNext}
         disabled={currentPage === totalPages}
         className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:cursor-pointer"
        >
         Next
        </button>
       </div>
      )}
     </div>
    </div>
   </main>

  </div>
 )
}

export default AdminCrudPlaces
