import React from 'react';
import AppLayout from '@/components/AppLayout';
import AlertsScreen from './components/AlertsScreen';

export default function AlertsManagementPage() {
  return (
    <AppLayout role="CPI" alertCount={7} showBottomNav>
      <AlertsScreen />
    </AppLayout>
  );
}
