export function Logo({ className = "w-5 h-5", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <circle cx="7" cy="12" r="2" fill="currentColor" stroke="none"/>
      <path d="M11 5 C 17 6, 19 8, 19 12 C 19 16, 17 18, 11 19" />
    </svg>
  );
}
