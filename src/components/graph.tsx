import React from 'react';
import greuler from "greuler";

class Graph extends React.Component<any, any> {
    constructor(props: any) {
        super(props)
        this.test = this.test.bind(this);
        this.state = {
            graphStruct: null
        };
    }

    componentDidMount = async () => {
        await getElementByIdAsync('app');
        this.loadData();
    }

    loadData() {
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

    test(event: any) {
        console.log(event);
        console.log(this.state.graphStruct)
        let oldState = this.state.graphStruct;
        oldState.selector.highlightEdge(this.state.graphStruct.graph.edges[2])
        oldState.selector.highlightNode(this.state.graphStruct.graph.nodes[2])

        this.setState({
            graphStruct: oldState
        });
    }

    render() {
        console.log('printando grafo');
        console.log(this.state.graphStruct);

        if (this.state.graphStruct) {
            console.log('printando estrutura do grafo')
            console.log(this.state.graphStruct.graph);

            console.log('printando nodes do grafo')
            console.log(this.state.graphStruct.graph.nodes);

            console.log('printando arestas do grafo')
            console.log(this.state.graphStruct.graph.edges);

            console.log('highlight');
            console.log(this.state.graphStruct.graph.edges.length)
        }

        return (
            <div id="app" style={{
                height: '100vh', 
                width: '100%'
            }}>
                <button style={{
                marginLeft: '300px',
                marginTop: '300px'
            }} onClick={this.test}></button>
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

export default Graph
