export interface EBDClassMemberJoinRequest {
  id: number;
  member_name: string;
  ebd_class_member_type: string;
  requested_by_name: string;
  request_date: string;
  status: 'pending' | 'approved' | 'rejected';
  manager_decision_date: string | null;
  manager_decision_reason: string | null;
  manager_name: string | null;
}

export interface MemberCurrentClass {
  id: number;
  name: string;
}

export interface MemberSearchResult {
  id: number;
  name: string;
  picture: string | null;
  current_class: MemberCurrentClass | null;
}
