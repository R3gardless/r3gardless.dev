import { resolve as pathResolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const __filename = fileURLToPath(import.meta.url);
const dirname = pathResolve(__filename, '..');

// More info at: https://storybook.js.org/docs/writing-tests/test-addon
export default defineConfig({
  resolve: {
    alias: {
      '@': pathResolve(dirname, './src'),
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
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
    workspace: [
      // Unit 테스트 (기존 .test.tsx 파일들)
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/**/*.stories.test.{ts,tsx}'],
          globals: true,
        },
      },
      // Storybook 테스트 (.stories.tsx 파일들)
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/writing-tests/test-addon#storybooktest
          storybookTest({ configDir: pathResolve(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          globals: true,
          browser: {
            enabled: true,
            headless: true,
            name: 'chromium',
            provider: 'playwright',
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
