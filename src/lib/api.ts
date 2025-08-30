// api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

let refreshing = false;

type PendingRequest = {
  resolve: (value: AxiosResponse | PromiseLike<AxiosResponse>) => void;
  reject: (reason?: unknown) => void;
};
let queue: PendingRequest[] = [];

function runQueue(err?: unknown) {
  queue.forEach((p) => (err ? p.reject(err) : p.resolve(Promise.resolve({} as AxiosResponse))));
  queue = [];
}

api.interceptors.response.use(
  (r) => r,
  async (error: unknown) => {
    // Only handle Axios errors
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;

      if (!refreshing) {
        refreshing = true;
        try {
          await api.post("/api/auth/refresh");
          runQueue();
        } catch (e) {
          runQueue(e);
        } finally {
          refreshing = false;
        }
      }

      return new Promise<AxiosResponse>((resolve, reject) => {
        queue.push({
          resolve: () => resolve(api(original)),
          reject,
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
