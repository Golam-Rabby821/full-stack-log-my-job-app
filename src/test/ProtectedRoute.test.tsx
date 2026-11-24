import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to /login', () => {
    localStorage.clear();
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Private Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Private Dashboard')).not.toBeInTheDocument();
  });

  it('renders protected content when authenticated', () => {
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'Jane', email: 'jane@example.com' }));

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Private Dashboard</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText('Private Dashboard')).toBeInTheDocument();
    localStorage.clear();
  });
});
