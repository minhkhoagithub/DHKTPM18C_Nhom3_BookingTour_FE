import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserInfo, getToken } from '../services/authService';

/**
 * Protected route component for staff only
 * Kiểm tra xem user có token và role STAFF không
 * Nếu không, chuyển hướng đến /staff/login
 */
export function PrivateStaffRoute({ children }) {
  const token = getToken();
  const userInfo = getUserInfo();

  // Kiểm tra token tồn tại
  if (!token) {
    console.warn("⚠️ Không có token, chuyển hướng sang /staff/login");
    return <Navigate to="/staff/login" replace />;
  }

  // Kiểm tra user info tồn tại
  if (!userInfo) {
    console.warn("⚠️ Không có user info, chuyển hướng sang /staff/login");
    return <Navigate to="/staff/login" replace />;
  }

  // Kiểm tra role là STAFF
  if (userInfo.role !== 'STAFF') {
    console.warn("⚠️ Không phải staff (role:", userInfo.role + "), chuyển hướng sang /staff/login");
    return <Navigate to="/staff/login" replace />;
  }

  // Nếu tất cả điều kiện đáp ứng, render component
  return children;
}

/**
 * Protected route component cho customer
 */
export function PrivateCustomerRoute({ children }) {
  const token = getToken();
  const userInfo = getUserInfo();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (userInfo.role !== 'CUSTOMER') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * Protected route component cho admin
 */
export function PrivateAdminRoute({ children }) {
  const token = getToken();
  const userInfo = getUserInfo();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (userInfo.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return children;
}
