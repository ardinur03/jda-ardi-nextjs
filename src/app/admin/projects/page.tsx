
"use client";

import { useState, useEffect } from 'react';
import type { Project } from '@/app/api/projects/route';
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

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  
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
            title: "Error",
            description: error.message,
        });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: {[key: string]: any} = Object.fromEntries(formData.entries());

    // Convert tags string to array
    if (typeof data.tags === 'string') {
      data.tags = data.tags.split(',').map(tag => tag.trim()).filter(Boolean);
    } else {
      data.tags = [];
    }

    const url = dialogMode === 'edit' && selectedProject ? `/api/projects/${selectedProject.id}` : '/api/projects';
    const method = dialogMode === 'edit' ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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
      fetchProjects(); // Refresh list
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    try {
      const response = await fetch(`/api/projects/${selectedProject.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.status !== 'success') {
        throw new Error(result.message || 'Failed to delete project');
      }
      toast({
        title: "Success",
        description: "Project deleted successfully.",
      });
      fetchProjects();
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
        });
    } finally {
        setAlertDialogOpen(false);
    }
  };

  const openDialog = (mode: 'create' | 'edit', project?: Project) => {
    setDialogMode(mode);
    setSelectedProject(project || null);
    setDialogOpen(true);
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
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'edit' ? 'Edit Project' : 'Create New Project'}</DialogTitle>
            <DialogDescription>
              Fill in the form below to {dialogMode} a project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={selectedProject?.title} required />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" defaultValue={selectedProject?.category} required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={selectedProject?.description} required />
            </div>
            <div>
              <Label htmlFor="longDescription">Long Description</Label>
              <Textarea id="longDescription" name="longDescription" defaultValue={selectedProject?.longDescription} required rows={5}/>
            </div>
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" name="tags" defaultValue={selectedProject?.tags?.join(', ')} placeholder="e.g. Next.js, Tailwind, ShadCN" />
              <p className="text-sm text-muted-foreground mt-1">Separate tags with a comma.</p>
            </div>
            <DialogFooter className="sticky bottom-0 bg-background pt-4">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">
                    {dialogMode === 'edit' ? 'Save Changes' : 'Create Project'}
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
