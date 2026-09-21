import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Cpu, UserCheck } from 'lucide-react';

export const StatusBadge = ({ status, className = '' }) => {
  const norm = (status || '').toUpperCase();

  if (norm === 'BOARDED' || norm === 'CONFIRMED' || norm === 'VERIFIED') {
    return (
      <span className={`badge badge-success ${className}`}>
        <CheckCircle2 size={12} />
        {norm === 'BOARDED' ? 'Boarded' : norm === 'CONFIRMED' ? 'Confirmed' : 'Verified'}
      </span>
    );
  }

  if (norm === 'STATION_ENTERED' || norm === 'STATION ENTRY VERIFIED') {
    return (
      <span className={`badge badge-primary ${className}`}>
        <UserCheck size={12} />
        Station Entry
      </span>
    );
  }

  if (norm === 'PENDING' || norm.includes('RAC')) {
    return (
      <span className={`badge badge-warning ${className}`}>
        <Clock size={12} />
        {norm.includes('RAC') ? status : 'Pending Boarding'}
      </span>
    );
  }

  if (norm === 'NO_SHOW' || norm === 'NO SHOW' || norm.includes('WL') || norm === 'CANCELLED') {
    return (
      <span className={`badge badge-danger ${className}`}>
        <XCircle size={12} />
        {norm === 'NO_SHOW' ? 'No-Show' : status}
      </span>
    );
  }

  if (norm === 'AUTO_ALLOCATED' || norm === 'AI ALLOCATED') {
    return (
      <span className={`badge badge-ai ${className}`}>
        <Cpu size={12} />
        AI Allocated
      </span>
    );
  }

  return (
    <span className={`badge badge-primary ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
