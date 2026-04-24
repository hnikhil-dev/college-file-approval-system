import { supabase } from './supabaseClient';
import { Profile, FileRecord, ApprovalHistory } from '@/types';

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

export async function signUp(email: string, password: string, name: string, role: string = 'staff') {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

// ============================================
// FILE FUNCTIONS
// ============================================

export async function uploadFile(
  title: string,
  description: string,
  file: File,
  createdBy: string
) {
  // Upload file to Supabase Storage
  const fileName = `${createdBy}/${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('documents')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: publicUrl } = supabase.storage
    .from('documents')
    .getPublicUrl(fileName);

  // Create file record in database
  const { data: fileData, error: fileError } = await supabase
    .from('files')
    .insert({
      title,
      description,
      file_url: publicUrl.publicUrl,
      file_name: file.name,
      created_by: createdBy,
      current_stage: 'principal',
      status: 'pending',
    })
    .select()
    .single();

  if (fileError) throw fileError;

  // Create approval history
  const { error: historyError } = await supabase
    .from('approval_history')
    .insert({
      file_id: fileData.id,
      action_by: createdBy,
      action: 'uploaded',
      role: 'staff',
    });

  if (historyError) throw historyError;

  return fileData;
}

export async function getFilesByRole(role: string, userId: string): Promise<FileRecord[]> {
  let query = supabase.from('files').select('*');

  if (role === 'staff') {
    // Staff sees only their own files
    query = query.eq('created_by', userId);
  } else if (role === 'principal') {
    // Principal sees files in principal stage or beyond
    query = query.in('current_stage', ['principal', 'president', 'completed', 'rejected']);
  } else if (role === 'president') {
    // President sees files in president stage or beyond
    query = query.in('current_stage', ['president', 'completed', 'rejected']);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function getFileById(fileId: string): Promise<FileRecord | null> {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('id', fileId)
    .single();

  if (error) {
    console.error('Error fetching file:', error);
    return null;
  }

  return data;
}

export async function getApprovalHistory(fileId: string): Promise<ApprovalHistory[]> {
  const { data, error } = await supabase
    .from('approval_history')
    .select('*')
    .eq('file_id', fileId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

// ============================================
// PRINCIPAL FUNCTIONS
// ============================================

export async function approveByPrincipal(fileId: string, principalId: string, remark?: string) {
  const { data: fileData } = await supabase
    .from('files')
    .update({
      current_stage: 'president',
      status: 'pending', // pending final approval from president
      updated_at: new Date().toISOString(),
    })
    .eq('id', fileId)
    .select()
    .single();

  // Create approval history
  const { error: historyError } = await supabase
    .from('approval_history')
    .insert({
      file_id: fileId,
      action_by: principalId,
      role: 'principal',
      action: 'approved',
      remark,
    });

  if (historyError) throw historyError;

  return fileData;
}

export async function rejectByPrincipal(fileId: string, principalId: string, remark: string) {
  const { data: fileData } = await supabase
    .from('files')
    .update({
      status: 'rejected',
      current_stage: 'rejected', // Rejected files go to the rejected stage
      updated_at: new Date().toISOString(),
    })
    .eq('id', fileId)
    .select()
    .single();

  // Create approval history
  const { error: historyError } = await supabase
    .from('approval_history')
    .insert({
      file_id: fileId,
      action_by: principalId,
      role: 'principal',
      action: 'rejected',
      remark,
    });

  if (historyError) throw historyError;

  return fileData;
}

// ============================================
// PRESIDENT FUNCTIONS
// ============================================

export async function approveByPresident(fileId: string, presidentId: string, remark?: string) {
  const { data: fileData } = await supabase
    .from('files')
    .update({
      current_stage: 'completed',
      status: 'approved',
      updated_at: new Date().toISOString(),
    })
    .eq('id', fileId)
    .select()
    .single();

  // Create approval history
  const { error: historyError } = await supabase
    .from('approval_history')
    .insert({
      file_id: fileId,
      action_by: presidentId,
      role: 'president',
      action: 'approved',
      remark,
    });

  if (historyError) throw historyError;

  return fileData;
}

export async function rejectByPresident(fileId: string, presidentId: string, remark: string) {
  const { data: fileData } = await supabase
    .from('files')
    .update({
      status: 'rejected',
      current_stage: 'rejected',
      updated_at: new Date().toISOString(),
    })
    .eq('id', fileId)
    .select()
    .single();

  // Create approval history
  const { error: historyError } = await supabase
    .from('approval_history')
    .insert({
      file_id: fileId,
      action_by: presidentId,
      role: 'president',
      action: 'rejected',
      remark,
    });

  if (historyError) throw historyError;

  return fileData;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export async function getFileWithHistory(fileId: string) {
  const file = await getFileById(fileId);
  if (!file) return null;

  const history = await getApprovalHistory(fileId);
  const creator = await getUserProfile(file.created_by);

  return {
    ...file,
    storedBy: creator,
    approvalHistory: history,
  };
}

export async function getAllUsers(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*');

  if (error) throw error;
  return data || [];
}

export async function updateUserRole(userId: string, role: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) throw error;
  return data;
}
