import { Smartphone, Globe, HardDrive } from 'lucide-react';
import Image from 'next/image';
import { Breadcrumb } from '@/components/breadcrumb';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const services = [
  {
    icon: Smartphone,
    image: '/services/mobile-app.svg',
    title: 'App',
    description: 'Kami ahli dalam menciptakan aplikasi web dan seluler khusus yang intuitif, berkinerja tinggi, dan skalabel. Proses pengembangan kami berfokus pada penyediaan pengalaman pengguna yang luar biasa, yang dirancang khusus untuk memenuhi tujuan bisnis dan kebutuhan pengguna spesifik Anda.',
    longDescription: 'Dari konsep awal hingga penerapan akhir, kami menangani setiap aspek siklus pengembangan aplikasi. Kami menggunakan teknologi modern untuk membangun backend yang tangguh dan frontend yang interaktif. Baik Anda membutuhkan aplikasi yang berhadapan langsung dengan pelanggan maupun perangkat bisnis internal, kami menyediakan solusi yang canggih dan mudah digunakan.',
  },
  {
    icon: Globe,
    title: 'Web Templates & Design',
    image: '/services/web-app.svg',
    description: 'Kami menyediakan templat web berkualitas tinggi yang dirancang secara profesional dengan harga terjangkau. Setiap templat dirancang untuk pengalaman pengguna yang luar biasa, performa optimal, dan kustomisasi yang mudah agar sesuai dengan identitas merek Anda.',
    longDescription: 'Template web kami dibangun dengan teknologi terkini seperti Next.js dan Tailwind CSS, memastikannya cepat, ramah SEO, dan sepenuhnya responsif. Template ini menjadi titik awal yang sempurna untuk proyek Anda, menghemat waktu dan biaya pengembangan sekaligus menjamin kehadiran online yang profesional dan profesional.',
  },
  {
    icon: HardDrive,
    title: 'Software & Hardware Installation',
    image: '/services/sync.svg',
    description: 'Kami menawarkan layanan instalasi dan konfigurasi profesional untuk berbagai perangkat lunak dan perangkat keras. Dukungan panggilan kami di area Bandung memastikan pengaturan yang lancar, efisien, dan bebas repot untuk rumah atau kantor Anda.',
    longDescription: 'Tim teknisi berpengalaman kami dapat menangani semuanya, mulai dari menyiapkan sistem dan jaringan komputer baru hingga menginstal rangkaian perangkat lunak yang kompleks. Kami memastikan teknologi Anda dikonfigurasi untuk kinerja dan keamanan optimal, memberikan Anda ketenangan pikiran dan memungkinkan Anda untuk fokus pada keahlian Anda.',
  },
];

export default function ServicesPage() {
    const breadcrumbItems = [
        { href: '/', label: 'Home' },
        { href: '/services', label: 'Services', isCurrent: true },
      ];

  return (
    <main className="w-full bg-background py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Our Services
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
            We provide comprehensive digital solutions to meet your business needs, from mobile apps to complex installations. Explore our services to see how we can help you succeed.
          </p>
        </div>

        <div className="space-y-24">
            {services.map((service, index) => (
                <div key={service.title} className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                    <div className={`relative flex items-center justify-center ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                        <div className="relative">
                            <Image
                                src={service.image}
                                alt={service.title}
                                width={500}
                                height={500}
                                className="object-cover"
                            />
                            <div className={`absolute -bottom-4 h-full w-full rounded-xl border-2 border-border -z-10 ${index % 2 === 1 ? '-left-4' : '-right-4'}`}></div>
                        </div>
                    </div>
                    <div className={`flex flex-col justify-center ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                        <service.icon className="h-12 w-12 mb-4 text-accent" />
                        <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {service.title}
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            {service.longDescription}
                        </p>
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-24 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Siap Memulai Proyek?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Mari bekerja sama mewujudkan ide-ide Anda. Hubungi kami hari ini untuk mendiskusikan proyek Anda dan dapatkan konsultasi gratis.
            </p>
            <Button asChild size="lg" className="mt-8 shadow-lg transition-shadow hover:shadow-xl">
                <Link href="/#kontak">
                    Get in Touch
                </Link>
            </Button>
        </div>
      </div>
    </main>
  );
}
