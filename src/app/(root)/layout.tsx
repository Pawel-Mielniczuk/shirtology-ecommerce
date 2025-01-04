import Header from '@/components/header/Header';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="wrapper flex-1">{children}</main>
    </div>
  );
}
