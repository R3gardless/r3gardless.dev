import { resolve as pathResolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const dirname = pathResolve(__filename, '..');

export default defineConfig({
  resolve: {
    alias: {
      '@': pathResolve(dirname, './src'),
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        '**/*.stories.{ts,tsx}', // Storybook 파일 제외
        '**/index.{ts,tsx}',     // 단순 export 파일 제외
        '**/*.test.{ts,tsx}',    // 테스트 파일 제외
        '**/*.d.ts',             // 타입 정의 파일 제외
        'coverage/**',
        'dist/**',
        '**/node_modules/**',
        'src/app/**',            // Next.js app 라우터 파일 제외 (페이지 컴포넌트)
      ],
      include: ['src/**/*.{ts,tsx}'],
    },
    // Unit 테스트만 유지
    name: 'unit',
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['src/**/*.stories.test.{ts,tsx}'],
    globals: true,
  },
});
