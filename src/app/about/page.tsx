import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="w-full bg-background py-16 sm:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            About Build With Zelo
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground">
           Kami adalah tim pengembang yang bersemangat dan berorientasi pada hasil dengan kejelian dalam desain dan komitmen untuk menulis kode yang bersih, efisien, dan mudah dipelihara. Perjalanan kami dalam pengembangan web dimulai dengan ketertarikan pada cara kerja situs web, yang dengan cepat berkembang menjadi hasrat yang mendalam.
          </p>
        </div>

        <div className="my-16 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-24 md:mt-36">
          <div className="relative flex items-center justify-center">
            <div className="relative">
              <Image
                src="/images/about-zelo.svg"
                alt="About Build With Zelo"
                width={500}
                height={500}
                className="rounded-lg object-cover"
                data-ai-hint="developer workspace"
              />
               <div className="absolute -bottom-4 -right-4 h-full w-full rounded-xl border-2 border-border -z-10"></div>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Zelo didirikan oleh Muhamad Ardi Nur Insan, seorang pengembang Full Stack Web Developer lulusan dari jurusan Teknik Komputer dan Informatika Politeknik Negeri Bandung dengan pengalaman didunia pengembangan aplikasi. Kami memiliki misi untuk memberikan solusi teknologi yang inovatif dan berkualitas tinggi kepada bisnis dan individu.
            </p>
            <p className="mt-4 text-muted-foreground">
              Sasaran kami adalah memberdayakan bisnis dan individu dengan menciptakan produk digital inovatif dan berkualitas tinggi yang tidak hanya tampak hebat tetapi juga berkinerja sempurna.
            </p>
          </div>
        </div>

        <div className="my-16 md:mt-36 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-24">
           <div className="flex flex-col justify-center md:order-2">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Meet the Founder
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Zelo didirikan oleh Ardi, seorang pengembang full-stack web developer. Semangat Ardi terhadap teknologi dan desain menjadi pendorong utama semangat kreatif membuat produk ini.
            </p>
            <p className="mt-4 text-muted-foreground">
              Berawal sebagai pengembang lepas, Saya menyadari perlunya pendekatan pengembangan web yang lebih terintegrasi dan berfokus pada klien. Visi ini mendorong terciptanya Build With Zelo, sebuah wadah yang mempertemukan kreativitas dengan teknologi untuk menciptakan hal-hal menakjubkan.
            </p>
          </div>
          <div className="relative flex items-center justify-center md:order-1">
            <div className="relative">
              <Image
                src="/images/ardi.jpg"
                alt="Founder Photo"
                width={500}
                height={500}
                className="rounded-lg object-cover shadow-lg"
                 data-ai-hint="founder portrait"
              />
              <div className="absolute -bottom-4 -left-4 h-full w-full rounded-xl border-2 border-border -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
