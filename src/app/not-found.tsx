import { Button } from '@/components/ui/button';
import { Frown } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-10rem)] w-full flex-col items-center justify-center bg-background py-16 text-center sm:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Frown className="mx-auto h-24 w-24 text-muted-foreground/50" />
        <h1 className="mt-8 font-headline text-8xl font-extrabold tracking-tight text-foreground sm:text-9xl">
          404
        </h1>
        <p className="mt-4 font-headline text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Oops! Page Not Found.
        </p>
        <p className="mx-auto mt-6 max-w-md text-lg text-muted-foreground">
          Maaf, halaman yang Anda cari tidak ada. Mungkin telah dipindahkan atau dihapus.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-8 shadow-lg transition-shadow hover:shadow-xl"
        >
          <Link href="/">Kembali ke Halaman Utama</Link>
        </Button>
      </div>
    </main>
  );
}
