import { mockResponse } from "./mockClient";
import type { AuthUser } from "@/src/context/AuthContext";

const MOCK_SCHOOL_USER: AuthUser = {
  id: "usr-001",
  name: "John Okonkwo",
  email: "john@greenfieldacademy.com",
  role: "school_admin",
  schoolId: "sch-001",
  subdomain: "greenfield",
};

const MOCK_PARENT_USER: AuthUser = {
  id: "par-001",
  name: "John Okafor",
  phone: "+234 801 234 5678",
  role: "parent",
};

const MOCK_ADMIN_USER: AuthUser = {
  id: "admin-001",
  name: "Platform Admin",
  email: "admin@schoolflow.com",
  role: "super_admin",
};

export const loginStaff = async (_payload: { email: string; password: string }) => {
  return mockResponse(MOCK_SCHOOL_USER);
};

export const requestOtp = async (_payload: { phone: string }) => {
  return mockResponse({ message: "OTP sent to WhatsApp" });
};

export const verifyOtp = async (_payload: { phone: string; otp: string }) => {
  return mockResponse(MOCK_PARENT_USER);
};

export const loginPlatformAdmin = async (_payload: { email: string; password: string }) => {
  return mockResponse(MOCK_ADMIN_USER);
};

export const registerSchool = async (_payload: unknown) => {
  return mockResponse({ message: "Registration successful. Check your email." });
};

export const verifyEmail = async (_token: string) => {
  return mockResponse({ message: "Email verified successfully." });
};

export const checkSubdomain = async (_subdomain: string) => {
  return mockResponse(true);
};

export const activateInvite = async (_token: string, _pin: string) => {
  return mockResponse(MOCK_PARENT_USER);
};

export const getMe = async (): Promise<AuthUser> => {
  return mockResponse(MOCK_SCHOOL_USER);
};

export const logout = () => {
  window.location.href = "/login";
};
