export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  image: string;
  description: string;
  longDescription: string;
  tags: string[];
  livePreview: string;
}

export const projectData: Project[] =[
  {
    id: "5c4aef26-0b18-4301-bbc6-fa6bf831520b",
    title: "Website Portfolio ardi.blue",
    image: "/products/ardi-blue.png",
    slug: "website-portfolio",
    category: "Portfolio",
    livePreview: "https://ardi.blue",
    description:
      "Pembuatan template portfolio untuk kebutuhan personal branding.",
    longDescription:
      "Pembuatan template portfolio untuk kebutuhan personal branding dengan design elegan dan modern membuat para rekruter lebih tertarik. link akses <a href='https://ardi.blue' style='color: blue;'>https://ardi.blue</a>",
    tags: ["Web App", "Bootstrap", "HTML", "CSS", "Hotjar", "Google Analytics"],
  },
 
  {
    id: "3c070fdb-ae6f-421a-9c46-f53801354003",
    title: "Aplikasi Absensi Akademik Polban",
    image: "/products/absensi-app.jpg",
    slug: "aplikasi-absensi-akademik-polban",
    livePreview: "",
    category: "Education",
    description:
      "Aplikasi absensi akademik yang memudahkan pengelolaan dan pengolahan data absensi mahasiswa.",
    longDescription:
      "Aplikasi absensi pada web akademik Politeknik Negeri Bandung, dibangun dengan menggunkaan react native dan backend menggunkaan framework lumen",
    tags: ["Mobile App", "React Native", "API", "Lumen"],
  },
   {
    id: "0faa4daf-40bd-4192-8b3c-54586bd5b029",
    title: "Web Portfolio Tech",
    image: "/products/nadia-salsa.png",
    slug: "web-portfolio-tech",
    livePreview: "",
    category: "Tech",
    description:
      "web portfolio dengan gaya teknologi dan modern ui",
    longDescription:
      "Pembuatan web portfolio dengan design elegan dan modern membuat para rekruter lebih tertarik",
    tags: ["Next.js", "React", "Firebase", "Tailwind CSS", "Stripe"],
  },
  
];

export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};