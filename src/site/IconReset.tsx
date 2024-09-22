const INTRINSIC_WIDTH = 28;
const INTRINSIC_HEIGHT = 24;

export default function IconReset({
  width = INTRINSIC_WIDTH,
  includeTitle = true,
}: {
  width?: number
  includeTitle?: boolean
}) {
  return (
    <svg
      width={width}
      height={INTRINSIC_HEIGHT * width / INTRINSIC_WIDTH}
      viewBox="0 0 28 24"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {includeTitle && <title>Reset</title>}
      <path
        d="M19.5 8C17.75 6.5 15.5 5.625 13 5.625C8.375 5.625 4.625 9.375 4.625 14C4.625 18.625 8.375 22.375 13 22.375C16.625 22.375 19.625 20.5 21.375 17.5"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.375 4.625V9.375H18.625"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}