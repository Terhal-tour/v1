import React, { useEffect, useState } from 'react'
import "../../css/adminCrudPlacesPage.css";
import axios from 'axios';
import { NavLink } from 'react-router-dom';


function AdminCrudPlaces() {
    const token = sessionStorage.getItem("jwt");

    const [places, setPlaces] = useState([]);
    const [placeLocation, setPlaceLocation] = useState('')

    const placesPerPage = 5;
    const totalPlaces = places.length;
    const totalPages = Math.ceil(totalPlaces / placesPerPage);
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastPlace = currentPage * placesPerPage;
    const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
    const paginatedPlaces = places.slice(indexOfFirstPlace, indexOfLastPlace);


    //     async function getAllPlaces() {
    //         let page = 1;
    //         let allPlaces = [];
    //         let hasMore = true;

    //         while (hasMore) {
    //             const res = await axios.get(`http://localhost:3000/places`, {
    //                 params: {
    //                     page: page,
    //                     limit: 5 
    //                 }
    //             });

    //             const places = res.data.data;
    //             allPlaces.push(...places);

    //             // If we reach the last page, stop
    //             hasMore = page < res.data.totalPages;
    //             page++;
    //         }

    //         console.log(`Fetched ${allPlaces.length} places`);
    //         return allPlaces;
    //     }




    //     useEffect(() => {
    //     getAllPlaces()
    //       .then((allPlaces) => {
    //         console.log(allPlaces);
    //         setPlaces(allPlaces);
    //       })
    //       .catch((err) => console.error("Error fetching places:", err));
    //   }, []);

    // fetch all places 
    useEffect(() => {
        axios.get("http://localhost:3000/places")
            .then((res) => {
                // console.log(res.data.data);
                setPlaces(res.data.data)
            })
            .catch((err) => console.error("Error fetching places:", err))

    }, []);
    // fetch place depend on search
    useEffect(() => {
        const fetchplace = () => {
            axios.get(`http://localhost:3000/places/search?q=${placeLocation}`)
                .then((res) => setPlaces(res.data))
                .catch((err) => console.error("Error fetching searched places:", err))
        }
        if (placeLocation !== '') {
            console.log(placeLocation);
            fetchplace()
        }
    }, [placeLocation]);

    // renderPageNumbers
    const renderPageNumbers = () => {
        const pageNumbers = [];

        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <a
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`${i === currentPage
                        ? "z-10 bg-[var(--sand-accent)] border-[var(--oasis-green)] text-[var(--oasis-green)]"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        } relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
                    href="#"
                >
                    {i}
                </a>
            );
        }

        return pageNumbers;
    };
    // goToPrevious
    const goToPrevious = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };
    // goToNext 
    const goToNext = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    // ✅ Toggle visibility for a place
    const toggleVisibility = async (placeId) => {
        try {
            const res = await axios.put(
                `http://localhost:3000/admin/place/${placeId}/visibility`,
                {}, // ✅ empty body if not needed
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updated = res.data;
            setPlaces((prev) =>
                prev.map((p) =>
                    p._id === placeId ? { ...p, visible: !p.visible } : p
                )
            );
        } catch (err) {
            console.error('Error toggling visibility:', err);
        }
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
                                    placeholder="Search places..."
                                    type="text"
                                    value={placeLocation}
                                    onChange={(e) => {
                                        setPlaceLocation(e.target.value);
                                        setCurrentPage(1); // resets pagination when searching
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
                                                <th className="px-6 py-3 text-left" scope="col">
                                                    <input className="h-4 w-4 text-[var(--oasis-green)] border-gray-300 rounded focus:ring-[var(--oasis-green)]" type="checkbox" />
                                                </th>
                                                <th className="table-header-cell" scope="col">Name</th>
                                                <th className="table-header-cell" scope="col">Category</th>
                                                <th className="table-header-cell" scope="col">Rating</th>
                                                <th className="table-header-cell" scope="col">Description</th>
                                                <th className="table-header-cell" scope="col">Address</th>
                                                {/* <th className="table-header-cell" scope="col">Location</th> */}
                                                {/* <th className="table-header-cell" scope="col">Coordinates</th> */}
                                                {/* <th className="table-header-cell" scope="col">Image</th> */}
                                                {/* <th className="table-header-cell" scope="col">Visibale</th> */}
                                                {/* <th className="table-header-cell" scope="col">Last Updated</th> */}
                                                <th className="relative px-6 py-3" scope="col"><span className="sr-only">Actions</span></th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {paginatedPlaces && paginatedPlaces.map(place => (
                                                <tr className="hover:bg-gray-50 transition-colors" key={place._id}>
                                                    <td className="px-6 py-4"><input className="h-4 w-4 text-[var(--oasis-green)] border-gray-300 rounded focus:ring-[var(--oasis-green)]" type="checkbox" /></td>
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
                                                    <td className="table-body-cell">{place.description.split(' ').slice(0, 4).join(' ')}{place.description.split(' ').length > 4 ? '...' : ''}</td>
                                                    <td className="table-body-cell">{place.address.split(' ').slice(0, 4).join(' ')}{place.address.split(' ').length > 4 ? '...' : ''}</td>
                                                    {/* <td className="table-body-cell">{place.location}</td> */}
                                                    {/* <td className="table-body-cell">{place.coordinates}</td> */}
                                                    {/* <td className="table-body-cell">{place.image}</td> */}
                                                    {/* <td className="table-body-cell">{place.visible}</td> */}

                                                    {/* <td className="table-body-cell">{place.updatedAt}</td> */}
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
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-gray-600">
                                Showing <span className="font-medium">{indexOfFirstPlace + 1}</span>
                                {" "}to <span className="font-medium">
                                    {Math.min(indexOfLastPlace, totalPlaces)}
                                </span> of <span className="font-medium">{totalPlaces}</span> results
                            </p>                            <nav aria-label="Pagination" className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <button
                                    onClick={goToPrevious}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path clipRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" fillRule="evenodd" />
                                    </svg>
                                </button>

                                {renderPageNumbers()}

                                <button
                                    onClick={goToNext}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path clipRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" fillRule="evenodd" />
                                    </svg>

                                </button>

                            </nav>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    )
}

export default AdminCrudPlaces
