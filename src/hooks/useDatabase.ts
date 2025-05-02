
import { useState, useCallback } from 'react';
import { db } from '../lib/db';

/**
 * A custom hook for interacting with the IndexedDB database
 * Provides methods for common database operations with error handling
 */
export function useDatabase() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Generic method to fetch data from any table
   */
  const fetchData = useCallback(async <T>(
    tableName: keyof typeof db,
    id?: number
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = id 
        ? await db[tableName].get(id) as T
        : null;
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error(`Error fetching data from ${tableName}:`, error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch all records from a table
   */
  const fetchAll = useCallback(async <T>(
    tableName: keyof typeof db,
    filter?: (item: any) => boolean
  ): Promise<T[]> => {
    setIsLoading(true);
    setError(null);
    try {
      let items = await db[tableName].toArray();
      if (filter) {
        items = items.filter(filter);
      }
      return items as T[];
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error(`Error fetching all data from ${tableName}:`, error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add a new record to a table
   */
  const addRecord = useCallback(async <T>(
    tableName: keyof typeof db, 
    data: any
  ): Promise<number | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const id = await db[tableName].add(data);
      return id;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error(`Error adding record to ${tableName}:`, error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update an existing record in a table
   */
  const updateRecord = useCallback(async (
    tableName: keyof typeof db,
    id: number,
    data: any
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await db[tableName].update(id, data);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error(`Error updating record in ${tableName}:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete a record from a table
   */
  const deleteRecord = useCallback(async (
    tableName: keyof typeof db,
    id: number
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await db[tableName].delete(id);
      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error(`Error deleting record from ${tableName}:`, error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchData,
    fetchAll,
    addRecord,
    updateRecord,
    deleteRecord,
    isLoading,
    error,
  };
}
