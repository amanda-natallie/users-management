export interface UserItem {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface GetUsersResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: UserItem[];
  support: {
    url: string;
    text: string;
  };
}

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
}

export interface CreateUserResponse {
  first_name: string;
  last_name: string;
  email: string;
  id: string;
  createdAt: string;
}

export interface UpdateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
}

export interface UpdateUserResponse {
  first_name: string;
  last_name: string;
  email: string;
  id: string;
  updatedAt: string;
}
