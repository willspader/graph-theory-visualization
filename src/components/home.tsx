import React from 'react';

import SideBar from './sidebar';
import AlgorithmChoose from '../domain/algorithmChoose';

import greuler from "greuler";

class Home extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.addNode = this.addNode.bind(this);
        this.addEdge = this.addEdge.bind(this);
        this.handleGraphDirection = this.handleGraphDirection.bind(this);
        this.clearGraph = this.clearGraph.bind(this);

        this.state = {
            graphStruct: null,
            isDirected: true
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
        alert(executionOption.algorithm);
        alert(executionOption.startingNode);
        alert(executionOption.speed);
    }

    clearGraph() {
        let oldGraphState = this.state.graphStruct;
        
        oldGraphState.graph.removeNodesByFn((n: { id: number; }) => n.id >= 0);

        this.setState({
            graphStruct: oldGraphState.update()
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

    render() {
        return (
            <div>
                <div>
                    <SideBar 
                        executeVisualization={this.executeGraphVisualization}
                        clearGraph={this.clearGraph}
                        nodes={this.state.graphStruct !== null ? this.state.graphStruct.graph.nodes.length : 0} 
                        addEdge={this.addEdge} 
                        addNode={this.addNode}
                        changeGraphDirection={this.handleGraphDirection}
                    />
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