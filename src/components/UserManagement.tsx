import React, { useEffect, useMemo, useState } from "react";
import { Users, Search, Trash2, UserCheck, UserX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import BulkDeleteDialog from "./BulkDeleteDialog";
import UserTableRow from "./UserTableRow";
import UserPagination from "./UserPagination";
import { useAdmin, AdminUser } from "@/contexts/AdminContext";

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const {
    users,
    loading,
    error,
    fetchUsers,
    makeAdmin,
    makeUser,
    activate,
    deactivate,
    removeUser
  } = useAdmin();

  // ——— Local UI state ———
  const [searchTerm, setSearchTerm] = useState("");
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ——— Effects: initial load + debounced search ———
  useEffect(() => {
    // initial fetch
    fetchUsers().catch(() => {
      /* handled in context */
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchUsers(searchTerm ? { search: searchTerm } : undefined);
      // reset pagination & selection when search changes
      setCurrentPage(1);
      setSelectedUsers([]);
    }, 350);
    return () => clearTimeout(t);
  }, [searchTerm, fetchUsers]);

  // ——— Pagination (client-side) ———
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(users.length / itemsPerPage)),
    [users.length, itemsPerPage]
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = useMemo(
    () => users.slice(startIndex, startIndex + itemsPerPage),
    [users, startIndex, itemsPerPage]
  );

  // ——— Selection helpers ———
  const selectableUsers = useMemo(
    () => paginatedUsers.filter((u) => u.id !== currentUser?.id),
    [paginatedUsers, currentUser?.id]
  );
  const isAllSelected =
    selectableUsers.length > 0 &&
    selectableUsers.every((u) => selectedUsers.includes(u.id));
  const isIndeterminate = selectedUsers.length > 0 && !isAllSelected;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const union = new Set([
        ...selectedUsers,
        ...selectableUsers.map((u) => u.id)
      ]);
      setSelectedUsers([...union]);
    } else {
      const selectableIds = new Set(selectableUsers.map((u) => u.id));
      setSelectedUsers((prev) => prev.filter((id) => !selectableIds.has(id)));
    }
  };

  const handleSelectUser = (userId: string, selected: boolean) => {
    setSelectedUsers((prev) =>
      selected ? [...prev, userId] : prev.filter((id) => id !== userId)
    );
  };

  // ——— Actions ———
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (userId === currentUser?.id) {
      toast.error("You cannot delete your own account.");
      return;
    }
    const ok = await removeUser(userId);
    if (ok) {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
      toast.success(`${userName} has been removed from the system.`);
    }
    // else {
    //   toast.error('Failed to delete user.');
    // }
  };

  const handleBulkDeleteUsers = async () => {
    const targets = users.filter(
      (u) => selectedUsers.includes(u.id) && u.id !== currentUser?.id
    );
    if (targets.length === 0) {
      toast.error("No users selected for deletion.");
      return;
    }
    const results = await Promise.all(targets.map((u) => removeUser(u.id)));
    const successCount = results.filter(Boolean).length;
    setSelectedUsers([]);
    if (successCount)
      toast.success(`${successCount} users have been deleted successfully.`);
    if (successCount !== targets.length)
      toast.error(`${targets.length - successCount} deletions failed.`);
  };

  // const toggleUserRole = async (userId: string) => {
  //   const user = users.find((u) => u.id === userId);
  //   if (!user) return;
  //   if (user.role === "admin") {
  //     toast.info("Demotion is not supported.");
  //     return;
  //   }
  //   const ok = await makeAdmin(userId);
  //   if (ok) toast.success(`${user.name} is now an admin.`);
  //   else toast.error("Failed to promote user.");
  // };

  const toggleUserRole = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    if (user.role === "admin") {
      const ok = await makeUser(userId);
      if (ok) toast.success(`${user.name} has been demoted to user.`);
      else toast.error("Failed to demote user.");
    } else {
      const ok = await makeAdmin(userId);
      if (ok) toast.success(`${user.name} is now an admin.`);
      else toast.error("Failed to promote user.");
    }
  };

  const toggleUserStatus = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const isActive = user.status === "active";
    const ok = isActive ? await deactivate(userId) : await activate(userId);

    if (ok) {
      toast.success(`${user.name} is now ${isActive ? "inactive" : "active"}.`);
    } else {
      toast.error("Failed to update status.");
    }
  };

  const handleBulkStatusChange = async (status: "active" | "inactive") => {
    const targets = users.filter(
      (u) => selectedUsers.includes(u.id) && u.id !== currentUser?.id
    );
    if (targets.length === 0) {
      toast.error("No users selected for status change.");
      return;
    }
    const exec = status === "active" ? activate : deactivate;
    const results = await Promise.all(targets.map((u) => exec(u.id)));
    const successCount = results.filter(Boolean).length;
    setSelectedUsers([]);
    if (successCount)
      toast.success(`${successCount} users have been marked as ${status}.`);
    if (successCount !== targets.length)
      toast.error(`${targets.length - successCount} updates failed.`);
  };

  const getSelectedUsersList = () => {
    const selected = users.filter((u) => selectedUsers.includes(u.id));
    if (
      selected.length === selectableUsers.length &&
      selectableUsers.length > 0
    )
      return `All ${selected.length} users`;
    if (selected.length <= 3) return selected.map((u) => u.name).join(", ");
    return `${selected.length} users selected`;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedUsers([]);
  };

  const handleItemsPerPageChange = (n: number) => {
    setItemsPerPage(n);
    setCurrentPage(1);
    setSelectedUsers([]);
  };

  const handleGoToPage = (page: number) => {
    setCurrentPage(page);
    setSelectedUsers([]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>User Management</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleBulkStatusChange("active")}
                  className="gap-2"
                  size="sm"
                >
                  <UserCheck className="h-4 w-4" />
                  Activate ({selectedUsers.length})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkStatusChange("inactive")}
                  className="gap-2"
                  size="sm"
                >
                  <UserX className="h-4 w-4" />
                  Deactivate ({selectedUsers.length})
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsBulkDeleteOpen(true)}
                  className="gap-2"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete ({selectedUsers.length})
                </Button>
              </div>
            )}
            <Badge variant="outline" className="text-sm">
              {users.length} users
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Loading / Error states */}
        {loading && (
          <div className="text-center py-8 text-muted-foreground">
            Loading users…
          </div>
        )}
        {error && !loading && (
          <div className="text-center py-4 text-red-600">{error}</div>
        )}

        {/* Users Table */}
        {!loading && (
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        disabled={selectableUsers.length === 0}
                        aria-label="Select all users"
                        className={
                          isIndeterminate
                            ? "data-[state=checked]:bg-primary/50"
                            : ""
                        }
                      />
                    </TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user: AdminUser) => (
                    <UserTableRow
                      key={user.id}
                      user={
                        {
                          id: user.id,
                          name: user.name,
                          email: user.email,
                          role: user.role,
                          status: user.status ?? "active",
                          tasksCount: user.tasks,
                          joinDate: user.joinedAt ?? "",
                          lastActive: user.lastActive ?? ""
                        } as any
                      }
                      isSelected={selectedUsers.includes(user.id)}
                      isCurrentUser={user.id === currentUser?.id}
                      onSelect={handleSelectUser}
                      onDelete={handleDeleteUser}
                      onToggleRole={toggleUserRole}
                      onToggleStatus={toggleUserStatus}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {!loading && users.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No users found matching your search.
            </p>
          </div>
        )}

        {/* Pagination */}
        {!loading && users.length > 0 && (
          <UserPagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={users.length}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onGoToPage={handleGoToPage}
          />
        )}

        <BulkDeleteDialog
          open={isBulkDeleteOpen}
          onOpenChange={setIsBulkDeleteOpen}
          title="Delete Selected Users"
          description={`This will permanently delete the selected users: ${getSelectedUsersList()}. All user data and tasks will be lost.`}
          confirmationText="Yes Delete Selected Users"
          onConfirm={handleBulkDeleteUsers}
          itemCount={selectedUsers.length}
        />
      </CardContent>
    </Card>
  );
}

