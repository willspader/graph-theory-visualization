import React from 'react';

import SideBar from './sidebar';
import AlgorithmChoose from '../domain/algorithmChoose';
import Algorithms from '../domain/algorithms';
import Colors from '../domain/colors';

import greuler from "greuler";
import PriorityQueue from '../data-structure/priorityQueue';
import Message from './message';

interface UnweightedGraph {
    target: number;
    edgeIdx: number;
}

interface WeightedGraph {
    target: number;
    edgeIdx: number;
    weight: number;
}

interface Edge {
    source: number;
    target: number;
    weight: number;
    edgeId: number;
}

interface EdgeIdx {
    node: number;
    idx: number;
}

interface UnionFindParentRank {
    parent: number;
    rank: number;
}

class Home extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.addNode = this.addNode.bind(this);
        this.addEdge = this.addEdge.bind(this);
        this.handleGraphDirection = this.handleGraphDirection.bind(this);
        this.clearGraph = this.clearGraph.bind(this);
        this.clearExecution = this.clearExecution.bind(this);
        this.executeGraphVisualization = this.executeGraphVisualization.bind(this);
        this.updateFinishAlgorithmState = this.updateFinishAlgorithmState.bind(this);

        this.state = {
            graphStruct: null,
            isDirected: true,
            speed: null,
            executed: true,
            start: false,
            finish: false
        };
    }

    componentDidMount = async () => {
        await this.getElementByIdAsync('app');
        this.startGraph();
    }

    startGraph() {
        this.setState({
            graphStruct: greuler({
                target: "#app"
            }).update()
        });
    }

    addNode() {
        let oldGraphState = this.state.graphStruct;
        const nextNodeId = oldGraphState.graph.nodes.length;

        oldGraphState.graph.addNode({ id: nextNodeId })

        this.setState({
            graphStruct: oldGraphState.update()
        });
    }

    addEdge(fromNode: number, toNode: number, weight: string) {
        let oldGraphState = this.state.graphStruct;

        const u = oldGraphState.graph.nodes[fromNode];
        const v = oldGraphState.graph.nodes[toNode];

        if (!u || !v) return;

        let edge: any;
        if (weight !== '') {
            edge = { source: u.id, target: v.id, directed: this.state.isDirected, displayWeight: weight };
        } else {
            edge = { source: u.id, target: v.id, directed: this.state.isDirected };
        }
        
        oldGraphState.graph.addEdge(edge);

        this.setState({
            graphStruct: oldGraphState.update()
        });
    }

    handleGraphDirection(isDirected: boolean) {
        this.setState({
            isDirected: isDirected
        });
    }

    executeGraphVisualization(executionOption: AlgorithmChoose) {
        this.setState({
            speed: executionOption.speed,
            executed: true,
            start: true,
            finish: false
        }, () => {
            setTimeout( () => {
                this.setState({
                    start: false
                });
            }, 2000)
        });

        const instance = this.state.graphStruct;
        if (executionOption.algorithm === Algorithms.DFS) {
            let adjacencyList = this.makeUnweightedGraph();
            this.dfs(instance, adjacencyList, executionOption.startingNode, []).then(() => {
                this.updateFinishAlgorithmState();
            });
        } else if (executionOption.algorithm === Algorithms.BFS) {
            let adjacencyList = this.makeUnweightedGraph();
            this.bfs(instance, adjacencyList, executionOption.startingNode).then(() => {
                this.updateFinishAlgorithmState();
            });
        } else if (executionOption.algorithm === Algorithms.DIJKSTRA) {
            let adjacencyList = this.makeWeightedGraph();
            this.dijkstra(instance, adjacencyList, executionOption.startingNode, executionOption.targetNode).then(() => {
                this.updateFinishAlgorithmState();
            });
        } else if (executionOption.algorithm === Algorithms.BELLMAN_FORD) {
            let edgeList = this.makeEdgeListGraph();
            this.bellmanFord(instance, edgeList, executionOption.startingNode, executionOption.targetNode).then(() => {
                this.updateFinishAlgorithmState();
            });
        } else if (executionOption.algorithm === Algorithms.KRUSKAL) {
            let edgeList = this.makeEdgeListGraph();
            this.kruskal(instance, edgeList).then(() => {
                this.updateFinishAlgorithmState();
            });
        }
    }

    updateFinishAlgorithmState() {
        this.setState({
            finish: true
        }, () => {
            setTimeout( () => {
                this.setState({
                    finish: false
                });
            }, 4000)
        });
    }

    async dfs(instance: any, adjacencyList: Array<Array<UnweightedGraph>>, v: number, visited: boolean[]) {
        try {
            await this.delay(this.state.speed);
            visited[v] = true;
            for (let i = 0; adjacencyList[v] && i < adjacencyList[v].length; i++) {
                if (visited[adjacencyList[v][i].target]) {
                    continue;
                }
                const edge = instance.graph.edges[adjacencyList[v][i].edgeIdx];
                instance.selector.getEdge({id: edge.id}).attr('stroke', Colors.RED);
                await this.dfs(instance, adjacencyList, adjacencyList[v][i].target, visited);
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }

    async bfs(instance: any, adjacencyList: Array<Array<UnweightedGraph>>, v: number) {
        try {
            let visited: boolean[] = []

            let queue: number[] = []

            visited[v] = true;
            queue.push(v);

            await this.delay(this.state.speed);

            while (queue.length) {
                let currentNode : number = queue.shift() as number;
                for (let i = 0; adjacencyList[currentNode] && i < adjacencyList[currentNode].length; i++) {
                    if (visited[adjacencyList[currentNode][i].target]){
                        continue;
                    }
                    const edge = instance.graph.edges[adjacencyList[currentNode][i].edgeIdx];
                    instance.selector.getEdge({id: edge.id}).attr('stroke', Colors.RED);

                    visited[adjacencyList[currentNode][i].target] = true;
                    queue.push(adjacencyList[currentNode][i].target);

                    await this.delay(this.state.speed);
                }
            }
        } catch (e) {
            console.log(e);
            return;
        }
    }

    async dijkstra(instance: any, adjacencyList: Array<Array<WeightedGraph>>, startNode: number, targetNode: number) {
        try {
            let times: number[] = [];
            times[startNode] = 0;
            let nodes = instance.graph.nodes;
            nodes.forEach((node: any) => {
                if (node.id !== startNode) {
                    times[Number(node.id)] = Infinity;
                }
            });

            let backtrace: EdgeIdx[] = [];

            let pq = new PriorityQueue();
            pq.enqueue({targetNode: startNode, weightToNode: 0});
            
            while (!pq.isEmpty()) {
                let shortestStep = pq.dequeue();
                let currentNode = shortestStep?.targetNode;

                if (adjacencyList[currentNode!]) {
                    for (let i = 0; i < adjacencyList[currentNode!].length; i++) {
                        let neighbor = adjacencyList[currentNode!][i];
                        const edge = instance.graph.edges[neighbor.edgeIdx];
                        instance.selector.getEdge({id: edge.id}).attr('stroke', Colors.GREEN);
                        await this.delay(this.state.speed);
                        let time = Number(times[currentNode!]) + Number(neighbor.weight);

                        if (time < times[neighbor.target]) {
                            times[neighbor.target] = time;
                            backtrace[neighbor.target] = {node: currentNode!, idx: neighbor.edgeIdx};
                            pq.enqueue({targetNode: neighbor.target, weightToNode: time});
                        }
                    }
                }
            }

            let pathIdx = [];
            let lastStep = targetNode;

            while(lastStep !== startNode) {
                pathIdx.unshift(backtrace[lastStep].idx);
                lastStep = backtrace[lastStep].node;
            }

            pathIdx.forEach(edgeIdx => {
                const edge = instance.graph.edges[edgeIdx];
                instance.selector.getEdge({id: edge.id}).attr('stroke', Colors.RED);
            });
        } catch (e) {
            console.log(e);
            return;
        }
    }

    async bellmanFord(instance: any, edgeList: Array<Edge>, startNode: number, targetNode: number) {
        try {
            let dist: number[] = [];
            dist[startNode] = 0;
            let nodes = instance.graph.nodes;
            nodes.forEach((node: any) => {
                if (node.id !== startNode) {
                    dist[Number(node.id)] = Infinity;
                }
            });

            let backtrace: EdgeIdx[] = [];

            let nodesLength = instance.graph.nodes.length;
            for (let i = 1; i <= nodesLength; i++) {
                for (let j = 0; j < edgeList.length; j++) {
                    let source = edgeList[j].source;
                    let target = edgeList[j].target;
                    let weight = Number(edgeList[j].weight);

                    if (dist[source] !== Infinity && dist[source] + weight < dist[target]) {
                        dist[target] = Number(dist[source]) + Number(weight);
                        backtrace[target] = {node: source, idx: edgeList[j].edgeId}
                    }

                    let color = i % 2 === 0 ? Colors.GREEN : Colors.PURPLE;
                    instance.selector.getEdge({id: edgeList[j].edgeId}).attr('stroke', color);
                    await this.delay(Math.floor(this.state.speed/2));
                }
            }

            for (let i = 0; i < edgeList.length; i++) {
                let source = edgeList[i].source;
                let target = edgeList[i].target;
                let weight = Number(edgeList[i].weight);
                if (dist[source] !== Infinity && dist[source] + weight < dist[target]) {
                    console.log("negative weight cycle");
                    return;
                }
            }

            let pathIdx = [];
            let lastStep = targetNode;

            while(lastStep !== startNode) {
                pathIdx.unshift(backtrace[lastStep].idx);
                lastStep = backtrace[lastStep].node;
            }

            pathIdx.forEach(edgeIdx => {
                instance.selector.getEdge({id: edgeIdx}).attr('stroke', Colors.RED);
            });
        } catch (e) {
            console.log(e);
            return;
        }
    }

    async kruskal(instance: any, edgeList: Array<Edge>) {
        try {
            let sortedEdges: Array<Edge> = edgeList.sort((a, b) => Number(a.weight) - Number(b.weight));

            let mst: number[] = [];
            let components: UnionFindParentRank[] = [];

            let nodes = instance.graph.nodes;
            for (let i = 0; i < nodes.length; i++) {
                components.push({parent: i, rank: 0});
            }

            let edgeCount = 0;
            let idx = 0;

            while (edgeCount < nodes.length - 1) {
                let sourceRoot = await this.find(components, sortedEdges[idx].source);
                let targetRoot = await this.find(components, sortedEdges[idx].target);

                instance.selector.getEdge({id: sortedEdges[idx].edgeId}).attr('stroke', Colors.GREEN);
                await this.delay(this.state.speed);

                if (sourceRoot !== targetRoot) {
                    mst.push(sortedEdges[idx].edgeId);
                    edgeCount = edgeCount + 1;
                    await this.union(components, sourceRoot, targetRoot);
                }

                idx = idx + 1;
            }

            edgeList.forEach(edge => {
                instance.selector.getEdge({id: edge.edgeId}).attr('stroke', Colors.GREY);
            });
            
            mst.forEach(edgeIdx => {
                instance.selector.getEdge({id: edgeIdx}).attr('stroke', Colors.RED);
            });
        } catch (e) {
            console.log(e);
            return;
        }
    }

    async find(components: UnionFindParentRank[], element: number): Promise<number> {
        if (components[element].parent === element) {
            return element
        }
        return await this.find(components, components[element].parent)
    }

    async union(components: UnionFindParentRank[], elementX: number, elementY: number) {
        let rootX = await this.find(components, elementX);
        let rootY = await this.find(components, elementY);

        if (components[rootX].rank < components[rootY].rank) {
            components[rootX].parent = rootY;
        } else if (components[rootX].rank > components[rootY].rank) {
            components[rootY].parent = rootX;
        } else {
            components[rootY].parent = rootX;
            components[rootX].rank = components[rootX].rank + 1;
        }
    }

    clearGraph() {
        let oldGraphState = this.state.graphStruct;
        
        oldGraphState.graph.removeNodesByFn((n: { id: number; }) => n.id >= 0);

        this.setState({
            graphStruct: oldGraphState.update(),
            executed: false
        });
    }

    clearExecution() {
        const instance = this.state.graphStruct;
        for (let i = 0; i < instance.graph.edges.length; i++) {
            const edgeIdx = instance.graph.edges[i].id;
            instance.selector.getEdge({id: edgeIdx}).attr('stroke', Colors.GREY);
        }

        this.setState({
            executed: false
        });
    }

    getElementByIdAsync = (id: string) => new Promise(resolve => {
        const getElement = () => {
            const element = document.getElementById(id);
            if(element) {
                resolve(element);
            } else {
                requestAnimationFrame(getElement);
            }
        };
        getElement();
    });

    delay(n: number){
        return new Promise(function(resolve){
            setTimeout(resolve,n*1000);
        });
    }

    makeUnweightedGraph() {
        let adjacencyList: Array<Array<UnweightedGraph>> = [];
        const instance = this.state.graphStruct;
        for (let i = 0; i < instance.graph.edges.length; i++) {
            const source = instance.graph.edges[i].source.id;
            const target = instance.graph.edges[i].target.id;
            if (this.state.executed) {
                const edgeIdx = instance.graph.edges[i].id;
                instance.selector.getEdge({id: edgeIdx}).attr('stroke', Colors.GREY);
            }

            if (!adjacencyList[source]) {
                adjacencyList[source] = [];
            }
            adjacencyList[source].push({target: target, edgeIdx: i});
            
            if (!this.state.isDirected) {
                if (!adjacencyList[target]) {
                    adjacencyList[target] = [];
                }
                adjacencyList[target].push({target: source, edgeIdx: i});
            }
        }
        return adjacencyList;
    }

    makeWeightedGraph() {
        let adjacencyList: Array<Array<WeightedGraph>> = [];
        const instance = this.state.graphStruct;
        for (let i = 0; i < instance.graph.edges.length; i++) {
            const source = instance.graph.edges[i].source.id;
            const target = instance.graph.edges[i].target.id;
            const weight = instance.graph.edges[i].displayWeight ? instance.graph.edges[i].displayWeight : 1;
            if (this.state.executed) {
                const edgeIdx = instance.graph.edges[i].id;
                instance.selector.getEdge({id: edgeIdx}).attr('stroke', Colors.GREY);
            }

            if (!adjacencyList[source]) {
                adjacencyList[source] = [];
            }
            adjacencyList[source].push({target: target, edgeIdx: i, weight: weight});
            
            if (!this.state.isDirected) {
                if (!adjacencyList[target]) {
                    adjacencyList[target] = [];
                }
                adjacencyList[target].push({target: source, edgeIdx: i, weight: weight});
            }
        }
        return adjacencyList;
    }

    makeEdgeListGraph() {
        let edgeList: Array<Edge> = [];
        const instance = this.state.graphStruct;
        for (let i = 0; i < instance.graph.edges.length; i++) {
            const source = instance.graph.edges[i].source.id;
            const target = instance.graph.edges[i].target.id;
            const weight = instance.graph.edges[i].displayWeight ? instance.graph.edges[i].displayWeight : 1;
            const edgeId = instance.graph.edges[i].id;
            if (this.state.executed) {
                instance.selector.getEdge({id: edgeId}).attr('stroke', Colors.GREY);
            }
            edgeList.push({source: source, target: target, weight: weight, edgeId: edgeId});
        }
        return edgeList;
    }

    render() {
        return (
            <div>
                <div>
                    <SideBar 
                        executeVisualization={this.executeGraphVisualization}
                        clearGraph={this.clearGraph}
                        clearExecution={this.clearExecution}
                        nodes={this.state.graphStruct !== null ? this.state.graphStruct.graph.nodes.length : 0} 
                        addEdge={this.addEdge} 
                        addNode={this.addNode}
                        changeGraphDirection={this.handleGraphDirection}
                    />
                </div>
                <div style={{
                            marginLeft: '70%',
                            marginTop: '5%',
                            width: '25%'
                    }}>
                    <Message show={this.state.start || this.state.finish} message={this.state.start ? 'Iniciando Execução' : 'Execução Finalizada'} />
                </div> 
                <div style={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)',
                    height: '100vh',
                    width: '100%'
                }}>
                    <div id="app" style={{
                        height: '100vh', 
                        width: '100%'
                    }}>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home
