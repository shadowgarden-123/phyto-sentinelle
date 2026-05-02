import React from 'react';
import AppLayout from '@/components/AppLayout';
import RiskMapScreen from './components/RiskMapScreen';

export default function RiskMapPage() {
  return (
    <AppLayout role="CPI" alertCount={7} fullScreen showBottomNav>
      <RiskMapScreen />
    </AppLayout>
  );
}
