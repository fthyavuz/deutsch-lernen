import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LevelService } from '../../../../shared/services/level.service';
import { LevelDTO } from '../../../../shared/models/level.model';

@Component({
    selector: 'app-level-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './level-list.component.html',
    styleUrl: './level-list.component.css'
})
export class LevelListComponent implements OnInit {
    private levelService = inject(LevelService);
    private router = inject(Router);

    levels = signal<LevelDTO[]>([]);
    loading = signal<boolean>(true);

    ngOnInit() {
        this.loadLevels();
    }

    loadLevels() {
        this.loading.set(true);
        this.levelService.getAllLevels().subscribe({
            next: (data) => {
                this.levels.set(data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }

    create() {
        this.router.navigate(['/admin/levels/new']);
    }

    edit(id: number) {
        this.router.navigate(['/admin/levels/edit', id]);
    }

    remove(id: number) {
        if (confirm('Are you sure you want to delete this level? This might affect lessons assigned to it.')) {
            this.levelService.deleteLevel(id).subscribe(() => this.loadLevels());
        }
    }
}
