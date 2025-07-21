import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';

export type Testimonial = {
  id: string;
  name: string;
  text: string;
};

type TestimonialsState = {
  testimonials: Testimonial[];
};

const initialTestimonials: Testimonial[] = [
  {
    id: nanoid(),
    name: "Ilham",
    text: "Bekerja dengan Zelo adalah perubahan besar. Mereka memberikan website berkualitas tinggi yang melampaui ekspektasi kami, dan perhatian mereka terhadap detail sangat sempurna.",
  },
  {
    id: nanoid(),
    name: "Hafidh Dwi",
    text: "Tim Zelo sangat berbakat dan profesional. Mereka mengubah visi kami menjadi aplikasi web yang menakjubkan dan fungsional. Sangat direkomendasikan!",
  },
  {
    id: nanoid(),
    name: "Naufal Maulana",
    text: "Saya terkesan dengan dedikasi dan keahlian mereka. Zelo memberikan pengalaman yang mulus dari awal hingga akhir, dan produk akhirnya sangat penting bagi kesuksesan kami.",
  },
  {
    id: nanoid(),
    name: "Diaz",
    text: "Solusi digital kreatif Zelo membantu kami meningkatkan merek dan menjangkau audiens yang lebih luas. Sangat menyenangkan bekerja dengan tim mereka.",
  },
  {
    id: nanoid(),
    name: "Ahmad Muhtadin",
    text: "Produk akhirnya tidak hanya indah tetapi juga sangat fungsional. Komitmen Zelo terhadap kualitas terlihat jelas dalam pekerjaan mereka.",
  },
];

const initialState: TestimonialsState = {
  testimonials: initialTestimonials,
};

const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState,
  reducers: {
    addTestimonial: {
        reducer(state, action: PayloadAction<Testimonial>) {
            state.testimonials.push(action.payload);
        },
        prepare(payload: { name: string; text: string }) {
            return {
                payload: {
                    id: nanoid(),
                    ...payload,
                },
            };
        },
    },
    updateTestimonial(state, action: PayloadAction<Testimonial>) {
      const { id, name, text } = action.payload;
      const existingTestimonial = state.testimonials.find(t => t.id === id);
      if (existingTestimonial) {
        existingTestimonial.name = name;
        existingTestimonial.text = text;
      }
    },
    deleteTestimonial(state, action: PayloadAction<string>) {
      state.testimonials = state.testimonials.filter(t => t.id !== action.payload);
    },
  },
});

export const { addTestimonial, updateTestimonial, deleteTestimonial } = testimonialsSlice.actions;

export default testimonialsSlice.reducer;
