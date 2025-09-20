// frontend/src/components/auth/Profile.js
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { validateEmail, validateName, validatePhone } from '../../utils/validators';

const Profile = () => {
  const { user, updateProfile, changePassword } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [profileErrors, setProfileErrors] = useState({});

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    
    if (profileErrors[name]) {
      setProfileErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfileForm = () => {
    const errors = {};

    if (!profileData.firstName) {
      errors.firstName = 'Tên là bắt buộc';
    } else if (!validateName(profileData.firstName)) {
      errors.firstName = 'Tên không hợp lệ';
    }

    if (!profileData.lastName) {
      errors.lastName = 'Họ là bắt buộc';
    } else if (!validateName(profileData.lastName)) {
      errors.lastName = 'Họ không hợp lệ';
    }

    if (!profileData.email) {
      errors.email = 'Email là bắt buộc';
    } else if (!validateEmail(profileData.email)) {
      errors.email = 'Email không hợp lệ';
    }

    if (profileData.phone && !validatePhone(profileData.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Mật khẩu hiện tại là bắt buộc';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'Mật khẩu mới là bắt buộc';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu không khớp';
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile(profileData);
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Cập nhật thất bại!' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Đổi mật khẩu thất bại!' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'profile', label: 'Thông tin cá nhân', icon: '👤' },
    { key: 'password', label: 'Đổi mật khẩu', icon: '🔒' },
    { key: 'orders', label: 'Đơn hàng', icon: '📦' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Tài khoản của tôi</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {message.text && (
            <div className={`mb-6 ${message.type === 'success' ? 'alert alert-success' : 'alert alert-error'}`}>
              {message.text}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">
                    Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    className={`form-input ${profileErrors.firstName ? 'form-input-error' : ''}`}
                    disabled={loading}
                  />
                  {profileErrors.firstName && (
                    <p className="form-error">{profileErrors.firstName}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Họ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    className={`form-input ${profileErrors.lastName ? 'form-input-error' : ''}`}
                    disabled={loading}
                  />
                  {profileErrors.lastName && (
                    <p className="form-error">{profileErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className={`form-input ${profileErrors.email ? 'form-input-error' : ''}`}
                  disabled={loading}
                />
                {profileErrors.email && (
                  <p className="form-error">{profileErrors.email}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className={`form-input ${profileErrors.phone ? 'form-input-error' : ''}`}
                  disabled={loading}
                />
                {profileErrors.phone && (
                  <p className="form-error">{profileErrors.phone}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">Địa chỉ</label>
                <textarea
                  id="address"
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  rows={4}
                  className="form-input"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
              </button>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
              <div className="form-group">
                <label htmlFor="currentPassword" className="form-label">
                  Mật khẩu hiện tại <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className={`form-input ${passwordErrors.currentPassword ? 'form-input-error' : ''}`}
                  disabled={loading}
                />
                {passwordErrors.currentPassword && (
                  <p className="form-error">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="newPassword" className="form-label">
                  Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={`form-input ${passwordErrors.newPassword ? 'form-input-error' : ''}`}
                  disabled={loading}
                />
                {passwordErrors.newPassword && (
                  <p className="form-error">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={`form-input ${passwordErrors.confirmPassword ? 'form-input-error' : ''}`}
                  disabled={loading}
                />
                {passwordErrors.confirmPassword && (
                  <p className="form-error">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
              </button>
            </form>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Quản lý đơn hàng</h3>
              <p className="text-gray-600 mb-4">
                Xem chi tiết đơn hàng trong trang <strong>Đơn hàng của tôi</strong>
              </p>
              <button
                onClick={() => window.location.href = '/orders'}
                className="btn btn-primary"
              >
                Xem đơn hàng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;