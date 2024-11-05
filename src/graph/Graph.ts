import { App } from "obsidian";
import {GraphNode} from "./Node"

export class Graph {
    nodes:GraphNode[] = [];

    constructor(nodes?:GraphNode[]){
        if (nodes) {
            this.nodes = nodes;
        }
    }

    addNode(node:GraphNode){
        this.nodes.push(node);
    }
}

export function MakeGraph(app:App){

    const vault = app.vault;

    let graphFile = "digraph graphname {\n";

    // number of created nodes
    let nodeCount = 0;

    // map from markdown name to node id
    const nodeDict: {[id: string] : string; } = {};

    // list of graph nodes created
    const nodes:GraphNode[] = [];

    // list of markdown file names to graph nodes
    const nodeNameToObj: {[id: string] : GraphNode; } = {};
    
    for (const [key, values] of Object.entries(app.metadataCache.resolvedLinks)){

        // only consider files in the GOAP/ folder
        if (!key.contains("GOAP/")){
            continue;
        }

        // console.log(`(1)${key}\n(2)${value[0]}`)
        // nodes.add(key);

        // get name of node if already exists
        let nodeName = `${-1}`;
        if (nodeDict.hasOwnProperty(key)){
            nodeName = nodeDict[key];
        }
        // if it does not exist, make a new node
        else{
            nodeName = `${nodeCount}`;
            nodeDict[key] = nodeName

            // create new node object if it did not exist
            const newNode = new GraphNode(key,nodeCount,1);
            nodes.push(newNode);
            nodeNameToObj[key] = newNode;
            
            nodeCount++;
        }
        
        const endPoints = Object.keys(values);
        graphFile += ` ${nodeName} -> {`;

        // for each edge end point
        for(let i = 0; i <  endPoints.length; i++){
            // nodes.add(key);
            console.log(`(1)${key}\n(2)${endPoints[i]}`)
            
            let endPointId = `${-2}`

            // if the end point exists, record it and make a mapping
            if (nodeDict.hasOwnProperty(`${endPoints[i]}`)){
                endPointId = nodeDict[endPoints[i]];
            }
            else{
                endPointId = `${nodeCount}`;
                nodeDict[endPoints[i]] = `${nodeCount}`

                // create new node object to represent this node 
                const newNode = new GraphNode(endPoints[i],nodeCount,1);
                nodes.push(newNode);
                nodeNameToObj[endPoints[i]] = newNode;

                nodeCount++;
            }

            // establish link between nodes
            nodeNameToObj[key].addNext(nodeNameToObj[endPoints[i]]);

            graphFile += ` ${endPointId} ;`;
            
        }
        graphFile += ` }\n`;
        
    }

    for (const [key, values] of Object.entries(nodeDict)){
        graphFile += ` ${values} [label="${key}"];\n`
    }
    graphFile += "}"

    // writeFile('./graph.dot',graphFile,(err) => {
    vault.adapter.write("graph.dot",graphFile);
    // writeFile("/home/oshears/projects/primordial/goap-analysis")
    // writeFile(,graphFile,(err) => {
    // 	if (err){
    // 		console.log("error writing graph.dot file!");
    // 		return;
    // 	}
    // 	console.log(process.cwd())
    // 	// console.log("wrote graph.dot file!");
    // });

    console.log(nodes);

    // return graphFile;
    return new Graph(nodes);
}