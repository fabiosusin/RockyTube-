export class CategoryMigrationInput {
    migrate?: boolean;
    oldCategoryId?: string;
    newCategoryId?: string;
    newCategoryName?: string;
}