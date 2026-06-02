import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { getFees } from "../../services/feeService";

export default function Fees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFees() {
      try {
        setLoading(true);
        const data = await getFees();
        setFees(data);
      } catch (err) {
        setError("Unable to load fee records.");
      } finally {
        setLoading(false);
      }
    }
    loadFees();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-primary-200">
            <h1 className="text-3xl font-bold text-primary-900">Fees</h1>
            <p className="text-gray-600 mt-2">
              Review student fee status and payment records.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg border border-gray-200">
            {loading ? (
              <p className="text-sm text-gray-500">Loading fee data...</p>
            ) : error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Student
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Month
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Paid
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {fees.map((fee) => (
                      <tr key={fee.id}>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {fee.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {fee.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {fee.month}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Rs. {fee.amount}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          Rs. {fee.paid}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold capitalize text-gray-900">
                          {fee.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
