import { FileRecord } from '@/types';
import { FileText, Eye, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FileCardProps {
  file: FileRecord;
  onView?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  showActions?: boolean;
}

export default function FileCard({
  file,
  onView,
  onApprove,
  onReject,
  showActions = true,
}: FileCardProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'badge-approved';
      case 'rejected':
        return 'badge-rejected';
      case 'pending':
        return 'badge-pending';
      default:
        return 'badge-pending';
    }
  };

  const getStageBadgeClass = (stage: string) => {
    switch (stage) {
      case 'principal':
        return 'bg-purple-50 text-purple-700';
      case 'president':
        return 'bg-red-50 text-red-700';
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'rejected':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="card">
      <div className="flex items-start gap-3 mb-4">
        <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{file.title}</h3>
          <p className="text-sm text-gray-500 truncate">{file.file_name}</p>
        </div>
      </div>

      {file.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{file.description}</p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex flex-wrap gap-2">
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(file.status)}`}>
            {file.status === 'pending' ? 'Pending' : file.status === 'approved' ? 'Approved' : 'Rejected'}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStageBadgeClass(file.current_stage)}`}>
            {file.current_stage === 'principal' && 'With Principal'}
            {file.current_stage === 'president' && 'With President'}
            {file.current_stage === 'completed' && 'Completed'}
            {file.current_stage === 'rejected' && 'Rejected'}
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Uploaded {formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}
      </p>

      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors font-medium text-sm"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
        <a
          href={file.file_url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors font-medium text-sm"
        >
          <Download className="w-4 h-4" />
          Download
        </a>
      </div>

      {showActions && (onApprove || onReject) && (
        <div className="flex gap-2 mt-3">
          {onApprove && (
            <button
              onClick={onApprove}
              className="flex-1 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors font-medium text-sm"
            >
              Approve
            </button>
          )}
          {onReject && (
            <button
              onClick={onReject}
              className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors font-medium text-sm"
            >
              Reject
            </button>
          )}
        </div>
      )}
    </div>
  );
}
