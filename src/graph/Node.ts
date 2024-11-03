export class GraphNode {
	name: string;
	id: number;
	cost: number;
	neighbors: GraphNode[] = [];
   
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
}