const API_URL = "http://localhost:5000/api/users";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    token: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    name: string;
    email: string;
  };
};

// Login
export const loginUser = async (
  loginData: LoginData
): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

// Register
export const registerUser = async (
  registerData: RegisterData
): Promise<RegisterResponse> => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};