import React, { useState } from 'react';
import { MapPin, Camera } from 'lucide-react';
import { Button } from './ui/Button';
import { Label } from './ui/Label';
import { RadioGroup, RadioGroupItem } from './ui/RadioGroup';
import { useLanguage } from '../context/LanguageContext';

export const TicketForm = ({ machine, onSubmit, onCancel }) => {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit({ description, priority });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base font-bold">{t('machineDetails')}</Label>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-lg font-bold">{machine.name}</div>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-3 w-3" />
            {machine.location}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-bold">{t('describeIssue')}</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('whatsWrong')}
          className="min-h-[120px] w-full rounded-lg border border-slate-200 bg-white p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-950"
          required
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-bold">{t('priorityLevel')}</Label>
        <div className="flex flex-wrap gap-3">
          {[
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
            { value: 'critical', label: 'Critical' },
          ].map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                priority === p.value
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-base font-bold">{t('attachPhoto')}</Label>
        <div className="flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
          <Camera className="mb-2 h-8 w-8 text-slate-400" />
          <p className="text-sm text-slate-500">{t('tapToPhoto')}</p>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit" variant="destructive" className="flex-1">
          {t('submitTicket')}
        </Button>
      </div>
    </form>
  );
};
