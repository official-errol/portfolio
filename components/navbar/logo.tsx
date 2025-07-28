import Image from 'next/image';

export const Logo = () => (
  <div className="flex items-center gap-2">
    <Image
      src="/logo.png"
      alt="Errol Solomon"
      width={32}
      height={32}
      priority
    />
    <span className="font-bold text-lg tracking-tight">errol&apos;solomon</span>
  </div>
);
