import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LevelService } from '../../../../shared/services/level.service';
import { LevelDTO } from '../../../../shared/models/level.model';

@Component({
    selector: 'app-level-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './level-form.component.html',
    styleUrl: './level-form.component.css'
})
export class LevelFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private levelService = inject(LevelService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    isEditMode = false;
    levelId?: number;

    form = this.fb.nonNullable.group({
        code: ['', [Validators.required]],
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
        displayOrder: [1, [Validators.required, Validators.min(1)]]
    });

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.levelId = +id;
            this.loadLevel(this.levelId);
        }
    }

    loadLevel(id: number) {
        this.levelService.getLevelById(id).subscribe(level => {
            this.form.patchValue({
                code: level.code,
                title: level.title,
                description: level.description,
                displayOrder: level.displayOrder
            });
        });
    }

    submit() {
        const levelData = this.form.getRawValue();
        if (this.isEditMode && this.levelId) {
            this.levelService.updateLevel(this.levelId, levelData).subscribe(() => {
                this.router.navigate(['/admin/levels']);
            });
        } else {
            this.levelService.createLevel(levelData).subscribe(() => {
                this.router.navigate(['/admin/levels']);
            });
        }
    }

    cancel() {
        this.router.navigate(['/admin/levels']);
    }
}
