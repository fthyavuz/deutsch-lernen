import { Routes } from "@angular/router";
import { VocabularyListComponent } from "./vocabulary-list/vocabulary-list.component";

export const adminVocabularyRoutes: Routes = [
    {
        path: '',
        component: VocabularyListComponent
    }
]