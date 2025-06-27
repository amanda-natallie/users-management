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
  name: string;
  job: string;
}

export interface CreateUserResponse {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}

export interface UpdateUserPayload {
  name: string;
  job: string;
}

export interface UpdateUserResponse {
  name: string;
  job: string;
  updatedAt: string;
}
