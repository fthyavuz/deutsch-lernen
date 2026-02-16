import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserService } from '../../../../shared/services/admin-user.service';
import { UserDTO } from '../../../../shared/models/user.model';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
    private userService = inject(AdminUserService);
    private authService = inject(AuthService);

    users = signal<UserDTO[]>([]);
    loading = signal<boolean>(true);
    currentUserEmail = this.authService.userEmailSignal;

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.loading.set(true);
        this.userService.getAllUsers().subscribe({
            next: (data) => {
                this.users.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    toggleRole(user: UserDTO) {
        const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
        if (user.email === this.currentUserEmail()) {
            alert("You cannot change your own role!");
            return;
        }

        if (confirm(`Change role of ${user.email} to ${newRole}?`)) {
            this.userService.updateRole(user.id, newRole).subscribe(() => this.loadUsers());
        }
    }

    remove(user: UserDTO) {
        if (user.email === this.currentUserEmail()) {
            alert("You cannot delete your own account!");
            return;
        }

        if (confirm(`Are you sure you want to delete user ${user.email}? This will also delete all their progress.`)) {
            this.userService.deleteUser(user.id).subscribe(() => this.loadUsers());
        }
    }
}
