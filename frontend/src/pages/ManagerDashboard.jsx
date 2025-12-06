import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const ManagerDashboard = () => {
  const { user, logout } = useAuth()
  const [notices, setNotices] = useState([])
  const [complaints, setComplaints] = useState([])
  const [payments, setPayments] = useState([])
  const [maintenance, setMaintenance] = useState([])
  const [activeTab, setActiveTab] = useState('notices')
  const [showNoticeModal, setShowNoticeModal] = useState(false)
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotices()
    fetchComplaints()
    fetchPayments()
    fetchMaintenance()
  }, [])

  const fetchNotices = async () => {
    try {
      const response = await api.get('/manager/notices')
      setNotices(response.data)
    } catch (err) {
      console.error('Error fetching notices:', err)
    }
  }

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/manager/complaints')
      setComplaints(response.data)
    } catch (err) {
      console.error('Error fetching complaints:', err)
    }
  }

  const fetchPayments = async () => {
    try {
      const response = await api.get('/manager/payments')
      setPayments(response.data)
    } catch (err) {
      console.error('Error fetching payments:', err)
    }
  }

  const fetchMaintenance = async () => {
    try {
      const response = await api.get('/manager/maintenance')
      setMaintenance(response.data)
    } catch (err) {
      console.error('Error fetching maintenance:', err)
    }
  }

  const handleSubmitNotice = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/manager/notices', noticeForm)
      setShowNoticeModal(false)
      setNoticeForm({ title: '', content: '' })
      fetchNotices()
    } catch (err) {
      alert(err.response?.data || 'Error creating notice')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNotice = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await api.delete(`/manager/notices/${id}`)
        fetchNotices()
      } catch (err) {
        alert(err.response?.data || 'Error deleting notice')
      }
    }
  }

  const handleResolveComplaint = async (id) => {
    const resolution = prompt('Enter resolution:')
    if (resolution) {
      try {
        await api.put(`/manager/complaints/${id}/resolve`, null, {
          params: { resolution }
        })
        fetchComplaints()
      } catch (err) {
        alert(err.response?.data || 'Error resolving complaint')
      }
    }
  }

  const handleApprovePayment = async (id) => {
    const remarks = prompt('Enter remarks (optional):') || ''
    try {
      await api.put(`/manager/payments/${id}/approve`, null, {
        params: { remarks }
      })
      fetchPayments()
    } catch (err) {
      alert(err.response?.data || 'Error approving payment')
    }
  }

  const handleRejectPayment = async (id) => {
    const remarks = prompt('Enter rejection reason (optional):') || ''
    try {
      await api.put(`/manager/payments/${id}/reject`, null, {
        params: { remarks }
      })
      fetchPayments()
    } catch (err) {
      alert(err.response?.data || 'Error rejecting payment')
    }
  }

  const handleUpdateMaintenanceStatus = async (id, status) => {
    try {
      await api.put(`/manager/maintenance/${id}/status`, null, {
        params: { status }
      })
      fetchMaintenance()
    } catch (err) {
      alert(err.response?.data || 'Error updating maintenance status')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-800">Manager Dashboard</h1>
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
              Complaints
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'payments'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'maintenance'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Maintenance
            </button>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'notices' && (
            <div>
              <div className="mb-4">
                <button
                  onClick={() => setShowNoticeModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Post Notice
                </button>
              </div>
              {notices.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No notices</p>
              ) : (
                notices.map((notice) => (
                  <div key={notice.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{notice.title}</h3>
                        <p className="text-gray-600 mb-4">{notice.content}</p>
                        <p className="text-sm text-gray-500">
                          Posted on: {new Date(notice.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteNotice(notice.id)}
                        className="ml-4 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'complaints' && (
            <div>
              {complaints.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No complaints</p>
              ) : (
                complaints.map((complaint) => (
                  <div key={complaint.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{complaint.title}</h3>
                        <p className="text-gray-600 mt-2">{complaint.description}</p>
                        {complaint.resolution && (
                          <div className="mt-4 p-3 bg-green-50 rounded">
                            <p className="text-sm font-medium text-green-800">Resolution:</p>
                            <p className="text-green-700">{complaint.resolution}</p>
                          </div>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          From: {complaint.resident?.name} ({complaint.resident?.flatNumber})
                        </p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(complaint.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-center ${
                          complaint.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                          complaint.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {complaint.status}
                        </span>
                        {complaint.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleResolveComplaint(complaint.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div>
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
                          From: {payment.resident?.name} ({payment.resident?.flatNumber})
                        </p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(payment.createdAt).toLocaleString()}
                        </p>
                        {payment.remarks && (
                          <p className="text-sm text-gray-600 mt-2">Remarks: {payment.remarks}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          payment.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                        {payment.status === 'PENDING' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprovePayment(payment.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectPayment(payment.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div>
              {maintenance.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No maintenance records</p>
              ) : (
                maintenance.map((m) => (
                  <div key={m.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-semibold text-gray-800">
                          Amount: ₹{m.amount}
                        </p>
                        {m.description && (
                          <p className="text-gray-600 mt-2">{m.description}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          Resident: {m.resident?.name} ({m.resident?.flatNumber})
                        </p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(m.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          m.status === 'PAID' ? 'bg-green-100 text-green-800' :
                          m.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {m.status}
                        </span>
                        <select
                          value={m.status}
                          onChange={(e) => handleUpdateMaintenanceStatus(m.id, e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="OVERDUE">OVERDUE</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notice Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Post Notice</h2>
            <form onSubmit={handleSubmitNotice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  required
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="6"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Post
                </button>
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
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

export default ManagerDashboard

