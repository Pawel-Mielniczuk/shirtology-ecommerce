import Image from 'next/image';

import loader from '@/assets/loader.gif';

export default function LoadingPage() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100dvh',
        width: '100%',
      }}
    >
      <Image src={loader} alt="Loading gif" width={150} height={150} />
    </div>
  );
}
