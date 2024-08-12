'use client';

import { DB } from '@atdb/types';

export const PRIORITY_COLORS = {
  [DB.Priority.High]: 'destructive',
  [DB.Priority.Medium]: 'imperative',
  [DB.Priority.Low]: 'constructive',
} as const satisfies Record<DB.Priority, string>;

export const downloadFile = (orderId: number, fileUrl?: string) => {
  if (!fileUrl) return;
  fetch(fileUrl, {
    method: 'GET',
    headers: {},
  })
    .then((response) => {
      response.arrayBuffer().then(function (buffer) {
        const url = window.URL.createObjectURL(new Blob([buffer]));
        const link = document.createElement('a');
        link.href = url;
        const fileName = fileUrl.split('@')[0].split('/').at(-1);
        link.setAttribute('download', `${orderId}_attachment_${fileName}`);
        document.body.appendChild(link);
        link.click();
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

interface MonthsParams {
  locale?: string;
  format?: Intl.DateTimeFormatOptions['month'];
}

export function getAllMonths({ locale = 'en-US', format = 'long' }: MonthsParams = {}) {
  const applyFormat = new Intl.DateTimeFormat(locale, { month: format }).format;
  return [...Array(12).keys()].map((m) => applyFormat(new Date(2021, m)));
}

export function autoRefresh(refreshFunc: () => void | Promise<void>, refreshInterval: number) {
  let interval: NodeJS.Timer | undefined;
  let timeOut: NodeJS.Timeout | undefined;
  let lastFetchTime = Date.now();
  let fetching = false;
  const timestampedRefreshFunc = async () => {
    fetching = true;
    await refreshFunc();
    lastFetchTime = Date.now();
    fetching = false;
  };
  timestampedRefreshFunc();

  const startInterval = () => {
    interval = setInterval(timestampedRefreshFunc, refreshInterval);
  };

  const stopInterval = () => {
    if (interval) {
      clearInterval(interval);
    }
  };

  const handleVisibilityChange = () => {
    if (!document.hidden) {
      if (fetching) return;
      clearTimeout(timeOut);
      const timeSinceLastFetch = Date.now() - lastFetchTime;
      if (timeSinceLastFetch >= refreshInterval) {
        timestampedRefreshFunc();
        startInterval();
      } else {
        timeOut = setTimeout(() => {
          timestampedRefreshFunc();
          startInterval();
        }, refreshInterval - timeSinceLastFetch);
      }
    } else {
      stopInterval();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  if (document.visibilityState === 'visible') {
    startInterval();
  }

  return () => {
    stopInterval();
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}
