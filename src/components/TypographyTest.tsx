interface TypographyTestProps {
  theme?: 'light' | 'dark';
}

const TypographyTest = ({ theme = 'light' }: TypographyTestProps) => {
  return (
    <body data-theme={theme}>
      <div
        className="p-6 space-y-4 rounded-md shadow-md border"
        style={{
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-text)',
        }}
      >
        <h1 className="text-3xl font-bold">Pretendard Bold</h1>
        <h2 className="text-2xl font-semibold">Pretendard SemiBold</h2>
        <p className="text-base font-normal">
          본문 텍스트입니다. 이 폰트는 Pretendard Regular로 설정되어 있으며, 다크모드에서도 잘
          보일까요?
        </p>
      </div>
    </body>
  );
};

export default TypographyTest;
