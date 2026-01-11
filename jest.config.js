/**
 * Jest設定ファイル
 * Next.js + TypeScript + React Testing Library用
 */
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // next.config.jsとテスト環境の.envファイルを読み込むためのパス
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  // テスト環境の設定
  testEnvironment: 'jest-environment-jsdom',

  // セットアップファイル
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // モジュール名のエイリアス設定（tsconfig.jsonのpathsと合わせる）
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  // テストファイルのパターン
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // カバレッジ設定
  collectCoverageFrom: [
    'features/**/*.{js,jsx,ts,tsx}',
    'hooks/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],

  // テスト対象外のパス
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/out/',
  ],

  // TypeScriptのトランスフォーム設定
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
};

module.exports = createJestConfig(customJestConfig);
