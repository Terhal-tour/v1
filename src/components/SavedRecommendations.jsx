import React, { useState } from 'react';
import { MapPin, Clock, Heart, Trash2 } from 'lucide-react';

export default function SavedRecommendations() {
  // Using React state instead of localStorage for demonstration
  const data=localStorage.getItem("savedRecommendations");
    const parsedData = data ? JSON.parse(data) : [];
  const [saved, setSaved] = useState(parsedData);

  const removeRecommendation = (timeToRemove) => {
    setSaved(prev => prev.filter(item => item.time !== timeToRemove));
  };

  const formatDate = (timeString) => {
    return new Date(timeString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Historical Sites': 'bg-amber-100 text-amber-800 border-amber-200',
      'Restaurants': 'bg-rose-100 text-rose-800 border-rose-200',
      'Experiences': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Tours': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (saved.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <Heart className="text-red-500" size={32} />
            Saved Recommendations
          </h1>
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Heart className="mx-auto mb-4 text-gray-300" size={64} />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">No saved recommendations yet</h2>
            <p className="text-gray-500">Start exploring and save your favorite recommendations!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Heart className="text-red-500" size={32} />
            Saved Recommendations
          </h1>
          <p className="text-gray-600">Your curated collection of travel gems</p>
          <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
            <span className="text-sm font-medium text-gray-700">{saved.length} recommendation{saved.length !== 1 ? 's' : ''} saved</span>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="space-y-4">
          {saved.map((item, index) => (
            <div 
              key={item.time} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-white">
                    <MapPin size={16} />
                    <span className="font-medium text-sm">{item.location}</span>
                  </div>
                  <button
                    onClick={() => removeRecommendation(item.time)}
                    className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                    title="Remove recommendation"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                  {item.recommendation}
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Clock size={14} />
                    <span>Saved {formatDate(item.time)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="text-red-500 fill-current" size={16} />
                    <span className="text-sm text-gray-500">Saved</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg px-6 py-4 inline-block">
            <p className="text-gray-600 text-sm">
              Keep exploring and saving more amazing recommendations! 🌟
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}