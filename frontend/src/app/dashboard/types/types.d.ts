export interface URLSListProps {
  id: number | string | any;
  url: string;
  expiration_date: string;
  user_id: string;
}

export interface DBResponse {
  ok: boolean;
  title: string;
  description?: string;
}
