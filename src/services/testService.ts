import { TestEmployabilite, CreateTestEmployabiliteDto, UpdateTestEmployabiliteDto, ResultatTest, CreateResultatTestDto } from '../models/test';
import { callApi } from './api';

// --- Test Service Functions ---

export const testService = {
  // Get all tests
  getAllTests: async (token?: string): Promise<TestEmployabilite[]> => {
    return callApi<TestEmployabilite[]>('/tests', 'GET', undefined, token);
  },

  // Get test by ID
  getTestById: async (id: number, token?: string): Promise<TestEmployabilite> => {
    return callApi<TestEmployabilite>(`/tests/${id}`, 'GET', undefined, token);
  },

  // Create a new test
  createTest: async (testData: CreateTestEmployabiliteDto, token?: string): Promise<TestEmployabilite> => {
    return callApi<TestEmployabilite>('/tests', 'POST', testData, token);
  },

  // Update an existing test
  updateTest: async (id: number, testData: UpdateTestEmployabiliteDto, token?: string): Promise<TestEmployabilite> => {
    return callApi<TestEmployabilite>(`/tests/${id}`, 'PUT', testData, token);
  },

  // Delete a test
  deleteTest: async (id: number, token?: string): Promise<void> => {
    return callApi<void>(`/tests/${id}`, 'DELETE', undefined, token);
  },

  // --- Test Results Functions ---

  // Get all results for a specific test
  getResultsByTestId: async (testId: number, token?: string): Promise<ResultatTest[]> => {
    return callApi<ResultatTest[]>(`/tests/${testId}/results`, 'GET', undefined, token);
  },

  // Get a specific result
  getResultById: async (id: number, token?: string): Promise<ResultatTest> => {
    return callApi<ResultatTest>(`/results/${id}`, 'GET', undefined, token);
  },

  // Create a new test result
  createResult: async (resultData: CreateResultatTestDto, token?: string): Promise<ResultatTest> => {
    return callApi<ResultatTest>('/results', 'POST', resultData, token);
  },

  // Update an existing test result
  updateResult: async (id: number, resultData: Partial<ResultatTest>, token?: string): Promise<ResultatTest> => {
    return callApi<ResultatTest>(`/results/${id}`, 'PUT', resultData, token);
  },

  // Delete a test result
  deleteResult: async (id: number, token?: string): Promise<void> => {
    return callApi<void>(`/results/${id}`, 'DELETE', undefined, token);
  },
};
