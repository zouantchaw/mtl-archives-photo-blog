/* eslint-disable max-len */

const INTRINSIC_WIDTH = 28;
const INTRINSIC_HEIGHT = 24;

export default function IconMap({
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
      {includeTitle && <title>Map</title>}
      <path d="M5.625 6.625L10.625 4.625V17.375L5.625 19.375V6.625Z" strokeWidth="1.25"/>
      <path d="M10.625 4.625L17.375 6.625V19.375L10.625 17.375V4.625Z" strokeWidth="1.25"/>
      <path d="M17.375 6.625L22.375 4.625V17.375L17.375 19.375V6.625Z" strokeWidth="1.25"/>
      <circle cx="14" cy="12" r="2" strokeWidth="1.25"/>
    </svg>
  );
}
