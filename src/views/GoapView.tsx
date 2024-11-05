import { ItemView, Plugin, WorkspaceLeaf } from "obsidian";
import { aStar } from "src/graph/a-star";
import { Goap } from "src/graph/GOAP";
import { Graph, MakeGraph } from "src/graph/Graph";
import { GraphNode } from "src/graph/Node";
import {ReactView} from "./Test"
import { Root, createRoot } from 'react-dom/client';

export const VIEW_TYPE_GOAP = 'goap-view';

export class GoapView extends ItemView {

    goalSelectElem:HTMLSelectElement;
    actionSelectElem:HTMLSelectElement;
    progressElem:HTMLProgressElement;

    costElem:HTMLParagraphElement;
    planTableElem:HTMLTableElement;

    graph:Graph;
    goap:Goap;

    root: Root | null = null;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);

        this.graph = MakeGraph(this.app)        
        this.goap = new Goap(this.graph)        
    }

    getViewType() {
        return VIEW_TYPE_GOAP;
    }

    getDisplayText() {
        return 'Example view';
    }

    async onOpen() {
        // console.log(this.)
        // this.selectElem.onchange = this.onSelectionChange
        
        const container = this.containerEl.children[1];
        // this.root = createRoot(this.containerEl.children[1]);

        container.empty();
        container.createEl('h4', { text: 'GOAP View' });

        container.createEl('h5', { text: 'Action' });
        this.actionSelectElem = container.createEl('select', {text: 'Select Action'})
        this.goap.actions.forEach(action => {
            this.actionSelectElem.createEl('option', {text: action.node.getNoteName()})
        });
        this.actionSelectElem.onchange = () => onSelectChanged(this)
        
        container.createEl('h5', { text: 'Goal' });
        this.goalSelectElem = container.createEl('select', {text: 'Select Goal'})
        this.goap.goals.forEach(goal => {
            this.goalSelectElem.createEl('option', {text: goal.node.getNoteName()})
        });
        this.goalSelectElem.onchange = () => onSelectChanged(this)

        container.createDiv()


        const calcPathBtn = container.createEl('button',{text: "Calcualte Path"})
        calcPathBtn.onclick = () => {
            onSelectChanged(this)
        }


        this.costElem = container.createEl("p",{text: "Cost to traverse: 0"})

        // this.root.render(
		// 	// <StrictMode>
		// 		<ReactView />,
		// 	// </StrictMode>,
        // )


        this.planTableElem = container.createEl("table",{text: "Plan"})


        
        // const tableElem = container.createEl("table",{text: "GOAP Plan"})
        // for(let i = 0; i < 5; i++){
        //     const row = tableElem.insertRow(i)
        //     row.textContent = `${i}`
        // }


        // container.createEl('h5', { text: 'Belief' });
        // this.selectElem = container.createEl('select', {text: 'Select Belief'})
        // this.goap.goals.forEach(goal => {
        //     this.selectElem.createEl('option', {text: goal.getNoteName()})
        // });
        // this.selectElem.onchange = () => onSelectChanged(this)

        // container.createEl('h5', { text: 'Goal' });
        // this.selectElem = container.createEl('select', {text: 'Select Goal'})
        // this.goap.goals.forEach(goal => {
        //     this.selectElem.createEl('option', {text: goal.getNoteName()})
        // });
        // this.selectElem.onchange = () => onSelectChanged(this)
        // this.selectElem.createEl('option',{text: "Option A"}, (el) => {
        //     // console.log(el.textContent)
        //     // console.log("option created!")
        // })
        // const option:HTMLOptionElement = this.selectElem.createEl('option',{text: "Option B"})
        // this.selectElem.createEl('option',{text: "Option C"})

        // option.onchange = () => {
        //     console.log("option a clicked!")
        // }

        // container.createDiv()
        // this.progressElem = container.createEl('progress',{text: 'Progress Bar!', value: '50'})
        // this.progressElem.max = 100
        // this.progressElem.value = 50
        // const table = container.createEl("table")
        // table.createEl("ul",{text: "hello"})
        

    }

    async onClose() {
        // Nothing to clean up.
        this.root?.unmount()
    }

    

}

