export function authToken(): string {
  return localStorage.getItem("authToken") || "";
}

export function setAuthToken(token?: string): void {
  if (!token) {
    localStorage.removeItem("authToken");
  } else {
    localStorage.setItem("authToken", token);
  }
}

export function purgatoryToken(): string {
  return localStorage.getItem("purgatoryToken") || "";
}

export function setPurgatoryToken(token?: string): void {
  if (!token) {
    localStorage.removeItem("purgatoryToken");
  } else {
    localStorage.setItem("purgatoryToken", token);
  }
}

export function baseUrl(): string {
  return localStorage.getItem("baseUrl") || "";
}

export function setBaseUrl(token?: string): void {
  if (!token) {
    localStorage.removeItem("baseUrl");
  } else {
    localStorage.setItem("baseUrl", token);
  }
}
