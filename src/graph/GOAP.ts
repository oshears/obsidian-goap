// https://github.com/anvaka/ngraph.path
import { TFile } from "obsidian";
import { GraphNode } from "./Node";
import { Graph } from "./Graph";

export interface FileHolder {
    file:TFile
}

class Note {

    noteName: string;
    node:GraphNode
    
    constructor(node?:GraphNode){
        // if (file) this.file = file
        if (node){
            this.node = node
            this.noteName = node.name
        } 
    }

    
}

export class Goal extends Note {
    

}

export class Action extends Note {

}

export class Belief extends Note {

}

export class Sensor extends Note {

}

export class Goap {

    goals:Goal[] = []
    actions:Action[] = []
    sensors:Sensor[] = []
    beliefs:Belief[] = []

    graph:Graph;

    constructor(graph?:Graph){
        if (graph){
            graph.nodes.forEach(node => {
				if (node.name.contains("Actions/")){
					this.actions.push(new Action(node))
				}
				if (node.name.contains("Beliefs/")){
					this.beliefs.push(new Belief(node))
				}
				if (node.name.contains("Goals/")){
					this.goals.push(new Goal(node))
				}
				if (node.name.contains("Sensors/")){
					this.sensors.push(new Sensor(node))
				}
			}); 
        }
    }
}