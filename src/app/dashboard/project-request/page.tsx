    import { Construction } from 'lucide-react';

export default function ProjectRequestPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Construction className="w-24 h-24 text-muted-foreground/50 mb-6" />
      <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground">
        Coming Soon!
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        We are working hard to bring you the Project Request feature. Stay tuned!
      </p>
    </div>
  );
}
