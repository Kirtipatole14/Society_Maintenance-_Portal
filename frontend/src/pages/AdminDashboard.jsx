import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const [pendingUsers, setPendingUsers] = useState([])
  const [residents, setResidents] = useState([])
  const [managers, setManagers] = useState([])
  const [activeTab, setActiveTab] = useState('pending')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPendingUsers()
    fetchResidents()
    fetchManagers()
  }, [])

  const fetchPendingUsers = async () => {
    try {
      const response = await api.get('/admin/pending-users')
      setPendingUsers(response.data)
    } catch (err) {
      console.error('Error fetching pending users:', err)
    }
  }

  const fetchResidents = async () => {
    try {
      const response = await api.get('/admin/residents')
      setResidents(response.data)
    } catch (err) {
      console.error('Error fetching residents:', err)
    }
  }

  const fetchManagers = async () => {
    try {
      const response = await api.get('/admin/managers')
      setManagers(response.data)
    } catch (err) {
      console.error('Error fetching managers:', err)
    }
  }

  const handleVerifyUser = async (userId, status) => {
    setLoading(true)
    try {
      await api.put(`/admin/verify-user/${userId}?status=${status}`)
      fetchPendingUsers()
      fetchResidents()
      fetchManagers()
    } catch (err) {
      alert(err.response?.data || 'Error verifying user')
    } finally {
      setLoading(false)
    }
  }

  const renderUserCard = (user) => (
    <div key={user.id} className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
          <p className="text-sm text-gray-600">Username: {user.username}</p>
          <p className="text-sm text-gray-600">Email: {user.email}</p>
          {user.phoneNumber && <p className="text-sm text-gray-600">Phone: {user.phoneNumber}</p>}
          {user.flatNumber && <p className="text-sm text-gray-600">Flat: {user.flatNumber}</p>}
          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
            user.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
            user.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {user.status}
          </span>
        </div>
        {user.status === 'PENDING' && (
          <div className="flex gap-2">
            <button
              onClick={() => handleVerifyUser(user.id, 'APPROVED')}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => handleVerifyUser(user.id, 'REJECTED')}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
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
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'pending'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Pending Users ({pendingUsers.length})
            </button>
            <button
              onClick={() => setActiveTab('residents')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'residents'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Residents ({residents.length})
            </button>
            <button
              onClick={() => setActiveTab('managers')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'managers'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Managers ({managers.length})
            </button>
          </div>
        </div>

        <div className="mt-6">
          {activeTab === 'pending' && (
            <div>
              {pendingUsers.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No pending users</p>
              ) : (
                pendingUsers.map(renderUserCard)
              )}
            </div>
          )}
          {activeTab === 'residents' && (
            <div>
              {residents.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No residents</p>
              ) : (
                residents.map(renderUserCard)
              )}
            </div>
          )}
          {activeTab === 'managers' && (
            <div>
              {managers.length === 0 ? (
                <p className="text-center text-gray-600 py-8">No managers</p>
              ) : (
                managers.map(renderUserCard)
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

