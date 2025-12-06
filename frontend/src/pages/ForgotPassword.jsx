import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetToken, setResetToken] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await api.post('/auth/forgot-password', { email })
      setSuccess(response.data.message)
      setResetToken(response.data.token) // In production, this would be sent via email
    } catch (err) {
      setError(err.response?.data || 'Error processing request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Forgot Password</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            <p className="mb-2">{success}</p>
            {resetToken && (
              <div className="mt-3 p-3 bg-gray-50 rounded border">
                <p className="text-sm font-medium mb-1">Reset Token (for development):</p>
                <p className="text-xs font-mono break-all bg-white p-2 rounded border">{resetToken}</p>
                <p className="text-xs text-gray-600 mt-2">
                  Copy this token and use it on the Reset Password page.
                </p>
              </div>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email address"
            />
            <p className="mt-2 text-sm text-gray-500">
              We'll send you a password reset token to this email address.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? 'Sending...' : 'Send Reset Token'}
          </button>
        </form>
        <div className="mt-6 space-y-2 text-center text-sm">
          <p className="text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Login here
            </Link>
          </p>
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Register here
            </Link>
          </p>
          {resetToken && (
            <Link
              to={`/reset-password?token=${resetToken}`}
              className="block mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Go to Reset Password Page →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

