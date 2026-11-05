import { useCallback, useEffect, useState } from 'react';

// Loads data once when the page opens. Gives you { data, loading, error, refetch }.
// Pass a function that never changes, like getHoldings. A new inline function every render would reload forever.
export default function useApi(fetcher) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    return fetcher()
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => setState({ data: null, loading: false, error: err.message }));
  }, [fetcher]);

  useEffect(() => { load(); }, [load]);

  return { ...state, refetch: load };
}
