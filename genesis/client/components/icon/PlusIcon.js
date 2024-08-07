import { Svg } from '@/components/icon/Svg';

function PlusIcon(props) {
  return (
    <Svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      {...props}>
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5"/>
    </Svg>

  );
}

export { PlusIcon };

