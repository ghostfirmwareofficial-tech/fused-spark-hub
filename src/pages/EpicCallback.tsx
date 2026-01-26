import { useEffect } from 'react';

export default function EpicCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');
    const state = params.get('state');

    // Verify state matches
    const storedState = sessionStorage.getItem('epic_oauth_state');
    
    if (error) {
      window.opener?.postMessage({
        type: 'epic-oauth-callback',
        error: error,
      }, window.location.origin);
    } else if (code) {
      if (state !== storedState) {
        window.opener?.postMessage({
          type: 'epic-oauth-callback',
          error: 'State mismatch - possible CSRF attack',
        }, window.location.origin);
      } else {
        window.opener?.postMessage({
          type: 'epic-oauth-callback',
          code: code,
        }, window.location.origin);
      }
    }

    // Clean up
    sessionStorage.removeItem('epic_oauth_state');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-muted-foreground">Connecting Epic Games account...</p>
      </div>
    </div>
  );
}
