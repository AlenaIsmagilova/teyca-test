export interface ISendPushRequest {
  userIds: string;
  push_message: string;
  date_start?: string;
}

export interface ISendPushResponse {
  users_count: number;
  message_id: number;
}
