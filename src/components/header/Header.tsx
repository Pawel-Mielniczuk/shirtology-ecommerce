import Image from 'next/image';
import Link from 'next/link';

import { APP_TITLE } from '@/lib/constants';

import Menu from './Menu';

//TODO- Add Spinner for ModeToggle

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="images/logo.svg"
              alt={`${APP_TITLE} logo`}
              height={48}
              width={48}
              priority={true}
            />
            <span className="ml-3 hidden text-2xl font-bold lg:block">
              {APP_TITLE}
            </span>
          </Link>
        </div>
        <Menu />
      </div>
    </header>
  );
}
