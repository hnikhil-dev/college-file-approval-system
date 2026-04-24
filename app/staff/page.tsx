'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserProfile, getFilesByRole, signOut } from '@/lib/supabaseService';
import { Profile, FileRecord } from '@/types';
import { LogOut, Upload, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FileCard from '@/components/FileCard';
import FileDetailsModal from '@/components/FileDetailsModal';
import UploadModal from '@/components/UploadModal';
import toast from 'react-hot-toast';

export default function StaffDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }

      const profile = await getUserProfile(currentUser.id);
      if (!profile || profile.role !== 'staff') {
        router.push('/');
        return;
      }

      setUser(profile);

      // Fetch files for this staff member
      const userFiles = await getFilesByRole('staff', currentUser.id);
      setFiles(userFiles);
    } catch (error: any) {
      toast.error('Failed to load dashboard');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error: any) {
      toast.error('Failed to logout');
    }
  };

  const handleFileUpload = async (title: string, description: string, file: File) => {
    await fetchData();
    setShowUploadModal(false);
    toast.success('File uploaded successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />

      <main className="container-main">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
            <p className="text-gray-600 mt-1">Upload and track your files</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary mt-4 md:mt-0 inline-flex items-center"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload File
          </button>
        </div>

        {/* Files Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No files uploaded yet</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary mt-4"
              >
                Upload Your First File
              </button>
            </div>
          ) : (
            files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onView={() => {
                  setSelectedFile(file);
                  setShowDetailsModal(true);
                }}
              />
            ))
          )}
        </div>
      </main>

      {/* Modals */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleFileUpload}
        />
      )}

      {showDetailsModal && selectedFile && (
        <FileDetailsModal
          file={selectedFile}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </>
  );
}
