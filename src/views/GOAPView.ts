import { ItemView, Plugin, WorkspaceLeaf } from "obsidian";
import { aStar } from "src/graph/a-star";
import { Goap } from "src/graph/GOAP";
import { Graph, MakeGraph } from "src/graph/Graph";

export const VIEW_TYPE_GOAP = 'goap-view';

export class GoapView extends ItemView {

    goalSelectElem:HTMLSelectElement;
    actionSelectElem:HTMLSelectElement;
    progressElem:HTMLProgressElement;

    costElem:HTMLParagraphElement;
    planTableElem:HTMLTableElement;

    graph:Graph;
    goap:Goap;

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

        this.costElem = container.createEl("p",{text: "Cost to traverse: 0"})

        this.planTableElem = container.createEl("table",{text: "Plan"})

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
    }

    

}

function onSelectChanged(view:GoapView){
    // console.log(`selection changed! ${view.selectElem.selectedIndex}`)
    // view.progressElem.value = 33*(view.selectElem.selectedIndex + 1)

    const actionNode = view.goap.actions[view.actionSelectElem.selectedIndex].node
    const goalNode = view.goap.goals[view.goalSelectElem.selectedIndex].node
    const plan = aStar(actionNode, goalNode)
    console.log(plan)

    view.planTableElem.remove()
    
    view.planTableElem = view.containerEl.createEl("table",{text: "GOAP Plan"})

    if (!plan) return;

    for(let i = 0; i < plan.length; i++){
        const row = view.planTableElem.insertRow(i)
        row.textContent = plan[i].name
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
      leaf = workspace.getRightLeaf(false);
    //   leaf = workspace.getLeaf('tab');
      await leaf.setViewState({ type: VIEW_TYPE_GOAP, active: true });
    }

    // "Reveal" the leaf in case it is in a collapsed sidebar
    workspace.revealLeaf(leaf);
}