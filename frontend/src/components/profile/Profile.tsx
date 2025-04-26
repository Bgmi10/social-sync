import { useState } from 'react';
import { PlusIcon, UploadIcon, ArrowRightIcon, XIcon } from 'lucide-react';
import { mockPosts, socialPlatforms } from './constants';
import { useAuth } from '../../contexts/AuthProvider';
import { fbLogin } from '../../services/fbLogin';

export default function Profile() {
  const [connections, setConnections] = useState(socialPlatforms);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isConnecting, setIsConnecting] = useState(null);
  const [postCaption, setPostCaption] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const { user } = useAuth();

  const handleConnect = async (platform) => {
    setIsConnecting(platform.id);
  
    try {
      if (platform.id === "facebook") {
        fbLogin();
      }
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(null);
    }
  };
  

  const handleDisconnect = (platformId) => {
    setConnections(connections.map(p => 
      p.id === platformId ? { ...p, connected: false } : p
    ));
  };

  const handleMediaSelect = (id) => {
    if (selectedMedia.includes(id)) {
      setSelectedMedia(selectedMedia.filter(mediaId => mediaId !== id));
    } else {
      setSelectedMedia([...selectedMedia, id]);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'video/mp4'];
      const maxSize = 50 * 1024 * 1024; // 50MB
      
      if (!validTypes.includes(selectedFile.type)) {
        alert('Please select a valid image (JPEG, PNG) or video (MP4) file');
        return;
      }
      
      if (selectedFile.size > maxSize) {
        alert('File size exceeds 50MB limit');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || selectedMedia.length === 0) {
      alert('Please select a file and at least one platform');
      return;
    }
    
    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setTimeout(() => setUploadProgress(i), i * 50);
      }
      
      // In a real app, this would:
      // 1. Upload file to your endpoint
      // 2. Endpoint would:
      //    - Validate with Zod
      //    - Upload to S3
      //    - Get platform tokens from DB
      //    - Distribute to selected platforms
      //    - Create post record in DB
      
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      alert('Upload successful! Your content is being distributed to selected platforms.');
      setIsUploadOpen(false);
      setUploadProgress(0);
      setFile(null);
      setSelectedMedia([]);
      setPostCaption('');
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadProgress(0);
      alert('Upload failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Profile Header */}
      <div className="max-w-4xl mx-auto bg-gradient-to-tr from-purple-300 via-blue-400 to-pink-300 rounded-xl shadow-md overflow-hidden p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 relative">
            <img 
              src="https://avatars.githubusercontent.com/u/143197207?v=4" 
              className="rounded-full w-24 h-24 md:w-32 md:h-32 object-cover border-4 border-blue-100"
              alt="Profile"
            />
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full">
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{user.name}</h1>
                <p className="text-gray-600 mt-2">Digital Content Creator | Social Media Strategist</p>
              </div>
              <button className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Edit Profile
              </button>
            </div>
            
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
              {connections.filter(c => c.connected).map(platform => (
                <span 
                  key={platform.id}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <img src={platform.icon} alt={platform.name} className="w-3 h-3" />
                  {platform.name}
                </span>
              ))}
            </div>
            
            <div className="mt-4 flex justify-between max-w-md">
              <div className="text-center">
                <p className="font-bold text-gray-800">142</p>
                <p className="text-xs text-gray-500">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800">5.8K</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800">328</p>
                <p className="text-xs text-gray-500">Following</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800">1.2M</p>
                <p className="text-xs text-gray-500">Views</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Connections */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Social Media Connections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {connections.map((platform) => (
            <div 
              key={platform.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                platform.connected ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <img 
                  src={platform.icon} 
                  alt={platform.name} 
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <p className="font-medium text-gray-800">{platform.name}</p>
                  <p className="text-xs text-gray-500">
                    {platform.connected ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              
              {platform.connected ? (
                <button
                  onClick={() => handleDisconnect(platform.id)}
                  className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded-md hover:bg-red-50"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(platform)}
                  disabled={isConnecting === platform.id}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium ${
                    isConnecting === platform.id 
                      ? 'bg-blue-300 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isConnecting === platform.id ? (
                    'Connecting...'
                  ) : (
                    <>
                      Connect <ArrowRightIcon className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2">How connecting works</h3>
          <p className="text-sm text-blue-700">
            You'll be redirected to the platform to authorize access. We only request minimum permissions
            needed to share your content. Your credentials are never stored directly.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex border-b border-gray-200 w-full">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'posts' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('reels')}
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'reels' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Reels
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === 'videos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Videos
            </button>
          </div>
          
          <button
            onClick={() => setIsUploadOpen(true)}
            className="ml-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
          >
            <PlusIcon className="h-5 w-5" />
            New Post
          </button>
        </div>

        {activeTab === 'posts' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {mockPosts.filter(p => p.type === 'image').map((post) => (
              <div key={post.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative group">
                <img 
                  src={post.thumbnail} 
                  alt={`Post ${post.id}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex flex-wrap justify-center gap-1 max-w-[80%]">
                    {post.platforms.map(platform => (
                      <img 
                        key={platform} 
                        src={`/icons/${platform}.svg`} 
                        alt={platform} 
                        className="w-5 h-5 bg-white p-0.5 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {mockPosts.filter(p => p.type === 'reel').map((post) => (
              <div key={post.id} className="aspect-[9/16] bg-gray-200 rounded-lg overflow-hidden relative group">
                <img 
                  src={post.thumbnail} 
                  alt={`Reel ${post.id}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  0:15
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {mockPosts.filter(p => p.type === 'video').map((post) => (
              <div key={post.id} className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative group">
                <img 
                  src={post.thumbnail} 
                  alt={`Video ${post.id}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  2:45
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Post</h3>
              <button
                onClick={() => {
                  setIsUploadOpen(false);
                  setUploadProgress(0);
                  setFile(null);
                  setSelectedMedia([]);
                  setPostCaption('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
              {file ? (
                <div className="flex flex-col items-center">
                  {file.type.startsWith('image/') ? (
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="Preview" 
                      className="max-h-60 rounded-lg mb-2"
                    />
                  ) : (
                    <div className="bg-gray-100 w-full h-40 flex items-center justify-center rounded-lg mb-2">
                      <span className="text-gray-500">Video file selected</span>
                    </div>
                  )}
                  <p className="font-medium truncate max-w-full">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button
                    onClick={() => setFile(null)}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div>
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">Drag and drop files here or click to browse</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    id="file-upload"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,video/mp4"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer text-sm"
                  >
                    Select File
                  </label>
                </div>
              )}
            </div>

            {/* Caption */}
            <div className="mb-4">
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
                Caption
              </label>
              <textarea
                id="caption"
                rows={3}
                value={postCaption}
                onChange={(e) => setPostCaption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write a caption..."
              />
            </div>

            {/* Platform Selection */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Select Platforms</h4>
              {connections.filter(c => c.connected).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {connections.filter(c => c.connected).map(platform => (
                    <button
                      key={platform.id}
                      onClick={() => handleMediaSelect(platform.id)}
                      disabled={uploadProgress > 0}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        selectedMedia.includes(platform.id) 
                          ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      } ${uploadProgress > 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <img src={platform.icon} alt={platform.name} className="w-4 h-4" />
                      {platform.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No connected platforms. Please connect at least one social media account above.
                </p>
              )}
            </div>

            {/* Progress Bar */}
            {uploadProgress > 0 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-500 mt-1">
                  {uploadProgress}% {uploadProgress === 100 ? 'Finalizing...' : 'Uploading...'}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsUploadOpen(false);
                  setUploadProgress(0);
                  setFile(null);
                  setSelectedMedia([]);
                  setPostCaption('');
                }}
                disabled={uploadProgress > 0}
                className={`px-4 py-2 rounded-lg ${
                  uploadProgress > 0 ? 'text-gray-500 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || selectedMedia.length === 0 || uploadProgress > 0}
                className={`px-4 py-2 rounded-lg text-white ${
                  (!file || selectedMedia.length === 0 || uploadProgress > 0) 
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {uploadProgress > 0 ? 'Uploading...' : 'Share Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}