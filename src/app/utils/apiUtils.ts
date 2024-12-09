import axios, { AxiosRequestConfig } from "axios";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const isClient = typeof window !== "undefined";
const sessionUser = isClient ? sessionStorage.getItem("user") : null;
const getHeaders = () => {
    return {
      "Content-Type": "application/json",
      "x-api-key": sessionUser ? JSON.parse(sessionUser).user.user_metadata.apiKey : "",
    };
  };

const postRequest = async (endpoint: string, data: any) => {
  const config: AxiosRequestConfig = {
    headers: getHeaders(),
  };
  return axios.post(`${baseUrl}${endpoint}`, data, config);
};

const getRequest = async (endpoint: string) => {
  const config: AxiosRequestConfig = {
    headers: getHeaders(),
  };
  return axios.get(`${baseUrl}${endpoint}`, config);
};

const putRequest = async (endpoint: string, data: any) => {
  const config: AxiosRequestConfig = {
    headers: getHeaders(),
  };
  return axios.put(`${baseUrl}${endpoint}`, data, config);
};

const deleteRequest = async (endpoint: string) => {
  const config: AxiosRequestConfig = {
    headers: getHeaders(),
  };
  return axios.delete(`${baseUrl}${endpoint}`, config);
};

export { postRequest, getRequest, putRequest, deleteRequest };
