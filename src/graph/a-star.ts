import { GraphNode } from "./Node";

// export function aStar(startNode: GraphNode, endNode: GraphNode, getNeighbors: (GraphNode: GraphNode) => GraphNode[]): GraphNode[] | null {
export function aStar(startNode: GraphNode, endNode: GraphNode): GraphNode[] | null {
    const openSet = new Set<GraphNode>();
    const closedSet = new Set<GraphNode>();
    
    openSet.add(startNode);
    startNode.gCost = 0;
    startNode.hCost = calculateHeuristicCost(startNode, endNode);
    startNode.fCost = startNode.gCost + startNode.hCost;
    
    while (openSet.size > 0) {
        let current = null;
        for (const GraphNode of openSet) {
            if (current === null || GraphNode.fCost < current.fCost) {
                current = GraphNode;
            }
        }
        
        if (current === endNode) {
            return reconstructPath(current);
        }
        
        if (current){

            openSet.delete(current);
            closedSet.add(current);
            
            // for (const neighbor of getNeighbors(current)) {
            for (const neighbor of current.neighbors) {
                if (closedSet.has(neighbor)) continue;
                
                const newGCost = current.gCost + calculateEdgeCost(current, neighbor);
                if (!openSet.has(neighbor) || newGCost < neighbor.gCost) {
                    openSet.add(neighbor);
                    neighbor.parent = current;
                    neighbor.gCost = newGCost;
                    neighbor.hCost = calculateHeuristicCost(neighbor, endNode);
                    neighbor.fCost = neighbor.gCost + neighbor.hCost;
                }
            }
        }

    }
    
    return null; // No path found
}

function calculateEdgeCost(nodeA: GraphNode, nodeB: GraphNode): number {
    return 1;
}

function calculateHeuristicCost(nodeA: GraphNode, nodeB: GraphNode): number {
    // You can use different heuristics, like Euclidean distance or Manhattan distance.
    // Here, we'll use Manhattan distance for simplicity.
    // return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
    return 1;
}

function reconstructPath(GraphNode: GraphNode): GraphNode[] {
    const path = [];
    while (GraphNode) {
        path.unshift(GraphNode);
        GraphNode = GraphNode.parent;
    }
    return path;
}