export type UserRole = 'staff' | 'principal' | 'president';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type FileStage = 'principal' | 'president' | 'completed' | 'rejected';
export type FileStatus = 'pending' | 'approved' | 'rejected';

export interface FileRecord {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_name: string;
  created_by: string;
  current_stage: FileStage;
  status: FileStatus;
  created_at: string;
  updated_at: string;
}

export type ApprovalAction = 'uploaded' | 'approved' | 'rejected';

export interface ApprovalHistory {
  id: string;
  file_id: string;
  action_by: string;
  role: UserRole;
  action: ApprovalAction;
  remark?: string;
  created_at: string;
}

export interface UploadedFile extends FileRecord {
  storedBy?: Profile;
  approvalHistory?: ApprovalHistory[];
}

export interface AuthUser {
  id: string;
  email: string;
}
