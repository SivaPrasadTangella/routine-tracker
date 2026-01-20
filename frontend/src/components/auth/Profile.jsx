
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { User, Mail, Save, X, Camera, Trash2, Phone } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL; // Define API URL base for images

const COUNTRY_CODES = [
    { code: '+1', flag: '🇺🇸', country: 'USA' },
    { code: '+91', flag: '🇮🇳', country: 'India' },
    { code: '+44', flag: '🇬🇧', country: 'UK' },
    { code: '+81', flag: '🇯🇵', country: 'Japan' },
    { code: '+86', flag: '🇨🇳', country: 'China' },
    { code: '+61', flag: '🇦🇺', country: 'Australia' },
    { code: '+49', flag: '🇩🇪', country: 'Germany' },
    { code: '+33', flag: '🇫🇷', country: 'France' },
];

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        countryCode: '+1',
        localNumber: ''
    });
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user) {
            let country = '+91';
            let number = '';

            if (user.mobile) {
                const parts = user.mobile.split(' ');
                if (parts.length > 1) {
                    country = parts[0];
                    number = parts.slice(1).join(' ');
                } else {
                    number = user.mobile;
                }
            }

            setFormData({
                username: user.username || '',
                email: user.email || '',
                countryCode: country,
                localNumber: number
            });

            // Handle profile photo URL
            let photoUrl = user.profile_photo;
            if (photoUrl && !photoUrl.startsWith('http') && !photoUrl.startsWith('blob')) {
                photoUrl = `${API_URL}${photoUrl}`;
            }
            setPreview(photoUrl);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const fileInputRef = React.useRef(null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPreview(URL.createObjectURL(file));
            setIsEditing(true); // Ensure edit mode is on so Save button appears
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);

        const fullMobile = `${formData.countryCode} ${formData.localNumber}`;
        data.append('mobile', fullMobile);

        if (photo) {
            data.append('profile_photo', photo);
        }

        const res = await updateUser(data);

        if (res.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } else {
            setMessage({ type: 'error', text: res.error });
        }
        setLoading(false);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemovePhoto = async () => {
        if (!confirm("Are you sure you want to remove your profile photo?")) return;
        setLoading(true);
        // Send partial update with null for profile_photo
        const res = await updateUser({ profile_photo: null });

        if (res.success) {
            setMessage({ type: 'success', text: 'Photo removed successfully!' });
            setPhoto(null);
            setPreview(null);
        } else {
            setMessage({ type: 'error', text: res.error });
        }
        setLoading(false);
    };

    return (
        <div className="max-w-xl mx-auto animate-fade-in pt-10">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8 text-center drop-shadow-sm">
                Your Profile
            </h1>

            <div className="glass-card p-8 relative overflow-hidden">
                {/* Decorative background blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                <div className="flex flex-col items-center mb-8 relative z-10">
                    <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/50 dark:border-white/10 shadow-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center transition-transform hover:scale-105">
                            {preview ? (
                                <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-4xl font-bold">
                                    {user?.username?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 flex gap-2">
                        {preview && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleRemovePhoto(); }}
                                className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 z-20"
                                title="Remove photo"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                        <button
                            type="button"
                            className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95"
                        >
                            <Camera size={18} />
                        </button>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoChange}
                    />
                </div>

                <Link to="/" className="mt-4 hover:opacity-80 transition-opacity">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {user?.username}
                    </h2>
                </Link>

                <p className="text-slate-500 dark:text-zinc-400 font-medium">{user?.email}</p>
            </div>

            {message && (
                <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2 ml-1">Username</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <User size={18} />
                        </div>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium text-slate-800 dark:text-white placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2 ml-1">Email</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium text-slate-800 dark:text-white placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-zinc-300 mb-2 ml-1">Mobile Number</label>
                    <div className="flex gap-3">
                        <div className="relative w-28">
                            <select
                                name="countryCode"
                                value={formData.countryCode}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full appearance-none pl-4 pr-8 py-3 bg-white/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium text-slate-800 dark:text-white"
                            >
                                <option value="+1">🇺🇸 +1</option>
                                <option value="+91">🇮🇳 +91</option>
                                <option value="+44">🇬🇧 +44</option>
                                <option value="+81">🇯🇵 +81</option>
                                <option value="+86">🇨🇳 +86</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <Phone size={14} />
                            </div>
                        </div>
                        <div className="relative flex-1">
                            <input
                                type="tel"
                                name="localNumber"
                                value={formData.localNumber}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 bg-white/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed font-medium text-slate-800 dark:text-white placeholder:text-slate-400"
                                placeholder="98765 43210"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    {isEditing ? (
                        <>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsEditing(false);
                                    setMessage(null);
                                    setPhoto(null);
                                    setPreview(user.profile_photo);
                                }}
                                className="flex-1"
                            >
                                <X size={18} className="mr-2" /> Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                            >
                                {loading ? 'Saving...' : <><Save size={18} className="mr-2" /> Save Changes</>}
                            </Button>
                        </>
                    ) : (
                        <Button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xl"
                        >
                            Edit Profile
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Profile;
