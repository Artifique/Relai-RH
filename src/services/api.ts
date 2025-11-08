const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export async function callApi<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  token?: string
): Promise<T> {
  const fullUrl = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {};
  let requestBody: BodyInit | undefined;

  if (body instanceof FormData) {
    requestBody = body;
    // Do not set Content-Type header for FormData, browser will set it automatically with boundary
  } else if (body) {
    headers['Content-Type'] = 'application/json';
    requestBody = JSON.stringify(body);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(fullUrl, {
    method,
    headers,
    body: requestBody,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }

  return response.json();
}
