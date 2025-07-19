
"use client";

import { useState, useEffect } from 'react';
import type { Project } from '@/lib/types';
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
import { Loader2, PlusCircle, Trash, Edit, X, Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import Image from 'next/image';


const projectFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    category: z.string().min(1, "Category is required"),
    description: z.string().min(1, "Short description is required"),
    longDescription: z.string().min(1, "Long description is required"),
    image: z.string().optional(),
    livePreview: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

type ProjectFormData = z.infer<typeof projectFormSchema>;

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  
  const [formData, setFormData] = useState<Partial<ProjectFormData>>({});
  const [tagInput, setTagInput] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);


  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/projects');
      const result = await response.json();
      if (result.status === 'success') {
        setProjects(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch projects');
      }
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error fetching projects",
            description: error.message,
        });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setFormData({});
    setTagInput('');
    setFormErrors({});
    setUploading(false);
    setIsSubmitting(false);
    setIsDeleting(false);
  };

  const openDialog = (mode: 'create' | 'edit', project?: Project) => {
    resetForm();
    setDialogMode(mode);
    if (mode === 'edit' && project) {
      setSelectedProject(project);
      setFormData({
        title: project.title,
        category: project.category,
        description: project.description,
        longDescription: project.longDescription,
        image: project.image,
        livePreview: project.livePreview,
        tags: project.tags || [],
      });
    } else {
      setSelectedProject(null);
    }
    setDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({ ...prev, image: result.path }));
        toast({ title: 'Success', description: 'Image uploaded successfully.' });
      } else {
        throw new Error(result.message || 'Image upload failed');
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Upload Error', description: error.message });
      setFormData(prev => ({ ...prev, image: undefined }));
    } finally {
      setUploading(false);
    }
  };


  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.endsWith(',')) {
      const newTag = value.slice(0, -1).trim();
      if (newTag && !formData.tags?.includes(newTag)) {
        setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), newTag] }));
      }
      setTagInput('');
    } else {
      setTagInput(value);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);

    const validation = projectFormSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach(issue => {
        errors[issue.path[0]] = issue.message;
      });
      setFormErrors(errors);
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please check the form for errors.",
      });
      setIsSubmitting(false);
      return;
    }

    const dataToSubmit = validation.data;
    const url = dialogMode === 'edit' && selectedProject ? `/api/projects/${selectedProject.id}` : '/api/projects';
    const method = dialogMode === 'edit' ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });
      const result = await response.json();
      if (result.status !== 'success') {
        throw new Error(result.message || `Failed to ${dialogMode} project`);
      }
      toast({
        title: "Success",
        description: `Project ${dialogMode === 'edit' ? 'updated' : 'created'} successfully.`,
      });
      setDialogOpen(false);
      fetchProjects();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.status !== 'success') throw new Error(result.message || 'Failed to delete project');
      toast({ title: "Success", description: "Project deleted successfully." });
      fetchProjects();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsDeleting(false);
      setAlertDialogOpen(false);
    }
  };
  
  if (loading) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-background py-16 sm:py-24">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <Button onClick={() => openDialog('create')}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Project
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => openDialog('edit', project)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog open={alertDialogOpen && selectedProject?.id === project.id} onOpenChange={(open) => {
                        if(!open) setSelectedProject(null);
                        setAlertDialogOpen(open);
                    }}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" onClick={() => setSelectedProject(project)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the project "{selectedProject?.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(isOpen) => { setDialogOpen(isOpen); if (!isOpen) resetForm(); }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className='px-2'>
            <DialogTitle>{dialogMode === 'edit' ? 'Edit Project' : 'Create New Project'}</DialogTitle>
            <DialogDescription>
              Fill in the form below to {dialogMode} a project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-2 py-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title || ''} onChange={handleInputChange} disabled={isSubmitting} />
              {formErrors.title && <p className="text-sm text-destructive mt-1">{formErrors.title}</p>}
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category || ''} onValueChange={handleCategoryChange} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Portfolio">Portfolio</SelectItem>
                  <SelectItem value="Tech">Tech</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.category && <p className="text-sm text-destructive mt-1">{formErrors.category}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description (Short)</Label>
              <Textarea id="description" name="description" value={formData.description || ''} onChange={handleInputChange} disabled={isSubmitting}/>
              {formErrors.description && <p className="text-sm text-destructive mt-1">{formErrors.description}</p>}
            </div>
            
            <div>
              <Label htmlFor="longDescription">Long Description</Label>
              <Textarea id="longDescription" name="longDescription" value={formData.longDescription || ''} onChange={handleInputChange} rows={5} disabled={isSubmitting}/>
              {formErrors.longDescription && <p className="text-sm text-destructive mt-1">{formErrors.longDescription}</p>}
            </div>

            {/* <div>
              <Label htmlFor="image">Image</Label>
              <div className="mt-2 flex items-center gap-4">
                  {formData.image ? (
                    <div className="relative w-24 h-24 shrink-0">
                      <Image src={formData.image} alt="Preview" fill className="rounded-md object-cover"/>
                    </div>
                  ) : (
                    <div className="w-24 h-24 shrink-0 flex items-center justify-center bg-muted rounded-md text-muted-foreground">
                      No Image
                    </div>
                  )}
                  <div className="w-full">
                    <Input id="image-upload" type="file" onChange={handleImageUpload} accept="image/*" disabled={uploading || isSubmitting} className="hidden"/>
                    <Button type="button" variant="outline" onClick={() => document.getElementById('image-upload')?.click()} disabled={uploading || isSubmitting}>
                      {uploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="mr-2 h-4 w-4" />
                      )}
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">Upload a project image.</p>
                  </div>
              </div>
            </div> */}

            <div>
              <Label htmlFor="livePreview">Live Preview URL</Label>
              <Input id="livePreview" name="livePreview" value={formData.livePreview || ''} onChange={handleInputChange} placeholder="https://example.com" disabled={isSubmitting} />
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags?.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-2 rounded-full p-0.5 hover:bg-destructive/20" disabled={isSubmitting}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <Input 
                id="tags" 
                value={tagInput} 
                onChange={handleTagInputChange} 
                placeholder="Type a tag and press comma"
                disabled={isSubmitting}
              />
              <p className="text-sm text-muted-foreground mt-1">Separate tags with a comma.</p>
            </div>

            <DialogFooter className="sticky bottom-0 bg-background pt-4">
                <DialogClose asChild>
                    <Button type="button" variant="secondary" disabled={isSubmitting}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {dialogMode === 'edit' ? 'Save Changes' : 'Create Project'}
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
