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
    id: "1",
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
    id: "2",
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
    id: "3",
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