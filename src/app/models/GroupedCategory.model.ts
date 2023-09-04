export class GroupedCategory {
    name: string = "";
    categories: any[] = [];

    constructor(name: string, categories: GroupedCategory[]) {
        this.name = name;
        this.categories = categories;

        return this;
    }
}