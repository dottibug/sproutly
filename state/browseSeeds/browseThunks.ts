import { Dispatch } from 'react';
import { BrowseSeedAction } from './browseTypes';
import { fetchCatalog } from './browseQueries';
import { getBrowseCache, setBrowseCache } from './browseCache';

// Load the catalog from the database. Show cached first (if any). Then fetch from database to update the cache. If offline, shows cached catalog.
export async function runLoadCatalog(dispatch: Dispatch<BrowseSeedAction>): Promise<void> {
  const cached = await getBrowseCache();

  if (cached && cached.length > 0) dispatch({ type: 'LOAD_SUCCESS', payload: cached });
  else dispatch({ type: 'LOAD_START', payload: null });

  try {
    const fresh = await fetchCatalog();
    await setBrowseCache(fresh);
    dispatch({ type: 'LOAD_SUCCESS', payload: fresh });
  } catch (error) {
    console.error('Error loading catalog: ', error);
    dispatch({ type: 'LOAD_ERROR', payload: 'Failed to load catalog' });
  }
}
