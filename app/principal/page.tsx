'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCurrentUser,
  getUserProfile,
  getFilesByRole,
  approveByPrincipal,
  rejectByPrincipal,
  signOut,
} from '@/lib/supabaseService';
import { Profile, FileRecord } from '@/types';
import { LogOut } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FileCard from '@/components/FileCard';
import FileDetailsModal from '@/components/FileDetailsModal';
import ApprovalModal from '@/components/ApprovalModal';
import toast from 'react-hot-toast';

export default function PrincipalDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [processingFileId, setProcessingFileId] = useState<string | null>(null);

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
      if (!profile || profile.role !== 'principal') {
        router.push('/');
        return;
      }

      setUser(profile);

      // Fetch files pending principal's approval
      const pendingFiles = await getFilesByRole('principal', currentUser.id);
      setFiles(pendingFiles);
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

  const handleApprove = async (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    setSelectedFile(file);
    setApprovalAction('approve');
    setShowApprovalModal(true);
  };

  const handleReject = async (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (!file) return;

    setSelectedFile(file);
    setApprovalAction('reject');
    setShowApprovalModal(true);
  };

  const handleApprovalSubmit = async (remark: string) => {
    if (!selectedFile || !user) return;

    setProcessingFileId(selectedFile.id);
    try {
      if (approvalAction === 'approve') {
        await approveByPrincipal(selectedFile.id, user.id, remark);
        toast.success('File approved and sent to President');
      } else {
        await rejectByPrincipal(selectedFile.id, user.id, remark);
        toast.success('File rejected and sent back to Staff');
      }

      setShowApprovalModal(false);
      await fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to process action');
    } finally {
      setProcessingFileId(null);
    }
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Principal Dashboard</h1>
          <p className="text-gray-600 mt-1">Review and approve files from staff</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Pending Review</p>
            <p className="text-3xl font-bold text-blue-600">{files.filter((f) => f.current_stage === 'principal' && f.status === 'pending').length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{files.filter((f) => f.current_stage === 'president' || f.current_stage === 'completed').length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{files.filter((f) => f.status === 'rejected').length}</p>
          </div>
        </div>

        {/* Files */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No files pending your review</p>
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
                onApprove={file.current_stage === 'principal' ? () => handleApprove(file.id) : undefined}
                onReject={file.current_stage === 'principal' ? () => handleReject(file.id) : undefined}
                showActions={file.current_stage === 'principal'}
              />
            ))
          )}
        </div>
      </main>

      {/* Modals */}
      {showDetailsModal && selectedFile && (
        <FileDetailsModal file={selectedFile} onClose={() => setShowDetailsModal(false)} />
      )}

      {showApprovalModal && selectedFile && (
        <ApprovalModal
          fileName={selectedFile.title}
          action={approvalAction}
          onClose={() => setShowApprovalModal(false)}
          onConfirm={handleApprovalSubmit}
        />
      )}
    </>
  );
}
