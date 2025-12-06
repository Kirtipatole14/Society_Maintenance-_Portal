import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const ResidentDashboard = () => {
  const { user, logout } = useAuth()
  const [notices, setNotices] = useState([])
  const [complaints, setComplaints] = useState([])
  const [payments, setPayments] = useState([])
  const [activeTab, setActiveTab] = useState('notices')
  const [showComplaintModal, setShowComplaintModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [complaintForm, setComplaintForm] = useState({ title: '', description: '' })
  const [paymentAmount, setPaymentAmount] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotices()
    fetchComplaints()
    fetchPayments()
  }, [])

  const fetchNotices = async () => {
    try {
      const response = await api.get('/resident/notices')
      setNotices(response.data)
    } catch (err) {
      console.error('Error fetching notices:', err)
    }
  }

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/resident/complaints')
      setComplaints(response.data)
    } catch (err) {
      console.error('Error fetching complaints:', err)
    }
  }

  const fetchPayments = async () => {
    try {
      const response = await api.get('/resident/payments')
      setPayments(response.data)
    } catch (err) {
      console.error('Error fetching payments:', err)
    }
  }

  const handleSubmitComplaint = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/resident/complaints', complaintForm)
      setShowComplaintModal(false)
      setComplaintForm({ title: '', description: '' })
      fetchComplaints()
    } catch (err) {
      alert(err.response?.data || 'Error creating complaint')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitPayment = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/resident/payments', null, {
        params: { amount: paymentAmount }
      })
      setShowPaymentModal(false)
      setPaymentAmount('')
      fetchPayments()
    } catch (err) {
      alert(err.response?.data || 'Error creating payment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-800">Resident Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">Welcome, {user?.username}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('notices')}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'notices'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Notices
            </button>
            <button
              onClick={() => setActiveTab('complaints')}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'complaints'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              My Complaints
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'payments'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              My Payments
            </button>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'notices' && (
            <div>
              {notices.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No notices available</p>
              ) : (
                notices.map((notice) => (
                  <div key={notice.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{notice.title}</h3>
                    <p className="text-gray-600 mb-4">{notice.content}</p>
                    <p className="text-sm text-gray-500">
                      Posted on: {new Date(notice.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'complaints' && (
            <div>
              <div className="mb-4">
                <button
                  onClick={() => setShowComplaintModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Raise Complaint
                </button>
              </div>
              {complaints.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No complaints</p>
              ) : (
                complaints.map((complaint) => (
                  <div key={complaint.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{complaint.title}</h3>
                        <p className="text-gray-600 mt-2">{complaint.description}</p>
                        {complaint.resolution && (
                          <div className="mt-4 p-3 bg-green-50 rounded">
                            <p className="text-sm font-medium text-green-800">Resolution:</p>
                            <p className="text-green-700">{complaint.resolution}</p>
                          </div>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          Created: {new Date(complaint.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                        complaint.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div>
              <div className="mb-4">
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Pay Maintenance
                </button>
              </div>
              {payments.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No payments</p>
              ) : (
                payments.map((payment) => (
                  <div key={payment.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-semibold text-gray-800">
                          Amount: ₹{payment.amount}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Created: {new Date(payment.createdAt).toLocaleString()}
                        </p>
                        {payment.remarks && (
                          <p className="text-sm text-gray-600 mt-2">Remarks: {payment.remarks}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        payment.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Raise Complaint</h2>
            <form onSubmit={handleSubmitComplaint} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={complaintForm.title}
                  onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Pay Maintenance</h2>
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResidentDashboard

