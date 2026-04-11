import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMachines } from '../../context/MachineContext';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';

const emptyForm = { name: '', location: '', last_maintenance: '' };

export const MachinesPage = () => {
  const { machines, addMachine, updateMachine, deleteMachine } = useMachines();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMachine(editingId, form);
        toast.success('Machine updated');
      } else {
        await addMachine(form);
        toast.success('Machine added');
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleEdit = (machine) => {
    setForm({ name: machine.name, location: machine.location, last_maintenance: machine.last_maintenance ?? '' });
    setEditingId(machine.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this machine?')) return;
    await deleteMachine(id);
    toast.success('Machine deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Machines</h2>
        <Button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Machine
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
              <input required placeholder="Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
              <input required placeholder="Location" value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
              <input type="date" value={form.last_maintenance}
                onChange={(e) => setForm({ ...form, last_maintenance: e.target.value })}
                className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:bg-slate-800 dark:border-slate-600 dark:text-white" />
              <div className="flex gap-2 sm:col-span-3">
                <Button type="submit">{editingId ? 'Update' : 'Save'}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {machines.map((m) => (
          <Card key={m.id}>
            <CardContent className="pt-6 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold">{m.name}</p>
                  <p className="text-sm text-slate-500">{m.location}</p>
                  <p className="text-xs text-slate-400">Last maintenance: {m.last_maintenance ?? 'N/A'}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(m)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(m.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
