import { useState } from "react";
import { baseUrl } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon, XIcon, Lock, Mail, User } from 'lucide-react';

export default function Auth() {
    const [isSignupForm, setIsSignForm] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        name: ""
    });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Email regex validation
    const validateEmail = (email: string) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            email: "",
            password: "",
            name: ""
        };

        if (!form.email) {
            newErrors.email = "Email is required";
            valid = false;
        } else if (!validateEmail(form.email)) {
            newErrors.email = "Please enter a valid email address";
            valid = false;
        }

        if (!form.password) {
            newErrors.password = "Password is required";
            valid = false;
        } else if (form.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
            valid = false;
        }

        if (isSignupForm && !form.name.trim()) {
            newErrors.name = "Name is required";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev, 
            [name]: value
        }));
        
        // Clear error when user types
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        setErrors({ email: "", password: "", name: "" });

        try {
            const res = await fetch(`${baseUrl}${isSignupForm ? "/auth/signup" : "/auth/login"}`, {
                method: "POST",
                body: JSON.stringify(form),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            
            const data = await res.json();

            if (res.ok) {
                navigate("/profile");
            } else {
                throw new Error(data.message || "Authentication failed");
            }
        } catch (err) {
            setErrors(prev => ({
                ...prev,
                password: err instanceof Error ? err.message : "An unexpected error occurred"
            }));
            console.error("Auth error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Brand Header */}
                    <div className="bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 p-6 text-center">
                        <h1 className="text-2xl font-bold text-white">SocialSync</h1>
                        <p className="text-blue-100 mt-1">
                            {isSignupForm ? "Create your account" : "Sync your social presence"}
                        </p>
                    </div>
                    
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {isSignupForm && (
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="John Doe"
                                            onChange={handleFormChange}
                                            value={form.name}
                                            className={`w-full pl-10 pr-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        onChange={handleFormChange}
                                        value={form.email}
                                        className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        placeholder="••••••••"
                                        onChange={handleFormChange}
                                        value={form.password}
                                        className={`w-full pl-10 pr-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                                    />
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                                {!errors.password && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        {isSignupForm ? "Minimum 8 characters" : ""}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium ${
                                    isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                } transition-colors shadow-md`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    <>
                                        {isSignupForm ? 'Create Account' : 'Sign In'}
                                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        {isSignupForm ? 'Already have an account?' : 'New to SocialSync?'}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setIsSignForm(!isSignupForm);
                                    setErrors({ email: "", password: "", name: "" });
                                }}
                                className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {isSignupForm ? 'Sign in instead' : 'Create an account'}
                            </button>
                        </div>

                        {!isSignupForm && (
                            <div className="mt-4 text-center">
                                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                    Forgot your password?
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 text-center text-xs text-gray-500">
                    <p>By continuing, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms</a>, <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>, and <a href="#" className="text-blue-600 hover:underline">Cookie Use</a>.</p>
                    <p className="mt-1">© {new Date().getFullYear()} SocialSync. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}