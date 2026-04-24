import { X, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ApprovalModalProps {
  fileName: string;
  action: 'approve' | 'reject';
  onClose: () => void;
  onConfirm: (remark: string) => Promise<void>;
}

export default function ApprovalModal({ fileName, action, onClose, onConfirm }: ApprovalModalProps) {
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);

  const isApprove = action === 'approve';
  const title = isApprove ? 'Approve File' : 'Reject File';
  const icon = isApprove ? CheckCircle : XCircle;
  const buttonClass = isApprove
    ? 'bg-green-600 hover:bg-green-700'
    : 'bg-red-600 hover:bg-red-700';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isApprove && !remark.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    try {
      await onConfirm(remark);
      toast.success(isApprove ? 'File approved successfully!' : 'File rejected successfully!');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to process action');
    } finally {
      setLoading(false);
    }
  };

  const Icon = icon;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Icon and Message */}
          <div className="text-center py-4">
            <Icon className={`w-12 h-12 mx-auto mb-4 ${isApprove ? 'text-green-600' : 'text-red-600'}`} />
            <p className="text-gray-600 mb-2">Are you sure you want to</p>
            <p className="font-bold text-gray-900">
              {isApprove ? 'Approve' : 'Reject'} this file?
            </p>
            <p className="text-sm text-gray-500 mt-2 break-words">"{fileName}"</p>
          </div>

          {/* Remark (required for rejection) */}
          {!isApprove && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Rejection *
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Explain why you are rejecting this file..."
                rows={4}
                className="input-field resize-none"
                disabled={loading}
              />
            </div>
          )}

          {/* Remark (optional for approval) */}
          {isApprove && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Remarks (Optional)
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Add any comments..."
                rows={3}
                className="input-field resize-none"
                disabled={loading}
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!isApprove && !remark.trim())}
              className={`flex-1 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${buttonClass}`}
            >
              {loading ? 'Processing...' : isApprove ? 'Approve' : 'Reject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
