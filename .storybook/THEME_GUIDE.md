/**
 * @fileoverview Storybook 테마 시스템 사용 가이드
 * 
 * ## 🎨 Storybook에서 테마 관리
 * 
 * 이 프로젝트의 Storybook은 Zustand를 사용하여 라이트/다크 모드를 관리합니다.
 * 
 * ### 📋 설정된 기능
 * 
 * 1. **자동 테마 적용**: 모든 스토리에 현재 테마가 자동으로 적용됩니다
 * 2. **테마 토글 버튼**: 우측 하단에 고정된 토글 버튼으로 쉽게 테마 전환 가능
 * 3. **CSS 변수 연동**: `globals.css`의 CSS 변수 시스템과 완전 연동
 * 4. **실시간 미리보기**: 테마 변경 시 모든 컴포넌트가 즉시 업데이트
 * 
 * ### 🚀 사용법
 * 
 * 1. **Storybook 실행**:
 *    ```bash
 *    npm run storybook
 *    # 또는
 *    bun run storybook
 *    ```
 * 
 * 2. **테마 전환**: 우측 하단의 "Toggle 🌙 Dark" 또는 "Toggle ☀️ Light" 버튼 클릭
 * 
 * 3. **컴포넌트 테스트**: 각 스토리에서 라이트/다크 모드 모두에서 UI 확인
 * 
 * ### 🛠 개발자 가이드
 * 
 * #### 새로운 컴포넌트 스토리 작성 시:
 * 
 * ```typescript
 * // MyComponent.stories.tsx
 * import type { Meta, StoryObj } from '@storybook/react';
 * import { MyComponent } from './MyComponent';
 * 
 * const meta: Meta<typeof MyComponent> = {
 *   title: 'UI/MyComponent',
 *   component: MyComponent,
 *   // 테마는 자동으로 적용되므로 별도 설정 불필요
 * };
 * 
 * export default meta;
 * type Story = StoryObj<typeof meta>;
 * 
 * export const Default: Story = {
 *   args: {
 *     // props here
 *   },
 * };
 * 
 * // 다크 모드 전용 스토리가 필요한 경우
 * export const DarkMode: Story = {
 *   args: {
 *     // props here
 *   },
 *   decorators: [
 *     (Story) => {
 *       // 특정 스토리에서만 다크 모드 강제 적용
 *       useEffect(() => {
 *         document.documentElement.setAttribute('data-theme', 'dark');
 *       }, []);
 *       return <Story />;
 *     },
 *   ],
 * };
 * ```
 * 
 * #### CSS 변수 사용 예시:
 * 
 * ```typescript
 * // 컴포넌트에서 CSS 변수 사용
 * const MyComponent = () => (
 *   <div className="bg-[var(--color-background)] text-[var(--color-text)]">
 *     <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-clicked)]">
 *       테마 자동 적용 버튼
 *     </button>
 *   </div>
 * );
 * ```
 * 
 * ### 🔧 파일 구조
 * 
 * ```
 * .storybook/
 * ├── preview.ts          # 글로벌 데코레이터 및 설정
 * ├── components/
 * │   └── ThemeToggle.tsx # 테마 토글 버튼 컴포넌트
 * └── main.ts            # Storybook 메인 설정
 * ```
 * 
 * ### 💡 팁
 * 
 * - 모든 스토리는 자동으로 테마 시스템을 사용합니다
 * - CSS 변수를 사용하면 테마 전환이 자동으로 적용됩니다
 * - 특정 테마에서만 테스트하고 싶다면 토글 버튼을 사용하세요
 * - 컴포넌트가 두 테마 모두에서 잘 보이는지 확인하세요
 */
