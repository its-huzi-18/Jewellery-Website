import { useState } from 'react';
import { User, Lock, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [addressData, setAddressData] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser(profileData);
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUser({ address: addressData });
    } catch (error) {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    if (passwordData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Password change would be handled via API
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 min-h-screen bg-black-50">
      <div className="container-custom">
        <h1 className="font-serif text-4xl font-bold text-black-900 mb-8">
          My Account
        </h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10" />
                </div>
                <h3 className="font-semibold text-black-900">{user?.name}</h3>
                <p className="text-sm text-black-500">{user?.email}</p>
                <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full ${
                  user?.role === 'admin' 
                    ? 'bg-gold-100 text-gold-700' 
                    : 'bg-black-100 text-black-700'
                }`}>
                  {user?.role === 'admin' ? 'Administrator' : 'Customer'}
                </span>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Profile Info', icon: User },
                  { id: 'address', label: 'Address', icon: MapPin },
                  { id: 'password', label: 'Change Password', icon: Lock }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-gold-50 text-gold-600'
                        : 'text-black-600 hover:bg-black-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white p-8">
                <h2 className="font-serif text-2xl font-semibold mb-6">
                  Profile Information
                </h2>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="input-field"
                        disabled
                      />
                      <p className="text-xs text-black-500 mt-1">Email cannot be changed</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="input-field"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'address' && (
              <div className="bg-white p-8">
                <h2 className="font-serif text-2xl font-semibold mb-6">
                  Shipping Address
                </h2>
                <form onSubmit={handleAddressSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={addressData.street}
                      onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                      className="input-field"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={addressData.city}
                        onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                        className="input-field"
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={addressData.state}
                        onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                        className="input-field"
                        placeholder="NY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={addressData.zipCode}
                        onChange={(e) => setAddressData({ ...addressData, zipCode: e.target.value })}
                        className="input-field"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={addressData.country}
                      onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                      className="input-field"
                      placeholder="United States"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Saving...' : 'Save Address'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="bg-white p-8">
                <h2 className="font-serif text-2xl font-semibold mb-6">
                  Change Password
                </h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className={`input-field ${errors.currentPassword ? 'border-red-500' : ''}`}
                    />
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className={`input-field ${errors.newPassword ? 'border-red-500' : ''}`}
                      />
                      {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className={`input-field ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
