import { Loader2 } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Connection {
  access_token: string;
  expires_in: number;
}

interface ConnectMediaProps {
  mediaName: string;
  mediaIcon: JSX.Element;
  exchangeCodeUrl: string;
  connectUrl: string;
  loginService: () => void;
}

export default function ConnectMedia({
  mediaName,
  mediaIcon,
  exchangeCodeUrl,
  connectUrl,
  loginService,
}: ConnectMediaProps) {
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("code");
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [startCount, setStartCount] = useState(5);

  async function updateUserConnections(data: Connection) {
    try {
      const res = await fetch(connectUrl, {
        method: "POST",
        body: JSON.stringify({
          mediaName: mediaName,
          ...data,
        }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        setInterval(() => {
          setStartCount((p) => p - 1);
        }, 1000);

        setTimeout(() => {
          navigate("/profile");
        }, 5000);
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to connect ${mediaName}`);
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
    } finally {
      setLoader(false);
    }
  }

  async function convertTokenForCode() {
    try {
      const res = await fetch(exchangeCodeUrl, {
        method: "POST",
        body: JSON.stringify({ token }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.status === 200) {
        await updateUserConnections(data.data);
      } else {
        throw new Error(data.message || `Failed to authenticate with ${mediaName}`);
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "An unexpected error occurred");
      setLoader(false);
    }
  }

  useEffect(() => {
    if (token) {
      convertTokenForCode();
    } else {
      setError(`Missing authentication code from ${mediaName}`);
      setLoader(false);
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Brand Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white">{mediaName} Connection</h1>
            <p className="text-blue-100 mt-1">
              {loader ? "Connecting your account..." : error ? "Connection issue" : "Successfully connected!"}
            </p>
          </div>

          <div className="p-8 text-center">
            {loader ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                <p className="text-gray-600">We're connecting your {mediaName} account...</p>
                <p className="text-sm text-gray-500">This may take a few moments</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="bg-red-50 p-4 rounded-full">
                  <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Connection Failed</h3>
                <p className="text-gray-600">{error}</p>
                <button
                  onClick={loginService}
                  className="flex items-center justify-center space-x-2 w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md"
                >
                  {mediaIcon}
                  <span>Reconnect with {mediaName}</span>
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Go back to profile
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="bg-green-50 p-4 rounded-full">
                  <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Successfully Connected!</h3>
                <p className="text-gray-600">Your {mediaName} account is now connected to SocialSync.</p>
                <span className="text-red-500 text-sm">you will redirect in {startCount} seconds</span>
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md"
                >
                  Continue to Profile
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} SocialSync. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
