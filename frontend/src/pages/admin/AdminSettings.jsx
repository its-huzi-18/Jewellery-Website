import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Lock, Globe, Instagram, Facebook, Twitter, Save, Upload, Smartphone, Building, DollarSign, Percent, Truck, Settings as SettingsIcon, Moon, Sun } from 'lucide-react';
import { settingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminSettings = () => {
  const { user: currentUser, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [adminProfile, setAdminProfile] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [websiteSettings, setWebsiteSettings] = useState({
    siteName: 'Black & Gold Pakistan',
    siteTagline: 'Premium Jewelry & Accessories',
    siteDescription: 'Discover hand-crafted jewellery for every style. Pakistan\'s premier jewelry destination.',
    currency: 'PKR',
    currencySymbol: 'Rs. ',
    taxRate: 0,
    freeShippingThreshold: 15000,
    shippingCost: 200
  });

  const [contactInfo, setContactInfo] = useState({
    contactEmail: 'info@blackgold.com',
    contactPhone: '+92 21 12345678',
    contactAddress: {
      street: 'Shop #123, Main Boulevard',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75500',
      country: 'Pakistan'
    }
  });

  const [socialMedia, setSocialMedia] = useState({
    facebook: { url: '', enabled: true },
    instagram: { url: '', enabled: true },
    twitter: { url: '', enabled: true },
    pinterest: { url: '', enabled: false },
    youtube: { url: '', enabled: false },
    tiktok: { url: '', enabled: false }
  });

  const [maintenanceMode, setMaintenanceMode] = useState({
    enabled: false,
    message: 'We\'ll be back soon!'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [profileRes, settingsRes] = await Promise.all([
        settingAPI.getAdminProfile(),
        settingAPI.getSettings()
      ]);

      if (profileRes.data.data.admin) {
        setAdminProfile(prev => ({
          ...prev,
          name: profileRes.data.data.admin.name || '',
          email: profileRes.data.data.admin.email || '',
          phone: profileRes.data.data.admin.phone || '',
          profileImage: profileRes.data.data.admin.profileImage || ''
        }));
      }

      if (settingsRes.data.data.settings) {
        const settings = settingsRes.data.data.settings;
        setWebsiteSettings({
          siteName: settings.siteName || 'Black & Gold',
          siteTagline: settings.siteTagline || '',
          siteDescription: settings.siteDescription || '',
          currency: settings.currency || 'PKR',
          currencySymbol: settings.currencySymbol || 'Rs.',
          taxRate: settings.taxRate || 8,
          freeShippingThreshold: settings.freeShippingThreshold || 15000,
          shippingCost: settings.shippingCost || 200
        });
        setContactInfo({
          contactEmail: settings.contactEmail || '',
          contactPhone: settings.contactPhone || '',
          contactAddress: settings.contactAddress || {
            street: '', city: '', state: '', zipCode: '', country: ''
          }
        });
        setSocialMedia(settings.socialMedia || socialMedia);
        setMaintenanceMode(settings.maintenanceMode || maintenanceMode);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (adminProfile.newPassword && adminProfile.newPassword !== adminProfile.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', adminProfile.name);
      formData.append('email', adminProfile.email);
      formData.append('phone', adminProfile.phone);
      if (adminProfile.currentPassword) {
        formData.append('currentPassword', adminProfile.currentPassword);
      }
      if (adminProfile.newPassword) {
        formData.append('newPassword', adminProfile.newPassword);
      }
      if (adminProfile.profileImageFile) {
        formData.append('profileImage', adminProfile.profileImageFile);
      }

      await settingAPI.updateAdminProfile(formData);
      toast.success('Profile updated successfully');
      
      // Refresh user data in context to update navbar
      await refreshUser();
      
      // Dispatch event to refresh WhatsApp button
      window.dispatchEvent(new CustomEvent('adminProfileUpdated'));
      
      setAdminProfile(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleWebsiteSettingsUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await settingAPI.updateSettings(websiteSettings);
      toast.success('Website settings updated successfully');
      // Refresh settings to show updated values
      fetchSettings();
    } catch (error) {
      toast.error('Failed to update website settings');
    } finally {
      setLoading(false);
    }
  };

  const handleContactUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await settingAPI.updateContact(contactInfo);
      toast.success('Contact information updated successfully');
      // Refresh settings to show updated values
      fetchSettings();
    } catch (error) {
      toast.error('Failed to update contact information');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialMediaUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await settingAPI.updateSocialMedia({ socialMedia });
      toast.success('Social media links updated successfully');
      // Refresh settings to show updated values
      fetchSettings();
    } catch (error) {
      toast.error('Failed to update social media');
    } finally {
      setLoading(false);
    }
  };

  const handleMaintenanceToggle = async () => {
    try {
      setLoading(true);
      await settingAPI.toggleMaintenance({
        enabled: !maintenanceMode.enabled,
        message: maintenanceMode.message
      });
      setMaintenanceMode(prev => ({
        ...prev,
        enabled: !prev.enabled
      }));
      toast.success(`Maintenance mode ${!maintenanceMode.enabled ? 'enabled' : 'disabled'}`);
      fetchSettings();
    } catch (error) {
      toast.error('Failed to update maintenance mode');
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await settingAPI.updateBusiness(websiteSettings);
      toast.success('Business settings updated successfully');
      fetchSettings();
    } catch (error) {
      toast.error('Failed to update business settings');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAdminProfile(prev => ({
        ...prev,
        profileImage: URL.createObjectURL(file),
        profileImageFile: file
      }));
    }
  };

  const tabs = [
    { id: 'profile', label: 'Admin Profile', icon: User },
    { id: 'website', label: 'Website Settings', icon: Globe },
    { id: 'contact', label: 'Contact Info', icon: MapPin },
    { id: 'social', label: 'Social Media', icon: Instagram },
    { id: 'business', label: 'Business', icon: Building },
    { id: 'maintenance', label: 'Maintenance', icon: Moon }
  ];

  if (loading && !adminProfile.name) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-black-900 mb-2">
          Settings
        </h1>
        <p className="text-black-500">
          Manage your store settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <nav className="space-y-1 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white'
                        : 'text-black-700 hover:bg-black-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden lg:block">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Admin Profile Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-serif font-semibold mb-6">Admin Profile</h2>
                  
                  {/* Profile Image */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center overflow-hidden">
                      {adminProfile.profileImage ? (
                        <img src={adminProfile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 text-white" />
                      )}
                    </div>
                    <div>
                      <label className="btn-primary text-sm py-2 px-4 cursor-pointer inline-flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload Photo
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                      <p className="text-xs text-black-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={adminProfile.name}
                        onChange={(e) => setAdminProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={adminProfile.email}
                        onChange={(e) => setAdminProfile(prev => ({ ...prev, email: e.target.value }))}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={adminProfile.phone}
                        onChange={(e) => setAdminProfile(prev => ({ ...prev, phone: e.target.value }))}
                        className="input-field"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="font-medium text-black-900 mb-4">Change Password</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-black-700 mb-2">
                          <Lock className="w-4 h-4 inline mr-1" />
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={adminProfile.currentPassword}
                          onChange={(e) => setAdminProfile(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="input-field"
                          placeholder="••••••••"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-black-700 mb-2">
                          <Lock className="w-4 h-4 inline mr-1" />
                          New Password
                        </label>
                        <input
                          type="password"
                          value={adminProfile.newPassword}
                          onChange={(e) => setAdminProfile(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="input-field"
                          placeholder="••••••••"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-black-700 mb-2">
                          <Lock className="w-4 h-4 inline mr-1" />
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={adminProfile.confirmPassword}
                          onChange={(e) => setAdminProfile(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="input-field"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                      <Save className="w-5 h-5" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Website Settings Tab */}
            {activeTab === 'website' && (
              <form onSubmit={handleWebsiteSettingsUpdate} className="space-y-6">
                <h2 className="text-2xl font-serif font-semibold mb-6">Website Settings</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={websiteSettings.siteName}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, siteName: e.target.value }))}
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={websiteSettings.siteTagline}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, siteTagline: e.target.value }))}
                      className="input-field"
                      placeholder="Premium Jewelry & Accessories"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={websiteSettings.siteDescription}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                      rows={3}
                      className="input-field resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Currency
                    </label>
                    <select
                      value={websiteSettings.currency}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="input-field"
                    >
                      <option value="PKR">PKR - Pakistani Rupee (Rs.)</option>
                      <option value="USD">USD - US Dollar ($)</option>
                      <option value="EUR">EUR - Euro (€)</option>
                      <option value="GBP">GBP - British Pound (£)</option>
                      <option value="AED">AED - UAE Dirham (د.إ)</option>
                      <option value="SAR">SAR - Saudi Riyal (﷼)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      Currency Symbol
                    </label>
                    <input
                      type="text"
                      value={websiteSettings.currencySymbol}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, currencySymbol: e.target.value }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      <Percent className="w-4 h-4 inline mr-1" />
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={websiteSettings.taxRate}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
                      className="input-field"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      <Truck className="w-4 h-4 inline mr-1" />
                      Free Shipping Threshold (Rs.)
                    </label>
                    <input
                      type="number"
                      value={websiteSettings.freeShippingThreshold}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
                      className="input-field"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      Shipping Cost (Rs.)
                    </label>
                    <input
                      type="number"
                      value={websiteSettings.shippingCost}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, shippingCost: Number(e.target.value) }))}
                      className="input-field"
                      min="0"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Save Settings
                  </button>
                </div>
              </form>
            )}

            {/* Contact Info Tab */}
            {activeTab === 'contact' && (
              <form onSubmit={handleContactUpdate} className="space-y-6">
                <h2 className="text-2xl font-serif font-semibold mb-6">Contact Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={contactInfo.contactEmail}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={contactInfo.contactPhone}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, contactPhone: e.target.value }))}
                      className="input-field"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={contactInfo.contactAddress.street}
                      onChange={(e) => setContactInfo(prev => ({
                        ...prev,
                        contactAddress: { ...prev.contactAddress, street: e.target.value }
                      }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={contactInfo.contactAddress.city}
                      onChange={(e) => setContactInfo(prev => ({
                        ...prev,
                        contactAddress: { ...prev.contactAddress, city: e.target.value }
                      }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      value={contactInfo.contactAddress.state}
                      onChange={(e) => setContactInfo(prev => ({
                        ...prev,
                        contactAddress: { ...prev.contactAddress, state: e.target.value }
                      }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      value={contactInfo.contactAddress.zipCode}
                      onChange={(e) => setContactInfo(prev => ({
                        ...prev,
                        contactAddress: { ...prev.contactAddress, zipCode: e.target.value }
                      }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={contactInfo.contactAddress.country}
                      onChange={(e) => setContactInfo(prev => ({
                        ...prev,
                        contactAddress: { ...prev.contactAddress, country: e.target.value }
                      }))}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Save Contact Info
                  </button>
                </div>
              </form>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <form onSubmit={handleSocialMediaUpdate} className="space-y-6">
                <h2 className="text-2xl font-serif font-semibold mb-6">Social Media Links</h2>
                
                <div className="space-y-4">
                  {[
                    { key: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
                    { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-pink-600' },
                    { key: 'twitter', label: 'Twitter/X', icon: Twitter, color: 'bg-black' },
                    { key: 'pinterest', label: 'Pinterest', icon: null, color: 'bg-red-600' },
                    { key: 'youtube', label: 'YouTube', icon: null, color: 'bg-red-600' },
                    { key: 'tiktok', label: 'TikTok', icon: null, color: 'bg-black' }
                  ].map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <div key={platform.key} className="flex items-center gap-4 p-4 bg-black-50 rounded-lg">
                        <div className={`w-10 h-10 ${platform.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          {Icon ? <Icon className="w-5 h-5 text-white" /> : <span className="text-white text-xs font-bold">{platform.key[0].toUpperCase()}</span>}
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder={`Enter your ${platform.label} profile URL`}
                            value={socialMedia[platform.key]?.url || ''}
                            onChange={(e) => setSocialMedia(prev => ({
                              ...prev,
                              [platform.key]: { ...prev[platform.key], url: e.target.value }
                            }))}
                            className="input-field"
                          />
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={socialMedia[platform.key]?.enabled}
                            onChange={(e) => setSocialMedia(prev => ({
                              ...prev,
                              [platform.key]: { ...prev[platform.key], enabled: e.target.checked }
                            }))}
                            className="w-4 h-4 text-gold-600 rounded"
                          />
                          <span className="text-sm text-black-700">Show</span>
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Save Social Media
                  </button>
                </div>
              </form>
            )}

            {/* Business Settings Tab */}
            {activeTab === 'business' && (
              <form onSubmit={handleBusinessUpdate} className="space-y-6">
                <h2 className="text-2xl font-serif font-semibold mb-6">Business Settings</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Currency
                    </label>
                    <select
                      value={websiteSettings.currency}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="input-field"
                    >
                      <option value="PKR">PKR - Pakistani Rupee (Rs.)</option>
                      <option value="USD">USD - US Dollar ($)</option>
                      <option value="EUR">EUR - Euro (€)</option>
                      <option value="GBP">GBP - British Pound (£)</option>
                      <option value="AED">AED - UAE Dirham (د.إ)</option>
                      <option value="SAR">SAR - Saudi Riyal (﷼)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      <Percent className="w-4 h-4 inline mr-1" />
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={websiteSettings.taxRate}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
                      className="input-field"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      <Truck className="w-4 h-4 inline mr-1" />
                      Free Shipping Threshold
                    </label>
                    <input
                      type="number"
                      value={websiteSettings.freeShippingThreshold}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, freeShippingThreshold: Number(e.target.value) }))}
                      className="input-field"
                      min="0"
                    />
                    <p className="text-xs text-black-500 mt-1">Orders above this amount get free shipping</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      Standard Shipping Cost
                    </label>
                    <input
                      type="number"
                      value={websiteSettings.shippingCost}
                      onChange={(e) => setWebsiteSettings(prev => ({ ...prev, shippingCost: Number(e.target.value) }))}
                      className="input-field"
                      min="0"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    Save Business Settings
                  </button>
                </div>
              </form>
            )}

            {/* Maintenance Mode Tab */}
            {activeTab === 'maintenance' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-serif font-semibold mb-6">Maintenance Mode</h2>
                
                <div className="bg-gradient-to-br from-black-50 to-black-100 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {maintenanceMode.enabled ? (
                        <Moon className="w-8 h-8 text-gold-600" />
                      ) : (
                        <Sun className="w-8 h-8 text-gold-600" />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-black-900">
                          {maintenanceMode.enabled ? 'Maintenance Mode is ON' : 'Maintenance Mode is OFF'}
                        </h3>
                        <p className="text-sm text-black-500">
                          {maintenanceMode.enabled 
                            ? 'Your store is currently inaccessible to customers' 
                            : 'Your store is live and accessible'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleMaintenanceToggle}
                      disabled={loading}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        maintenanceMode.enabled
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {maintenanceMode.enabled ? 'Turn Off' : 'Turn On'}
                    </button>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-black-700 mb-2">
                      Maintenance Message
                    </label>
                    <textarea
                      value={maintenanceMode.message}
                      onChange={(e) => setMaintenanceMode(prev => ({ ...prev, message: e.target.value }))}
                      rows={3}
                      className="input-field resize-none"
                      placeholder="We'll be back soon!"
                    />
                    <p className="text-xs text-black-500 mt-2">
                      This message will be displayed to visitors when maintenance mode is enabled
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">⚠️ Important</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• When maintenance mode is enabled, customers cannot access the store</li>
                    <li>• Admin users can still access the admin panel</li>
                    <li>• All existing orders remain accessible</li>
                    <li>• Remember to disable maintenance mode when you're done</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
