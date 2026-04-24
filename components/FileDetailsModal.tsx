import { FileRecord, ApprovalHistory, Profile } from '@/types';
import { X, Download, CheckCircle, XCircle, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getApprovalHistory, getUserProfile } from '@/lib/supabaseService';
import { formatDistanceToNow } from 'date-fns';

interface FileDetailsModalProps {
  file: FileRecord;
  onClose: () => void;
}

export default function FileDetailsModal({ file, onClose }: FileDetailsModalProps) {
  const [approvalHistory, setApprovalHistory] = useState<ApprovalHistory[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getApprovalHistory(file.id);
        setApprovalHistory(history);

        // Fetch user profiles for all actors in history
        const uniqueUserIds = [...new Set([file.created_by, ...history.map((h) => h.action_by)])];
        const profilesMap: Record<string, Profile> = {};

        for (const userId of uniqueUserIds) {
          const profile = await getUserProfile(userId);
          if (profile) {
            profilesMap[userId] = profile;
          }
        }

        setProfiles(profilesMap);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [file.id, file.created_by]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'uploaded':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      case 'uploaded':
        return <Upload className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b flex items-center justify-between p-6">
          <h2 className="text-2xl font-bold text-gray-900">{file.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* File Information */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">File Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">File Name</label>
                <p className="text-gray-900">{file.file_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-gray-900">{file.description || 'No description provided'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className="text-gray-900 capitalize">{file.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Current Stage</label>
                  <p className="text-gray-900 capitalize">{file.current_stage}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Uploaded By</label>
                <p className="text-gray-900">{profiles[file.created_by]?.name || 'Unknown'}</p>
              </div>
              <div>
                <a
                  href={file.file_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download File
                </a>
              </div>
            </div>
          </section>

          {/* Approval History */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval History</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : approvalHistory.length === 0 ? (
              <p className="text-gray-500">No approval history yet</p>
            ) : (
              <div className="space-y-4">
                {approvalHistory.map((history, index) => (
                  <div key={history.id} className="flex gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(history.action)} bg-gray-100`}>
                        {getStatusIcon(history.action)}
                      </div>
                      {index < approvalHistory.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-300 my-2"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-900">
                            {profiles[history.action_by]?.name || 'Unknown'}{' '}
                            <span className="text-gray-600 font-normal">({history.role})</span>
                          </p>
                          <span className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(history.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className={`text-sm font-medium capitalize ${getStatusColor(history.action)}`}>
                          {history.action === 'uploaded' ? 'File Uploaded' : history.action === 'approved' ? 'Approved' : 'Rejected'}
                        </p>
                        {history.remark && (
                          <p className="text-sm text-gray-700 mt-2">
                            <strong>Remark:</strong> {history.remark}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t flex justify-end gap-3 p-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