function onSelectChanged(view:GoapView){
    // console.log(`selection changed! ${view.selectElem.selectedIndex}`)
    // view.progressElem.value = 33*(view.selectElem.selectedIndex + 1)

    // const actionNode = view.goap.actions[view.actionSelectElem.selectedIndex].node
    // const goalNode = view.goap.goals[view.goalSelectElem.selectedIndex].node
    // const plan = aStar(actionNode, goalNode)
    // console.log(plan)

    view.planTableElem.remove()
    
    view.planTableElem = view.containerEl.children[1].createEl("table",{text: "GOAP Plan"})

    const plans: GraphNode[][] = []

    const invalidPlans: GraphNode[][] = []

    for (let j = 0; j < view.goap.goals.length; j++){
        for (let i = 0; i < view.goap.actions.length; i++){
            const actionNode = view.goap.actions[i].node
            const goalNode = view.goap.goals[j].node

            const plan = aStar(actionNode, goalNode)
            if (!plan){
                invalidPlans.push([actionNode,goalNode])
                continue
            }
            plans.push(plan)

        }
    }

    plans.sort((a,b) => {
        return a.length - b.length
    })

    // if (!plan) return;

    for(let i = 0; i < plans.length; i++){
        const row = view.planTableElem.insertRow(i)
        const actionCell = row.insertCell(0)
        // const actionLink = actionCell.createEl('link',{text: plans[i][0].getNoteName()})
        // actionLink.href = plans[i][0].name
        const actionLink = actionCell.createEl('a',{text: plans[i][0].getNoteName()})
        // actionLink.href = plans[i][0].name
        actionLink.onclick = () => {
            const file = view.app.vault.getFileByPath(plans[i][0].name)
            if (!file) return
            // view.app.workspace.getLeaf('window').openFile(file)
            // view.leaf.getRoot().getContainer.lea.openFile(file)
            // console.log(view.leaf.getRoot().getRoot(''))
            view.app.workspace.getLeaf("tab").openFile(file)
            // view.app.workspace.iterateRootLeaves((leaf) => {
            //     console.log(leaf)
            //     leaf.openFile(file)
            // })
        }


        // actionLink.textContent = plans[i][0].getNoteName()
        // actionCell.textContent = `<a href="#">${}</a>`

        row.insertCell(1).textContent = plans[i][plans[i].length - 1].getNoteName()
        row.insertCell(2).textContent = `${plans[i].length - 1}`
        // row.textContent = plan[i].getNoteName()
    }
    for(let i = 0; i < invalidPlans.length; i++){
        const row = view.planTableElem.insertRow(plans.length + i)
        row.insertCell(0).textContent = invalidPlans[i][0].getNoteName()
        row.insertCell(1).textContent = invalidPlans[i][1].getNoteName()
        row.insertCell(2).textContent = "INF"
        // row.textContent = plan[i].getNoteName()
    }
        
}

function onActionGoalCombo(view:GoapView){
    const actionNode = view.goap.actions[view.actionSelectElem.selectedIndex].node
    const goalNode = view.goap.goals[view.goalSelectElem.selectedIndex].node
    const plan = aStar(actionNode, goalNode)
    // console.log(plan)

    view.planTableElem.remove()
    
    view.planTableElem = view.containerEl.children[1].createEl("table",{text: "GOAP Plan"})

    if (!plan) return;

    for(let i = 0; i < plan.length; i++){
        const row = view.planTableElem.insertRow(i)
        row.textContent = plan[i].getNoteName()
    }

}

export async function activateView(plugin:Plugin) {
    const { workspace } = plugin.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_GOAP);

    if (leaves.length > 0) {
      // A leaf with our view already exists, use that
      leaf = leaves[0];
    } else {
      // Our view could not be found in the workspace, create a new leaf
      // in the right sidebar for it
    //   leaf = workspace.getRightLeaf(false);
    leaf = workspace.getLeaf("split")
    // leaf = workspace.createLeafBySplit(workspace.iterateRootLeaves((leaf) => ))
    //   leaf = workspace.getLeaf('tab');
      await leaf.setViewState({ type: VIEW_TYPE_GOAP, active: true });
    }

    // "Reveal" the leaf in case it is in a collapsed sidebar
    workspace.revealLeaf(leaf);
}