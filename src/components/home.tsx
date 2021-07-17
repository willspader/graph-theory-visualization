import React from 'react';

import SideBar from './sidebar';

import greuler from "greuler";

class Home extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.addNode = this.addNode.bind(this);
        this.state = {
            graphStruct: null
        };
    }

    componentDidMount = async () => {
        await getElementByIdAsync('app');
        this.startGraph();
    }

    addNode() {
        let oldGraphState = this.state.graphStruct;
        const nextId = oldGraphState.graph.nodes.length;

        oldGraphState.graph.addNode({ id: nextId })

        this.setState({
            graphStruct: oldGraphState.update()
        });
    }

    startGraph() {
        this.setState({
            graphStruct: greuler({
                target: "#app",
                data: {
                    nodes: [
                        { id: 0 }, 
                        { id: 1 }, 
                        { id: 2 }, 
                        { id: 3 }, 
                        { id: 4 }, 
                        { id: 5 }
                    ],
                    edges: [
                        { source: 0, target: 1 },
                        { source: 0, target: 2, directed: true },
                        { source: 0, target: 3 },
                        { source: 1, target: 2, directed: true },
                        { source: 4, target: 0 },
                        { source: 5, target: 0, directed: true },
                        { source: 4, target: 5 }
                    ]
                }
            }).update()
        });
    }

    render() {
        return (
            <div>
                <div>
                    <SideBar addNode={this.addNode}/>
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

const getElementByIdAsync = (id: string) => new Promise(resolve => {
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

export default Home