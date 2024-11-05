export class GraphNode {
	name: string;
	id: number;
	cost: number;
	neighbors: GraphNode[] = [];

	gCost: number = 1; // Cost from the start GraphNode to this GraphNode
	hCost: number = 1; // Estimated cost from this GraphNode to the end GraphNode
	fCost: number = 1; // Total cost (gCost + hCost)

	parent: GraphNode;
   
	constructor(name: string, id: number, cost: number) {
		this.name = name;
		this.id = id;
		this.cost = cost;
	}

	addNext(next:GraphNode){
        console.log(next)
        console.log(this.neighbors)
		this.neighbors.push(next);
	}
   
	getString() {
		return this.name;
	}

	getNoteName(): string {
        const fullName = this.name.split("/").last()
        if (fullName){
            const shortName = fullName.split(".")[0]
            return shortName
        }
        return this.name
    }
}