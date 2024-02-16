import Image from 'next/image';
import Link from 'next/link';

export const Logo = () => {
  return (
    <>
      <Link
        href="/a"
        className="flex items-center gap-x-2 font-semibold text-xl"
      >
        <Image
          src="/logo.svg"
          alt="logo"
          width={30}
          height={30}
          className="object-contain"
        />
        Lament
      </Link>
    </>
  );
};
