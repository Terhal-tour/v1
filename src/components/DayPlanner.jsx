import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCar, FaBus, FaWalking, FaBicycle, FaTaxi, FaTrash, FaPlus, FaRegClock, FaMapMarkerAlt, FaSyncAlt, FaSave, FaCheckCircle } from "react-icons/fa";

const TRANSPORT_OPTIONS = [
  { label: "Walk", icon: <FaWalking className="inline mr-1" /> },
  { label: "Car", icon: <FaCar className="inline mr-1" /> },
  { label: "Bus", icon: <FaBus className="inline mr-1" /> },
  { label: "Bike", icon: <FaBicycle className="inline mr-1" /> },
  { label: "Taxi", icon: <FaTaxi className="inline mr-1" /> },
  { label: "Other", icon: <FaRegClock className="inline mr-1" /> },
];

const LOCAL_STORAGE_KEY = "multi_day_travel_plans";
const PLACES_CACHE_KEY = "cached_places";

const DayPlanner = () => {
  const [places, setPlaces] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [visitTime, setVisitTime] = useState("");
  const [transport, setTransport] = useState(TRANSPORT_OPTIONS[0].label);
  const [showForm, setShowForm] = useState(false);
  const [plans, setPlans] = useState([]);
  const [currentPlanIdx, setCurrentPlanIdx] = useState(0);
  const [newPlanName, setNewPlanName] = useState("");
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
  const [deleteConfirmIdx, setDeleteConfirmIdx] = useState(null);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Custom tasks state for input
  const [customTaskInput, setCustomTaskInput] = useState("");
  const [customTaskTime, setCustomTaskTime] = useState("");

  // Helper: clear places cache (for dev)
  const clearPlacesCache = () => {
    localStorage.removeItem(PLACES_CACHE_KEY);
    window.location.reload();
  };

  // Load places from cache or backend
  useEffect(() => {
    const loadPlaces = async () => {
      setLoadingPlaces(true);
      // Try localStorage first
      const cached = localStorage.getItem(PLACES_CACHE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setPlaces(parsed);
          const uniqueGovs = [
            ...new Set(parsed.map((p) => p.address).filter(Boolean)),
          ];
          setGovernorates(uniqueGovs);
          setLoadingPlaces(false);
        } catch {
          // ignore parse error, fallback to fetch
        }
      }
      // Always update in background
      let allPlaces = [];
      let page = 1;
      let hasMore = true;
      while (hasMore) {
        const res = await axios.get(
          `https://terhal-backend-6jk2.vercel.app/places?page=${page}`
        );
        if (res.data.data && res.data.data.length > 0) {
          allPlaces = allPlaces.concat(res.data.data);
          page++;
        } else {
          hasMore = false;
        }
      }
      setPlaces(allPlaces);
      localStorage.setItem(PLACES_CACHE_KEY, JSON.stringify(allPlaces));
      const uniqueGovs = [
        ...new Set(allPlaces.map((p) => p.address).filter(Boolean)),
      ];
      setGovernorates(uniqueGovs);
      setLoadingPlaces(false);
    };
    loadPlaces();
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) setPlans(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (selectedGovernorate) {
      setFilteredPlaces(
        places.filter((p) => p.address === selectedGovernorate)
      );
    } else {
      setFilteredPlaces([]);
    }
    setSelectedPlace("");
  }, [selectedGovernorate, places]);

  // Mark as unsaved on any plan change
  useEffect(() => {
    setUnsaved(true);
    setSaveMsg("");
  }, [plans]);

  const handleAddPlace = (e) => {
    e.preventDefault();
    if (!selectedPlace || !visitTime || plans.length === 0) return;
    const placeObj = filteredPlaces.find((p) => p._id === selectedPlace);
    const updatedPlans = plans.map((plan, idx) =>
      idx === currentPlanIdx
        ? {
            ...plan,
            places: [
              ...plan.places,
              {
                ...placeObj,
                visitTime,
                transport,
                planId: Date.now() + Math.random(),
              },
            ],
          }
        : plan
    );
    setPlans(updatedPlans);
    setSelectedPlace("");
    setVisitTime("");
    setTransport(TRANSPORT_OPTIONS[0].label);
    setSelectedGovernorate("");
    setShowForm(false);
  };

  const handleRemove = (planId) => {
    const updatedPlans = plans.map((plan, idx) =>
      idx === currentPlanIdx
        ? {
            ...plan,
            places: plan.places.filter((item) => item.planId !== planId),
          }
        : plan
    );
    setPlans(updatedPlans);
  };

  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!newPlanName.trim()) return;
    setPlans([
      ...plans,
      { name: newPlanName.trim(), places: [] },
    ]);
    setCurrentPlanIdx(plans.length);
    setNewPlanName("");
    setShowNewPlanForm(false);
  };

  const handleDeletePlan = (idx) => {
    const updated = plans.filter((_, i) => i !== idx);
    setPlans(updated);
    if (currentPlanIdx >= updated.length) {
      setCurrentPlanIdx(Math.max(0, updated.length - 1));
    }
    setDeleteConfirmIdx(null);
  };

  const handleCancel = () => {
    setSelectedPlace("");
    setVisitTime("");
    setTransport(TRANSPORT_OPTIONS[0].label);
    setSelectedGovernorate("");
    setShowForm(false);
  };

  // Add custom task to current plan
  const handleAddCustomTask = (e) => {
    e.preventDefault();
    if (!customTaskInput.trim() || plans.length === 0) return;
    const updatedPlans = plans.map((plan, idx) =>
      idx === currentPlanIdx
        ? {
            ...plan,
            customTasks: [
              ...(plan.customTasks || []),
              {
                text: customTaskInput.trim(),
                time: customTaskTime,
                id: Date.now() + Math.random(),
              },
            ],
          }
        : plan
    );
    setPlans(updatedPlans);
    setCustomTaskInput("");
    setCustomTaskTime("");
  };

  // Remove custom task from current plan
  const handleRemoveCustomTask = (taskId) => {
    const updatedPlans = plans.map((plan, idx) =>
      idx === currentPlanIdx
        ? {
            ...plan,
            customTasks: (plan.customTasks || []).filter((t) => t.id !== taskId),
          }
        : plan
    );
    setPlans(updatedPlans);
  };

  // Save plans to localStorage (include customTasks)
  const handleSavePlans = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(plans));
    setUnsaved(false);
    setSaveMsg("Plan saved!");
    setTimeout(() => setSaveMsg(""), 2000);
  };

  // Helper for transport icon
  const getTransportIcon = (label) => {
    const found = TRANSPORT_OPTIONS.find((t) => t.label === label);
    return found ? found.icon : null;
  };

  // Modal for delete confirmation
  const DeleteModal = ({ show, onConfirm, onCancel, planName }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full text-center animate-fade-in">
          <div className="text-2xl text-orange-600 font-bold mb-4">Delete Plan</div>
          <div className="mb-6 text-gray-700">
            Are you sure you want to delete <span className="font-semibold">{planName}</span>?
          </div>
          <div className="flex justify-center gap-4">
            <button
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 font-semibold shadow"
              onClick={onConfirm}
            >
              Yes, Delete
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 font-semibold shadow"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 max-w-4xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-extrabold mb-8 text-orange-500 text-center tracking-tight drop-shadow">
        Day Traveler Planner
      </h2>
      {/* Plan Tabs */}
      <div className="flex flex-wrap gap-3 items-center justify-center mb-8">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`flex items-center px-5 py-2 rounded-full shadow cursor-pointer transition-all border-2 ${
              idx === currentPlanIdx
                ? "bg-orange-100 border-orange-500 text-orange-700 font-bold scale-105"
                : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-orange-50"
            }`}
            onClick={() => setCurrentPlanIdx(idx)}
          >
            <span className="truncate max-w-[100px]">{plan.name}</span>
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              title="Delete Plan"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteConfirmIdx(idx);
              }}
            >
              <FaTrash />
            </button>
          </div>
        ))}
        <button
          className="flex items-center gap-1 bg-orange-500 text-white px-4 py-2 rounded-full shadow hover:bg-orange-600 font-semibold text-base transition-all"
          onClick={() => setShowNewPlanForm(true)}
        >
          <FaPlus /> New Day Plan
        </button>
        {/* Dev: Clear places cache */}
        {/* <button className="ml-2 text-xs text-gray-400 hover:text-red-500" onClick={clearPlacesCache} title="Clear places cache (dev)"><FaSyncAlt /> Clear Cache</button> */}
      </div>
      {/* Delete Plan Modal */}
      <DeleteModal
        show={deleteConfirmIdx !== null}
        planName={deleteConfirmIdx !== null && plans[deleteConfirmIdx] ? plans[deleteConfirmIdx].name : ""}
        onConfirm={() => handleDeletePlan(deleteConfirmIdx)}
        onCancel={() => setDeleteConfirmIdx(null)}
      />
      {/* New plan form */}
      {showNewPlanForm && (
        <form
          className="flex gap-4 justify-center mb-8 animate-fade-in"
          onSubmit={handleCreatePlan}
        >
          <input
            className="border p-2 rounded shadow"
            placeholder="Plan name (e.g. Day 1)"
            value={newPlanName}
            onChange={(e) => setNewPlanName(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 shadow"
          >
            Create
          </button>
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 shadow"
            onClick={() => setShowNewPlanForm(false)}
          >
            Cancel
          </button>
        </form>
      )}
      {/* Loading spinner for places */}
      {loadingPlaces && (
        <div className="flex justify-center items-center my-8">
          <svg className="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span className="ml-3 text-orange-500 font-semibold">Loading places...</span>
        </div>
      )}
      {plans.length > 0 && !showForm && !loadingPlaces && (
        <div className="flex flex-col items-center mb-8 gap-8 w-full">
          <button
            className="flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-orange-600 font-bold text-lg transition-all animate-fade-in"
            onClick={() => setShowForm(true)}
          >
            <FaPlus className="text-xl" /> Add Place
          </button>
          {/* Custom Task Input */}
          <form
            className="flex flex-col sm:flex-row gap-2 items-center w-full max-w-2xl bg-white p-5 rounded-2xl shadow-lg border border-orange-100"
            onSubmit={handleAddCustomTask}
            style={{ boxShadow: '0 4px 24px 0 rgba(255, 140, 0, 0.07)' }}
          >
            <input
              type="text"
              className="border border-orange-200 p-3 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-orange-300 text-base transition-all shadow-sm"
              placeholder="Add a custom to-do (e.g., Go to restaurant)"
              value={customTaskInput}
              onChange={(e) => setCustomTaskInput(e.target.value)}
              required
            />
            <input
              type="time"
              className="border border-orange-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300 text-base transition-all shadow-sm"
              value={customTaskTime}
              onChange={(e) => setCustomTaskTime(e.target.value)}
              required
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 font-bold text-base shadow-lg transition-all"
              style={{ minWidth: '100px' }}
            >
              <FaPlus /> Add
            </button>
          </form>
          {/* Divider */}
          <div className="w-full max-w-2xl border-t border-orange-100 mt-2"></div>
        </div>
      )}
      {plans.length > 0 && showForm && !loadingPlaces && (
        <form
          className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 mb-8 shadow-lg flex flex-col gap-4 animate-fade-in"
          onSubmit={handleAddPlace}
        >
          <div>
            <label className="block font-semibold mb-1 text-orange-700">Pick a Governorate</label>
            <select
              className="w-full border p-2 rounded shadow"
              value={selectedGovernorate}
              onChange={(e) => setSelectedGovernorate(e.target.value)}
              required
            >
              <option value="">-- Select Governorate --</option>
              {governorates.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          {selectedGovernorate && (
            <div>
              <label className="block font-semibold mb-1 text-orange-700">Pick a Place</label>
              <select
                className="w-full border p-2 rounded shadow"
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
                required
              >
                <option value="">-- Select Place --</option>
                {filteredPlaces.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {selectedPlace && (
            <div className="flex gap-4 flex-wrap">
              <div>
                <label className="block font-semibold mb-1 text-orange-700">Time</label>
                <input
                  type="time"
                  className="border p-2 rounded shadow"
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-orange-700">Transport</label>
                <select
                  className="border p-2 rounded shadow"
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                >
                  {TRANSPORT_OPTIONS.map((t) => (
                    <option key={t.label} value={t.label}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <div className="flex gap-4 mt-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 shadow font-semibold"
            >
              Add to Plan
            </button>
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-400 shadow font-semibold"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {/* Plan Preview */}
      {plans.length > 0 && plans[currentPlanIdx] && (plans[currentPlanIdx].places.length > 0 || (plans[currentPlanIdx].customTasks && plans[currentPlanIdx].customTasks.length > 0)) && (
        <div className="mb-6 animate-fade-in">
          <h3 className="text-2xl font-bold mb-4 text-orange-600 flex items-center gap-2">
            <FaMapMarkerAlt /> {plans[currentPlanIdx].name} - Plan
          </h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Places */}
            {plans[currentPlanIdx].places.map((item, idx) => (
              <div
                key={item.planId}
                className="bg-white rounded-2xl shadow-lg flex gap-4 p-4 items-center hover:shadow-2xl transition-all group relative border-t-4 border-orange-200"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl border-2 border-orange-100 group-hover:scale-105 transition-transform"
                  title={item.name}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-lg text-gray-800 truncate" title={item.name}>
                    {idx + 1}. {item.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate" title={item.address || item.location}>
                    {item.address || item.location}
                  </div>
                  <div className="text-xs mt-1 flex items-center gap-2 text-gray-600">
                    <FaRegClock className="inline" />
                    <span className="font-medium">Time:</span> {item.visitTime}
                    <span className="ml-2 font-medium flex items-center">
                      {getTransportIcon(item.transport)} {item.transport}
                    </span>
                  </div>
                </div>
                <button
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-full p-2 shadow-sm transition-all"
                  title="Remove from plan"
                  onClick={() => handleRemove(item.planId)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            {/* Custom Tasks */}
            {plans[currentPlanIdx].customTasks && plans[currentPlanIdx].customTasks.map((task, idx) => (
              <div
                key={task.id}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg flex gap-4 p-5 items-center hover:shadow-xl transition-all group relative border-t-4 border-blue-200"
                style={{ minHeight: '80px' }}
              >
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="font-bold text-base sm:text-lg text-blue-900 truncate flex items-center gap-2" title={task.text}>
                    <span className="mr-2 text-2xl">🗒️</span>{task.text}
                  </div>
                  {task.time && (
                    <div className="text-xs mt-2 flex items-center gap-2 text-blue-700 font-semibold">
                      <FaRegClock className="inline" />
                      <span>Time:</span> {task.time}
                    </div>
                  )}
                </div>
                <button
                  className="absolute top-2 right-2 text-red-500 hover:text-white hover:bg-red-500 bg-white rounded-full p-2 shadow-sm transition-all border border-red-100"
                  title="Remove task"
                  onClick={() => handleRemoveCustomTask(task.id)}
                  style={{ transition: 'all 0.2s' }}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          {/* Empty state if no items */}
          {plans[currentPlanIdx].places.length === 0 && (!plans[currentPlanIdx].customTasks || plans[currentPlanIdx].customTasks.length === 0) && (
            <div className="text-center text-gray-400 py-8">No places or custom tasks added yet. Start planning your day!</div>
          )}
          {/* Save Plan Button */}
          <div className="flex items-center gap-4 mt-6">
            <button
              className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold shadow transition-all text-white ${unsaved ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
              onClick={handleSavePlans}
              disabled={!unsaved}
            >
              <FaSave /> Save Plan
            </button>
            {saveMsg && (
              <span className="flex items-center gap-1 text-green-600 font-semibold animate-fade-in">
                <FaCheckCircle /> {saveMsg}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DayPlanner; 