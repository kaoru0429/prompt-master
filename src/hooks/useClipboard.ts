import { useState, useEffect, useCallback } from 'react';

export const useClipboard = (timeout = 2000) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (copied) {
      timer = setTimeout(() => setCopied(false), timeout);
    }
    return () => clearTimeout(timer);
  }, [copied, timeout]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      return true;
    } catch (err) {
      console.error('Copy failed', err);
      return false;
    }
  }, []);

  return { copied, copyToClipboard };
};
