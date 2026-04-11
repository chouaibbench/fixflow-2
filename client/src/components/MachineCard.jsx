import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MapPin, Clock, MoreVertical, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { useLanguage } from '../context/LanguageContext';

export const MachineCard = ({ machine, onReport }) => {
  const { t } = useLanguage();
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight">{machine.name}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {machine.location}
          </CardDescription>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-50 p-1 dark:bg-slate-900">
          <QRCodeSVG value={machine.id} size={40} />
        </div>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Clock className="h-4 w-4" />
          {t('lastMaintenance')}: {machine.last_maintenance ? new Date(machine.last_maintenance).toLocaleDateString() : t('never')}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <Button
          variant="primary"
          className="w-full bg-red-600 hover:bg-red-700"
          onClick={() => onReport(machine)}
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          {t('reportIssue')}
        </Button>
        <Button variant="outline" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
