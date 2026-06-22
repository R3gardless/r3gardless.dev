# Gemini Instructions

공통 지침은 [AGENTS.md](./AGENTS.md)를 따릅니다.
세부 작업 지침은 공용 agent skill인 [.agents/r3gardless-dev/SKILL.md](./.agents/r3gardless-dev/SKILL.md)를 함께 참고합니다.

Gemini에서 작업할 때의 추가 규칙:

- 긴 변경은 `bun run verify` 결과를 마지막에 요약합니다.
- KNOWLEDGE_BASE 원본은 읽기 전용으로 취급합니다. 마이그레이션 회고 노트 추가처럼 명시된 예외만 수행합니다.
- 자동 병합 설정을 만들거나 활성화하지 않습니다.
