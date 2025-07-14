import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import ChildPlace from '../components/ChildPlace'
import axios from 'axios';
import "../css/placesPage.css";

function Places() {
    const [places, setPlaces] = useState([]);
    const [placeLocation, setPlaceLocation] = useState('')
    const [categories, setCategories] = useState([])
    const [activeCategory, setActiveCategory] = useState('All');

    const [sortBy, setSortBy] = useState('');

    const filteredPlaces =
        activeCategory === 'All'
            ? places
            : places.filter(place => place.category === activeCategory);

    const filteredAndSortedPlaces = [...filteredPlaces].sort((a, b) => {
        if (sortBy === 'rating') {
            return b.rating - a.rating;
        }
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        return 0;
    });

    // fetch all places 
    useEffect(() => {
        axios.get("http://localhost:3000/places/suggested")
            .then((res) => setPlaces(res.data.places))
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

    // fetch categories 
    useEffect(() => {
        // const token = sessionStorage.getItem("jwt");

        axios.get(`http://localhost:3000/categories`, {
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzRlZTllNzMzMzE4MTAzYmJkNmUwYyIsImlhdCI6MTc1MjQ5MzgxOSwiZXhwIjoxNzUzMDk4NjE5fQ.jUTXtIpz0-g_Ni4Cl0ceUGSn-B8UPCX2QGf482fekeQ`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => setCategories(res.data.categories))
            .catch((err) => console.error("Error fetching categories:", err))

    }, []);

    return (
        <div>
            <meta charSet="utf-8" />
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            <title>Terhal - Discover Places in Egypt</title>
            <link href="data:image/x-icon;base64," rel="icon" type="image/x-icon" />
            <link href="https://fonts.googleapis.com" rel="preconnect" />
            <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />

            <main className="container mx-auto px-6 py-10">
                {/* breadcrump */}
                <div className="breadcrumbs text-sm text-support mb-4">
                    <ul>
                        <li><Link to='/' className="hover:text-primary-action">Home</Link></li>

                        <li className="text-primary-action font-medium">places</li>
                    </ul>
                </div>

                {/* heading section */}
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-bold text-primary-action font-display">Discover Places in Egypt</h2>
                    <p className="text-lg text-support mt-2">Explore 123 amazing destinations</p>
                </div>

                {/* search section  */}
                <div className=" backdrop-blur-md py-6 rounded-xl shadow-lg mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 items-center">
                        <div className="relative md:col-span-2">
                            <input
                                value={placeLocation}
                                onChange={(e) => setPlaceLocation(e.target.value)}
                                className="form-input w-full pl-10 pr-4 py-3 rounded-lg border-2 border-muted-brown/30 
                                bg-warm-white focus:ring-2 focus:ring-highlight focus:border-highlight transition-shadow"
                                placeholder="Search by location, e.g., 'Cairo'" />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-support">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </div>
                        </div>
                        {/* filter buttons  */}
                        <div className="md:col-span-8 flex justify-between items-center gap-4">
                            {/* {sessionStorage.getItem("jwt") && categoreies && (categoreies.map(category => <NavLink key={category._id}>{category.title}</NavLink>))} */}

                            <button
                                onClick={() => setActiveCategory('All')}
                                className={`px-4 py-2 text-l font-medium rounded-full bg-warm-white
                                     text-primary-action hover:bg-soft-cream transition-colors cursor-pointer 
                                      ${activeCategory === 'All' ? 'active-link' : ''
                                    }`}
                            >
                                All
                            </button>

                            {categories?.map(category => (
                                <button
                                    key={category._id}
                                    onClick={() => setActiveCategory(category.title)}
                                    className={`px-4 py-2 text-l font-medium rounded-full bg-warm-white
                                         text-primary-action hover:bg-soft-cream transition-colors cursor-pointer 
                                         ${activeCategory === category.title ? 'active-link' : ''
                                        }`}
                                >
                                    {category.title}
                                </button>))}
                        </div>
                        <div className="md:col-span-2 flex justify-center items-center gap-4">
                            <div className="flex items-center gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="form-select rounded-lg border-2 border-muted-brown/30 bg-warm-white focus:ring-2 focus:ring-highlight focus:border-highlight transition-shadow py-3"
                                >
                                    <option value="">Sort by</option>
                                    <option value="rating">Rating</option>
                                    <option value="name">Name</option>
                                </select>
                            </div>
                        </div>


                    </div>
                </div>
                {/* places section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredAndSortedPlaces?.length > 0 && (
                        filteredAndSortedPlaces.map(place => (
                            <ChildPlace place={place} key={place._id} />
                        ))
                    )}
                    {filteredAndSortedPlaces.length === 0 && (
                        <p className='text-center'>No places found for this category.</p>
                    )}
                </div>
            </main>

        </div>
    )
}

export default Places
