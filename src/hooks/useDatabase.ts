
import { useState, useCallback } from 'react';
import { db, ParaPalDatabase } from '../lib/db';
import { Table } from 'dexie';

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
    tableName: keyof ParaPalDatabase,
    id?: number
  ): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    try {
      if (!id) return null;
      
      // Access the table as a Table<T> and then use its methods
      const table = db[tableName] as unknown as Table<T, number>;
      const result = await table.get(id);
      return result || null;
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
    tableName: keyof ParaPalDatabase,
    filter?: (item: T) => boolean
  ): Promise<T[]> => {
    setIsLoading(true);
    setError(null);
    try {
      // Access the table as a Table<T> and then use its methods
      const table = db[tableName] as unknown as Table<T, number>;
      let items = await table.toArray();
      
      if (filter) {
        items = items.filter(filter);
      }
      return items;
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
    tableName: keyof ParaPalDatabase, 
    data: T
  ): Promise<number | null> => {
    setIsLoading(true);
    setError(null);
    try {
      // Access the table as a Table<T> and then use its methods
      const table = db[tableName] as unknown as Table<T, number>;
      const id = await table.add(data);
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
  const updateRecord = useCallback(async <T extends object>(
    tableName: keyof ParaPalDatabase,
    id: number,
    changes: Partial<T>
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      // Access the table as a Table<T> and then use its methods
      const table = db[tableName] as unknown as Table<T, number>;
      await table.update(id, changes as any);
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
    tableName: keyof ParaPalDatabase,
    id: number
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      // Access the table as a Table<T> and then use its methods
      const table = db[tableName] as unknown as Table<any, number>;
      await table.delete(id);
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
