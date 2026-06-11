export interface ActionItem {
  text: string;
  assignee?: string;
  due_date?: string;
}

export interface Meeting {
  id: string;
  title: string;
  transcript: string;
  summary?: string;
  action_items: ActionItem[];
  created_at: string;
  updated_at: string;
}

export interface MeetingListItem {
  id: string;
  title: string;
  summary?: string;
  action_items: ActionItem[];
  created_at: string;
}

export interface QuestionResponse {
  answer: string;
}
