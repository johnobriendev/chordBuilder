import React, { useState } from 'react';




function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Guitar Chord Creator</h1>
        </div>
      </header>

      {/* Main content area */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Placeholder for Chord Creator */}
          <section className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Chord</h2>
              <div className="h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chord Creator</p>
              </div>
            </div>
          </section>

          {/* Placeholder for Chord Sheet */}
          <section className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Chord Sheet</h2>
              <div className="h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Chord Sheet</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
 
};

export default App
