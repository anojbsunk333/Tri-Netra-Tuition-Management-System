import React from "react";
import Sidebar from "../../components/layout/Sidebar";

export default function Fees() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto rounded-2xl bg-white p-8 shadow-lg border-2 border-primary-200">
          <h1 className="text-3xl font-bold text-primary-900">Fees</h1>
          <p className="text-gray-600 mt-2">
            Track fee payments, dues, and invoices.
          </p>
        </div>
      </main>
    </div>
  );
}
