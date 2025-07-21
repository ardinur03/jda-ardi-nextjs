"use client";

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTestimonial, updateTestimonial, deleteTestimonial, } from '@/redux/slices/testimonialsSlice';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle, Trash, Edit } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { RootState, AppDispatch } from '@/redux/store';
import { Testimonial } from '@/redux/slices/testimonialsSlice';

export default function AdminTestimonialsPage() {
  const testimonials = useSelector((state: RootState) => state.testimonials.testimonials);
  const dispatch = useDispatch<AppDispatch>();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({ id: '', name: '', text: '' });
  const { toast } = useToast();

  const openDialog = (mode: 'create' | 'edit', testimonial?: Testimonial) => {
    setDialogMode(mode);
    if (mode === 'edit' && testimonial) {
      setSelectedTestimonial(testimonial);
      setFormData({ id: testimonial.id, name: testimonial.name, text: testimonial.text });
    } else {
      setSelectedTestimonial(null);
      setFormData({ id: '', name: '', text: '' });
    }
    setDialogOpen(true);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name || !formData.text) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Name and text cannot be empty.",
        });
        return;
    }

    if (dialogMode === 'create') {
      dispatch(addTestimonial({ name: formData.name, text: formData.text }));
      toast({ title: "Success", description: "Testimonial created successfully." });
    } else if (selectedTestimonial) {
      dispatch(updateTestimonial({ id: selectedTestimonial.id, name: formData.name, text: formData.text }));
      toast({ title: "Success", description: "Testimonial updated successfully." });
    }

    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (!selectedTestimonial) return;
    dispatch(deleteTestimonial(selectedTestimonial.id));
    toast({ title: "Success", description: "Testimonial deleted successfully." });
    setAlertDialogOpen(false);
  };

  const openDeleteConfirmation = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setAlertDialogOpen(true);
  };

  return (
    <main className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Testimonials</h1>
        <Button onClick={() => openDialog('create')}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Testimonial
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Text</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((testimonial) => (
              <TableRow key={testimonial.id}>
                <TableCell className="font-medium">{testimonial.name}</TableCell>
                <TableCell className="max-w-md truncate">{testimonial.text}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => openDialog('edit', testimonial)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => openDeleteConfirmation(testimonial)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

        <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus testimonial secara permanen dari "{selectedTestimonial?.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className='px-2'>
            <DialogTitle>{dialogMode === 'edit' ? 'Edit Testimonial' : 'Create New Testimonial'}</DialogTitle>
            <DialogDescription>
              Fill in the form below to {dialogMode} a testimonial.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-2 py-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div>
              <Label htmlFor="text">Text</Label>
              <Textarea 
                id="text" 
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})} 
                required 
                rows={5}
              />
            </div>
            <DialogFooter className="sticky bottom-0 bg-background pt-4">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">
                    {dialogMode === 'edit' ? 'Save Changes' : 'Create Testimonial'}
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
