/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminCrudEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [form, setForm] = useState({ name: '', startTime: '', endTime: '', location: '', address: '', coordinates: '', description: '', category: '', status: '' });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const token = sessionStorage.getItem('jwt');
  const tableRef = React.useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const EVENTS_PER_PAGE = 4;

  // Fetch events for a specific page with limit
  const fetchEvents = (page = 1) => {
    setLoading(true);
    axios.get(`https://backend-mu-ten-26.vercel.app/events?limit=${EVENTS_PER_PAGE}&page=${page}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setEvents(res.data.events || res.data.eventsList || res.data);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(err => console.error('Error fetching events:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  // Open modal for create
  const handleCreate = () => {
    setForm({ name: '', startTime: '', endTime: '', location: '', address: '', coordinates: '', description: '', category: '', status: '' });
    setModalMode('create');
    setShowModal(true);
    setEditId(null);
  };

  // Open modal for edit
  const handleEdit = (event) => {
    setForm({
      name: event.name || '',
      startTime: event.startTime ? new Date(event.startTime).toISOString().slice(0, 16) : '',
      endTime: event.endTime ? new Date(event.endTime).toISOString().slice(0, 16) : '',
      location: event.location || '',
      address: event.address || '',
      coordinates: event.coordinates || '',
      description: event.description || '',
      category: event.category || '',
      status: event.status || '',
    });
    setModalMode('edit');
    setShowModal(true);
    setEditId(event._id);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      startTime: form.startTime ? new Date(form.startTime).toISOString() : '',
      endTime: form.endTime ? new Date(form.endTime).toISOString() : '',
      location: form.location,
      address: form.address,
      coordinates: form.coordinates,
      description: form.description,
      category: form.category,
      status: form.status,
    };
    if (modalMode === 'create') {
      try {
        await axios.post('https://backend-mu-ten-26.vercel.app/events', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setShowModal(false);
        fetchEvents(currentPage); // Fetch the current page after creation
      } catch (err) {
        alert('Failed to create event');
      }
    } else if (modalMode === 'edit' && editId) {
      try {
        await axios.put(`https://backend-mu-ten-26.vercel.app/events/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setShowModal(false);
        fetchEvents(currentPage); // Fetch the current page after update
      } catch (err) {
        alert('Failed to update event');
      }
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`https://backend-mu-ten-26.vercel.app/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents(currentPage); // Fetch the current page after deletion
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  // Utility to render status badge
  const renderStatusBadge = (status) => {
    let style = '';
    let text = '';
    switch ((status || '').toLowerCase()) {
      case 'active':
        style = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 gap-1';
        text = (<><span className='h-2 w-2 rounded-full bg-green-500 inline-block'></span>Active</>);
        break;
      case 'upcoming':
        style = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 gap-1';
        text = (<><span className='h-2 w-2 rounded-full bg-yellow-400 inline-block'></span>Upcoming</>);
        break;
      case 'past':
        style = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 gap-1';
        text = (<><span className='h-2 w-2 rounded-full bg-gray-400 inline-block'></span>Past</>);
        break;
      case 'cancelled':
        style = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 gap-1';
        text = (<><span className='h-2 w-2 rounded-full bg-red-500 inline-block'></span>Cancelled</>);
        break;
      default:
        style = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700 gap-1';
        text = status;
    }
    return <span className={style}>{text}</span>;
  };

  // Filtered events by search (client-side search)
  // Search bar style changed to white in the render below
  const filteredEvents = events.filter(event =>
    (event.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // Scroll to table when events change
  React.useEffect(() => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [events]);

  return (
    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 bg-[#f6e5c6] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Manage Events</h1>
          <button onClick={handleCreate} className="flex items-center gap-2 rounded-xl px-6 py-3 bg-red-700 text-white font-semibold shadow-lg hover:bg-red-800 transition-all text-lg">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" fillRule="evenodd" /></svg>
            Create Event
          </button>
        </div>
        {/* Search bar */}
        <div className="mb-6 flex justify-end">
          <input
            type="text"
            placeholder="Search events..."
            className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto" ref={tableRef}>
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl shadow-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8">Loading...</td></tr>
              ) : filteredEvents.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8">No events found.</td></tr>
              ) : (
                filteredEvents.map(event => (
                  <tr key={event._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.startTime ? new Date(event.startTime).toLocaleString() : ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{renderStatusBadge(event.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex gap-2">
                      <button onClick={() => handleEdit(event)} className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-200" title="Edit Event">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(event._id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200" title="Delete Event">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6 8a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm2-1a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V5a1 1 0 00-1-1H6z" clipRule="evenodd" /></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal for create/edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{modalMode === 'create' ? 'Create Event' : 'Edit Event'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Title</label>
                <input type="text" className="w-full border px-3 py-2 rounded" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea className="w-full border px-3 py-2 rounded" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Date & Time (Start)</label>
                <input type="datetime-local" className="w-full border px-3 py-2 rounded" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Date & Time (End)</label>
                <input type="datetime-local" className="w-full border px-3 py-2 rounded" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Location</label>
                <input type="text" className="w-full border px-3 py-2 rounded" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Address</label>
                <input type="text" className="w-full border px-3 py-2 rounded" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Coordinates</label>
                <input type="text" className="w-full border px-3 py-2 rounded" value={form.coordinates} onChange={e => setForm({ ...form, coordinates: e.target.value })} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Category</label>
                <select className="w-full border px-3 py-2 rounded" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select category</option>
                  <option value="tech">Tech</option>
                  <option value="music">Music</option>
                  <option value="arts">Arts & Culture</option>
                  <option value="gaming">Gaming</option>
                  <option value="sports">Sports</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select className="w-full border px-3 py-2 rounded" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} required>
                  <option value="">Select status</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex gap-4 justify-end mt-6">
                <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="px-6 py-2 rounded bg-red-700 text-white font-semibold hover:bg-red-800">{modalMode === 'create' ? 'Create' : 'Update'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Pagination controls for server-side pagination */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-0.5 rounded-xl border bg-white shadow-sm overflow-hidden">
          <button
            className={`w-10 h-10 flex items-center justify-center text-xl transition-colors duration-150 ${currentPage === 1 ? 'bg-[#fcf6ea] text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`w-12 h-10 flex items-center justify-center text-base font-semibold border-l border-gray-200 transition-colors duration-150 ${currentPage === i + 1 ? 'bg-[#f6e5c6] text-gray-900 border-green-700' : 'bg-white text-gray-700 hover:bg-[#fcf6ea]'}`}
              onClick={() => setCurrentPage(i + 1)}
              disabled={currentPage === i + 1}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={`w-10 h-10 flex items-center justify-center text-xl transition-colors duration-150 ${currentPage === totalPages ? 'bg-[#fcf6ea] text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>
    </main>
  );
}

export default AdminCrudEvents; 