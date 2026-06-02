import React, { useEffect, useState } from "react";
import { getFees } from "../../services/feeService";

export default function MyFees() {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    getFees().then(setFees).catch(console.error);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Fees</h1>
      <p className="text-sm text-gray-600">
        Review your fee history and payment status.
      </p>
      <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
        <table className="min-w-full text-left divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Month
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Paid
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Due
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fees.map((fee) => (
              <tr key={fee.id}>
                <td className="px-4 py-3 text-sm text-gray-600">{fee.month}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {fee.amount}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{fee.paid}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{fee.due}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {fee.status}
                </td>
              </tr>
            ))}
            {fees.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No fee records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
