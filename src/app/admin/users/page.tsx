"use client";

import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash, Edit, PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { z } from "zod";
import { Role, User } from '../../../../prisma/generated';

const userBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.nativeEnum(Role),
});

const userCreateSchema = userBaseSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const userEditSchema = userBaseSchema.extend({
  password: z.string().optional().refine(val => !val || val.length >= 6, {
      message: "Password must be at least 6 characters if provided",
  }),
});


type UserFormData = Omit<User, 'createdAt' | 'updatedAt' | 'emailVerified'>;


export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState<Partial<UserFormData>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string | undefined>>({});

  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const result = await response.json();
      if (result.status === 'success') {
        setUsers(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch users');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error fetching users",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const resetForm = () => {
    setFormData({});
    setFormErrors({});
    setIsSubmitting(false);
  };

  const openDialog = (mode: 'create' | 'edit', user?: User) => {
    resetForm();
    setDialogMode(mode);
    if (mode === 'edit' && user) {
      setSelectedUser(user);
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      setSelectedUser(null);
      setFormData({role: 'MEMBER'});
    }
    setDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: Role) => {
    setFormData(prev => ({...prev, role: value}));
  };
  
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);
    
    const schema = dialogMode === 'create' ? userCreateSchema : userEditSchema;

    const validation = schema.safeParse(formData);

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
    const url = dialogMode === 'edit' && selectedUser ? `/api/users/${selectedUser.id}` : '/api/users';
    const method = dialogMode === 'edit' ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });
      const result = await response.json();
      if (result.status !== 'success') {
        throw new Error(result.message || `Failed to ${dialogMode} user`);
      }
      toast({
        title: "Success",
        description: `User ${dialogMode === 'edit' ? 'updated' : 'created'} successfully.`,
      });
      setDialogOpen(false);
      fetchUsers();
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
    if (!userToDelete) return;
    setIsProcessing(prev => ({ ...prev, [userToDelete.id]: true }));
    try {
      const response = await fetch(`/api/users/${userToDelete.id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.status !== 'success') throw new Error(result.message || 'Failed to delete user');
      toast({ title: 'Success', description: 'User deleted successfully.' });
      fetchUsers();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setIsProcessing(prev => ({ ...prev, [userToDelete.id]: false }));
      setUserToDelete(null);
    }
  };
  
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center p-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <p className="text-muted-foreground">A list of all users in your application.</p>
        </div>
        <Button onClick={() => openDialog('create')}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.name}
                  {session?.user.id === user.id && <Badge className="ml-2">You</Badge>}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => openDialog('edit', user)} disabled={session?.user.id === user.id}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          disabled={session?.user.id === user.id || isProcessing[user.id]}
                          onClick={() => setUserToDelete(user)}
                        >
                           <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      {userToDelete?.id === user.id && (
                          <AlertDialogContent>
                              <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the user "{userToDelete?.name}".
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                      )}
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={(isOpen) => { setDialogOpen(isOpen); if (!isOpen) resetForm(); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'edit' ? 'Edit User' : 'Create New User'}</DialogTitle>
            <DialogDescription>
              {dialogMode === 'edit' ? "Change user details below." : "Create a new user account."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
             <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name || ''} onChange={handleInputChange} disabled={isSubmitting} />
              {formErrors.name && <p className="text-sm text-destructive mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleInputChange} disabled={isSubmitting} />
              {formErrors.email && <p className="text-sm text-destructive mt-1">{formErrors.email}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder={dialogMode === 'edit' ? 'Leave blank to keep current password' : ''} onChange={handleInputChange} disabled={isSubmitting} />
              {formErrors.password && <p className="text-sm text-destructive mt-1">{formErrors.password}</p>}
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role || 'MEMBER'} onValueChange={handleRoleChange} disabled={isSubmitting || (dialogMode === 'edit' && session?.user.id === selectedUser?.id)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary" disabled={isSubmitting}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {dialogMode === 'edit' ? 'Save Changes' : 'Create User'}
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
