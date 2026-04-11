import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';

const emptyForm = { name: '', email: '', password: '', role: 'worker' };

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await api.get('/users');
      setUsers(data);
    } catch { toast.error('Failed to load users'); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const payload = { name: form.name, email: form.email, role: form.role };
        if (form.password) payload.password = form.password;
        await api.put(`/users/${editingId}`, payload);
        toast.success('User updated');
      } else {
        await api.post('/users', form);
        toast.success('User created');
      }
      setForm(emptyForm); setEditingId(null); setShowForm(false);
      fetchUsers();
    } catch (err) { toast.error(err.message || 'Something went wrong'); }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    setEditingId(user.id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) { toast.error(err.message || 'Failed to delete user'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">User Management</h2>
        <Button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <input required placeholder="Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
              <input required type="email" placeholder="Email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
              <input type="password" placeholder={editingId ? 'New password (optional)' : 'Password'}
                value={form.password} required={!editingId}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:bg-slate-800 dark:border-slate-600 dark:text-white">
                <option value="worker">Worker</option>
                <option value="technician">Technician</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit">{editingId ? 'Update' : 'Save'}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-3 font-medium">{u.name}</td>
                  <td className="py-3 text-slate-500">{u.email}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'technician' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-xs font-medium">
                      <span className={`h-2 w-2 rounded-full ${u.is_online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      {u.is_online ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(u)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(u.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
