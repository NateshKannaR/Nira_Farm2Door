'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type UserRole = 'FARMER' | 'FPO' | 'BUYER' | 'HUB_OPERATOR' | 'TRANSPORTER' | 'ADMIN';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  userId: string;
  userName: string;
  userPhone: string;
  fpoId?: string;
  loginAs: (role: UserRole, id: string, name: string, phone: string, fpoId?: string) => void;
  isDeveloperMode: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [role, setRoleState] = useState<UserRole>('FARMER');
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [fpoId, setFpoId] = useState<string | undefined>(undefined);

  // Sync role and user details with AuthContext whenever logged-in user changes
  useEffect(() => {
    if (user) {
      setRoleState(user.role || 'FARMER');
      setUserId(user.id);
      setUserName(user.name);
      if (user.phone) setUserPhone(user.phone);
    } else {
      setUserId('');
      setUserName('');
      setUserPhone('');
      setFpoId(undefined);
    }
  }, [user]);

  useEffect(() => {
    const savedRole = (localStorage.getItem('nira_role') || localStorage.getItem('kisanbandhan_role')) as UserRole;
    if (savedRole && !user) {
      setRoleState(savedRole);
    }
  }, [user]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('nira_role', newRole);

    if (!user) {
      setUserId('');
      setUserName('');
      setUserPhone('');
      setFpoId(undefined);
    }
  };

  const loginAs = (r: UserRole, id: string, name: string, phone: string, fpo?: string) => {
    setRoleState(r);
    setUserId(id);
    setUserName(name);
    setUserPhone(phone);
    setFpoId(fpo);
    localStorage.setItem('nira_role', r);
  };

  const isDeveloperMode = user?.role === 'ADMIN' || !!user?.email?.includes('dev') || !!user?.email?.includes('admin');

  return (
    <RoleContext.Provider
      value={{
        role: isDeveloperMode ? role : (user ? user.role : role),
        setRole,
        userId: user ? user.id : userId,
        userName: user ? user.name : userName,
        userPhone,
        fpoId,
        loginAs,
        isDeveloperMode,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
