import React, { useEffect, useState } from "react";
import StudentSidebar from "../../components/layout/StudentSidebar";
import { getFees } from "../../services/feeService";
import Badge from "../../components/Badge";

export default function MyFees() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFees()
      .then(setFees)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Calculate fee statistics
  const totalAmount = fees.reduce((sum, f) => sum + (f.amount || 0), 0);
  const totalPaid = fees.reduce((sum, f) => sum + (f.paid || 0), 0);
  const totalDue = totalAmount - totalPaid;
  const paidPercent =
    totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudentSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Fees</h1>
            <p className="text-gray-600">
              Review your fee history and payment status.
            </p>
          </div>

          {/* Fee Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100">
              <p className="text-gray-600 text-sm">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                Rs. {totalAmount.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-md border border-green-200">
              <p className="text-gray-600 text-sm">Total Paid</p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                Rs. {totalPaid.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-1">{paidPercent}% Paid</p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-100 p-6 shadow-md border border-red-200">
              <p className="text-gray-600 text-sm">Outstanding</p>
              <p className="text-3xl font-bold text-red-900 mt-2">
                Rs. {totalDue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-1">Amount due</p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-md border border-blue-200">
              <p className="text-gray-600 text-sm">Payment Status</p>
              <p
                className={`text-3xl font-bold mt-2 ${
                  totalDue === 0 ? "text-green-900" : "text-orange-900"
                }`}
              >
                {totalDue === 0 ? "✅ Paid" : "⏳ Due"}
              </p>
              <p className="text-xs text-gray-600 mt-1">Current status</p>
            </div>
          </div>

          {/* Payment Progress */}
          {totalAmount > 0 && (
            <div className="rounded-xl bg-white p-6 shadow-md border border-gray-100 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Payment Progress
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Overall Payment</span>
                  <span className="font-semibold text-gray-900">
                    {paidPercent}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600"
                    style={{ width: `${Math.min(paidPercent, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Fee Records Table */}
          <div className="rounded-xl bg-white shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Fee Records</h2>
            </div>
            {loading ? (
              <div className="p-6 text-center text-gray-600">
                Loading fee records...
              </div>
            ) : fees.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Month
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Paid
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Due
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {fees.map((fee, index) => (
                      <tr key={fee.id || index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {fee.month || "Month"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          Rs. {(fee.amount || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          Rs. {(fee.paid || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          Rs.{" "}
                          {(
                            (fee.amount || 0) - (fee.paid || 0)
                          ).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Badge status={fee.status || "due"} />
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {fee.status === "paid" ? (
                            <button className="text-primary-600 hover:text-primary-700 font-medium">
                              Download Receipt
                            </button>
                          ) : (
                            <button className="text-primary-600 hover:text-primary-700 font-medium">
                              Pay Now
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p className="mb-2">No fee records found.</p>
                <p className="text-sm">
                  Your fee information will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
