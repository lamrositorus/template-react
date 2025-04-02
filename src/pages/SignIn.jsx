import { useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_Source } from '../global/Apisource';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    if (token) {
      localStorage.setItem('token', token);
      setAlertMessage('Login dengan Google berhasil!');
      setAlertType('success');
      setShowAlert(true);
      setTimeout(() => {
        navigate('/dashboard');
        setShowAlert(false);
      }, 1000);
    }
  }, [location, navigate]);

  const loginMutation = useMutation({
    mutationFn: ({ username, password }) => API_Source.login(username, password),
    onMutate: () => {
      setShowAlert(false);
    },
    onSuccess: (userData) => {
      setAlertMessage('Welcome back! Login successful.');
      setAlertType('success');
      setShowAlert(true);
      console.log('Login successful:', userData);

      setUsername('');
      setPassword('');

      setTimeout(() => {
        navigate('/dashboard');
        setShowAlert(false);
      }, 1000);
    },
    onError: (error) => {
      console.error('Login failed:', error);
      setAlertMessage(
        error.message.includes('Server returned non-JSON')
          ? 'Server error: Please try again later.'
          : error.message.includes('404')
            ? 'Login endpoint not found.'
            : error.message.includes('500')
              ? 'Internal server error.'
              : `Login failed: ${error.message}`,
      );
      setAlertType('error');
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
      {showAlert && (
        <div className="toast toast-top toast-center z-50">
          <div
            className={`alert ${
              alertType === 'success' ? 'alert-success' : 'alert-error'
            } shadow-md transition-all duration-300`}
          >
            <span className="font-medium">{alertMessage}</span>
          </div>
        </div>
      )}

      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300">
        <div className="card-body p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-primary tracking-tight">
            Sign In
          </h1>

          {loginMutation.isPending ? (
            <div className="space-y-6">
              <div className="skeleton h-12 w-full rounded-md"></div>
              <div className="skeleton h-12 w-full rounded-md"></div>
              <div className="skeleton h-12 w-full rounded-md"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Username</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
                  className="input input-bordered input-primary w-full focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-200"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  className="input input-bordered input-primary w-full focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full hover:btn-primary-focus transition-all duration-300"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Login'
                )}
              </button>

              <div className="flex justify-center mt-4">
                <a
                  href="https://sparepart-alma.vercel.app/user/auth/google" // Perbaikan: ke rute awal
                  className="btn btn-outline"
                >
                  <img src="/icons8-google.svg" alt="Google Logo" className="w-5 h-5 mr-2" />
                  Login with Google
                </a>
              </div>
            </form>
          )}

          <div className="divider text-sm text-base-content opacity-70">Not a member?</div>
          <p className="text-center text-sm">
            <a href="#" className="link link-primary hover:link-primary-focus">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};