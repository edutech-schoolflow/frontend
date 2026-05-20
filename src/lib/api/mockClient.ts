// Simulates network delay for mock API calls
export const mockDelay = (ms = 600) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Wraps mock data in a simulated API response
export async function mockResponse<T>(data: T, delayMs = 600): Promise<T> {
  await mockDelay(delayMs);
  return data;
}
