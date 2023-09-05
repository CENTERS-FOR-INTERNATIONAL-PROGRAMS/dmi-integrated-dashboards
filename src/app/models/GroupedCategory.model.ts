export class GroupedCategory {
    name: string = "";
    categories: any[] = [];

    constructor(name: string, categories: GroupedCategory[]) {
        this.name = name;
        this.categories = categories;

        return this;
    }

    attach(GCHaystack: any[], gc_name: string, gc_last: boolean) {
        let gc_found = -1;

        GCHaystack.forEach((GCInstance, index) => {
            if (GCInstance.name == gc_name) {
                gc_found = index;
            }
        });

        if (gc_found == -1) {
            if (gc_last) {
                GCHaystack.push(gc_name);
            } else {
                GCHaystack.push(new GroupedCategory(gc_name, []));
            }
            gc_found = (GCHaystack.length - 1);
        }

        return gc_found;
    }
}