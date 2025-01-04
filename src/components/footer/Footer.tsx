import { APP_TITLE } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="flex-center p-5">
        {currentYear} {APP_TITLE}. All Right Reserved
      </div>
    </footer>
  );
}
