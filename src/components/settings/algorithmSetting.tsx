import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Algorithms from '../../domain/algorithms';
import AddIcon from '@material-ui/icons/Add';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Tooltip from '@material-ui/core/Tooltip';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import AlgorithmExplanation from './algorithmExplanation';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 135,
      marginLeft: theme.spacing(6.5)
    },
    formControlAddEdge: {
      margin: theme.spacing(1),
      minWidth: 300,
    },
    dialogTitle: {
      textAlign: 'center'
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    },
    addNodeIcon: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
      color: "black",
      fontSize: 35,
      cursor: "pointer",
      marginLeft: theme.spacing(6.5)
    },
    addEdgeIcon: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(2.5),
      color: "black",
      fontSize: 30,
      cursor: "pointer"
    },
    executeAlgorithmBtn: {
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(3)
    },
    sliderRoot: {
      marginTop: theme.spacing(3),
      width: 135,
      marginLeft: theme.spacing(6.5)
    }
  }),
);

interface SimpleDialogProps {
  open: boolean;
  nodes: number;
  onClose: (value: IAddEdge) => void;
}

interface IAddEdge {
  fromNode: string;
  toNode: string;
  weight: string;
}

function SimpleDialog(props: SimpleDialogProps) {
  const classes = useStyles();
  const { onClose, nodes, open } = props;

  const [chosenFromNode, setFromNode] = React.useState('');

  const [chosenToNode, setToNode] = React.useState('');

  const [chosenEdgeWeight, setEdgeWeight] = React.useState('');

  const handleSelectFromNode = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFromNode(event.target.value as string);
  };

  const handleSelectToNode = (event: React.ChangeEvent<{ value: unknown }>) => {
    setToNode(event.target.value as string);
  };

  const handleEdgeWeight = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEdgeWeight(event.target.value as string);
  };

  const handleClose = (e: any) => {
    if (e.target.innerText === 'ADD') {
      onClose({fromNode: chosenFromNode, toNode: chosenToNode, weight: chosenEdgeWeight});
    } else {
      onClose({fromNode: '', toNode: '', weight: ''});
    }
    setFromNode('');
    setToNode('');
    setEdgeWeight('');
  };

  let nodeOptions = []
  for (let i = 0; i < nodes; i++) {
    nodeOptions.push(<MenuItem key={i} value={i}> {i} </MenuItem>)
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle className={classes.dialogTitle} id="simple-dialog-title">Add Edge</DialogTitle>
      <FormControl className={classes.formControlAddEdge}>
        <InputLabel id="from-node-select-label">From Node</InputLabel>
        <Select
          labelId="from-node-select-label"
          id="from-node-select"
          value={chosenFromNode}
          onChange={handleSelectFromNode}
        >
          {nodeOptions}
        </Select>
      </FormControl>
      <FormControl className={classes.formControlAddEdge}>
        <InputLabel id="to-node-select-label">To Node</InputLabel>
        <Select
          labelId="to-node-select-label"
          id="to-node-select"
          value={chosenToNode}
          onChange={handleSelectToNode}
        >
          {nodeOptions}
        </Select>
      </FormControl>
      <TextField
        className={classes.formControlAddEdge}
        id="edge-weight"
        label="Weight"
        type="number"
        onChange={handleEdgeWeight}
        value={chosenEdgeWeight}
      />
      <DialogActions>
        <Button onClick={(e) => handleClose(e)} color="primary">
          Close
        </Button>
        <Button onClick={(e) => handleClose(e)} color="primary" autoFocus>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const AlgorithmSetting = (props: any) => {
    const classes = useStyles();

    const [chosenAlgorithm, setAlgorithm] = React.useState('');

    const [chosenStartingNode, setStartingNode] = React.useState('');

    const [chosenTargetNode, setTargetNode] = React.useState('');

    const [isDirected, setDirection] = React.useState(true);

    const [chosenSpeed, setSpeed] = React.useState(2);

    const [openDialog, setOpenDialog] = React.useState(false);

    const [openDialogAlgorithmExp, setOpenDialogAlgorithmExp] = React.useState(false);

    const handleSelectAlgorithm = (event: React.ChangeEvent<{ value: unknown }>) => {
        setAlgorithm(event.target.value as string);
    };

    const handleSelectStartingNode = (event: React.ChangeEvent<{ value: unknown }>) => {
        setStartingNode(event.target.value as string);
    };

    const handleSelectTargetNode = (event: React.ChangeEvent<{ value: unknown }>) => {
        setTargetNode(event.target.value as string);
    };

    const handleExecutionSpeed = (event: React.ChangeEvent<{}>, newValue: number | number[]) => {
      setSpeed(Number(newValue));
    }

    const handleValueText = (speed: number) => {
      return `${speed}s`;
    }

    const handleEdgeDirection = (event: React.ChangeEvent<HTMLInputElement>) => {
      setDirection(event.target.checked);
      props.changeGraphDirection(event.target.checked);
    };

    const handleClickOpenDialog = () => {
      setOpenDialog(true);
    };

    const handleCloseDialog = (edge: IAddEdge) => {
      setOpenDialog(false);
      if (edge.fromNode !== '' && edge.toNode !== '') {
        props.addEdge(+edge.fromNode, +edge.toNode, edge.weight );
      }
    };

    const handleOpenDialogAlgorithmExp = () => {
      setOpenDialogAlgorithmExp(true);
    }

    const handleCloseDialogAlgorithmExp = () => {
      setOpenDialogAlgorithmExp(false);
      const executionOption = { algorithm: chosenAlgorithm, startingNode: chosenStartingNode, targetNode: chosenTargetNode, speed: chosenSpeed };
      props.executeVisualization(executionOption);
    }

    const handleExecuteAlgorithm = () => {
      handleOpenDialogAlgorithmExp();
    }

    const handleAlgorithmExpContentText = () => {
      if (chosenAlgorithm === Algorithms.BFS.toString()) {
        return (
          <div style={{
            color: 'black'
          }}>
            <p>O algoritmo BFS visita todos os vértices de um grafo e explora apenas arestas que ainda não foram visitadas.</p>
            <p>Pode ser executado para grafos dirigidos e não-dirigidos. </p>
            <p>Geralmente é utilizado para descobrir todos vértices que podem ser alcançados a partir de um vértice inicial, sendo essa a execução utilizada nessa ferramenta de visualização.</p>
            <p>Todos os vértices adjacentes de um vértice <i>v</i> são descobertos antes de continuar explorando o grafo, sendo oposto do DFS.</p>
            <p>Há possibilidade de adaptá-lo para determinar o caminho mais curto entre dois vértices de um grafo sem peso nas arestas.</p>
            <p>BFS não resolve um problema específico, é um algoritmo intermediário que pode ser utilizado para resolver diversos problemas na computação, como por exemplo, motores de recomendações até K níveis de distância.</p>
            <p>A complexidade de tempo de execução por Grande-O é O(V + E), sendo V o número de vértices e E o número de arestas.</p>
            <p>Caso possua, o peso das arestas é ignorado na execução.</p>
          </div>
        )
      } else if (chosenAlgorithm === Algorithms.DFS.toString()) {
          return (
            <div style={{
              color: 'black'
            }}>
              <p>O algoritmo DFS visita todos os vértices de um grafo e explora apenas arestas que ainda não foram visitadas. </p>
              <p>Pode ser executado para grafos dirigidos e não-dirigidos. </p>
              <p>Geralmente é utilizado para descobrir todos vértices que podem ser alcançados a partir de um vértice inicial, sendo essa a execução utilizada nessa ferramenta de visualização. </p>
              <p>Frequentemente é adaptado para gerar uma ordem topológica dos vértices do grafo, sendo utilizada para situações onde há uma ordem de execução de tarefas a ser respeitada. </p>
              <p>Sempre que possível, DFS aprofunda até o último nível de um caminho através das arestas. Quando não há outra aresta para percorrer, o algoritmo realiza backtracking para visitar todas arestas dos vértices anteriores.  </p>
              <p>Não é possível descobrir o caminho mais curto entre dois vértices de um grafo sem ou com peso nas arestas. </p>
              <p>A complexidade de tempo de execução por Grande-O é O(V + E), sendo V o número de vértices e E o número de arestas.</p>
              <p>Caso possua, o peso das arestas é ignorado na execução.</p>
            </div>
          )
      } else if (chosenAlgorithm === Algorithms.DIJKSTRA.toString()) {
          return (
            <div style={{
              color: 'black'
            }}>
              <p>O algoritmo de Dijkstra visa resolver o problema de caminho mais curto em um grafo dirigido ou não-dirigido com pesos não-negativos nas arestas. O caminho mais curto é calculado pela soma dos pesos das arestas. </p>
              <p>Quando é executado a partir de um vértice inicial <i>v</i>, é calculado o caminho mais curto entre <i>v</i> e todos os outros vértices que podem ser alcançados. </p>
              <p>Após término do algoritmo, geralmente busca-se o caminho mais curto entre dois vértices específicos, sendo essa a proposta de implementação nessa ferramenta. </p>
              <p>A complexidade de tempo de execução por Grande-O é O(E * log(V)), sendo E o número de arestas e V o número de vértices.</p>
              <p>Possui proposta semelhante ao algoritmo de Bellman-Ford e melhor complexidade de tempo, no entanto, Dijkstra falha em grafos com pesos negativos nas arestas. </p>
              <p>Arestas sem peso terão valor 1 inferido nos cálculos.</p>
            </div>
          )
      } else if (chosenAlgorithm === Algorithms.BELLMAN_FORD.toString()) {
          return (
            <div style={{
              color: 'black'
            }}>
              <p>O algoritmo de Bellman-Ford visa resolver o problema de caminho mais curto em um grafo dirigido ou não-dirigido e permitindo pesos negativos nas arestas. O caminho mais curto é calculado pela soma dos pesos das arestas. </p>
              <p>Quando é executado a partir de um vértice inicial <i>v</i>, é calculado o caminho mais curto entre <i>v</i> e todos os outros vértices que podem ser alcançados. </p>
              <p>Após término do algoritmo, geralmente busca-se o caminho mais curto entre dois vértices específicos, sendo essa a proposta de implementação nessa ferramenta. </p>
              <p>A complexidade de tempo de execução por Grande-O é O(V * E), sendo V o número de vértices e E o número de arestas.</p>
              <p>Por possuir tempo de execução maior do que Dijkstra, é recomendado utilizar apenas quando há possibilidade de pesos negativos nas arestas, pois o algoritmo de Dijkstra falha nesse quesito.</p>
              <p>Arestas sem peso terão valor 1 inferido nos cálculos.</p>
            </div>
          )
      } else if (chosenAlgorithm === Algorithms.KRUSKAL.toString()) {
          return (
            <div style={{
              color: 'black'
            }}>
              <p>O algoritmo de Kruskal encontra a árvore geradora mínima com menor peso em um grafo não-dirigido. </p>
              <p>Uma árvore geradora é um sub-grafo com todos as arestas que conectam todos os vértices do grafo original. </p>
              <p>Nesse caso, busca-se o conjunto de arestas com menor peso e que conecte todos os vértices do grafo.</p>
              <p>O peso de uma árvore geradora mínima é dado pela soma do peso de todas as arestas.</p>
              <p>A complexidade de tempo de execução por Grande-O é O(E log E), sendo E o número de arestas.</p>
              <p>A ferramenta permite execução em grafos dirigidos para fins didáticos. </p>
              <p>Arestas sem peso terão valor 1 inferido nos cálculos.</p>
            </div>
          )
      } else {
          return (
            <div></div>
          )
      }
    }

    const handleClearGraph = () => {
      setStartingNode('');
      setTargetNode('');
      props.clearGraph();
    }

    const mustHasStartNode = () => {
      return [Algorithms.KRUSKAL.toString()].indexOf(chosenAlgorithm) === -1;
    }

    const mustHasTargetNode = () => {
      return [Algorithms.BFS.toString(), Algorithms.DFS.toString(), Algorithms.KRUSKAL.toString()].indexOf(chosenAlgorithm) === -1;
    }

    const marks = [
    {
      value: 1,
      label: '1s',
    },
    {
      value: 3,
      label: '3s',
    },
    {
      value: 5,
      label: '5s',
    }
  ];

    const algorithms = [Algorithms.BFS, Algorithms.DFS, Algorithms.DIJKSTRA, Algorithms.BELLMAN_FORD, Algorithms.KRUSKAL]
    let algorithmOptions = []
    for (let i = 0; i < algorithms.length; i++) {
        algorithmOptions.push(<MenuItem key={algorithms[i]} value={algorithms[i]}> {algorithms[i]} </MenuItem>)
    }

    let nodeOptions = []
    for (let i = 0; i < props.nodes; i++) {
      nodeOptions.push(<MenuItem key={i} value={i}> {i} </MenuItem>)
    }
    return (
        <div>
          <FormControl className={classes.formControl}>
            <FormControlLabel
              control={
                <Switch
                  checked={isDirected}
                  onChange={handleEdgeDirection}
                  name="edgeDirection"
                  color="primary"
                />
              }
              label="Directed Graph"
              disabled={props.nodes > 0}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="algorithm-select-label">Algorithm</InputLabel>
            <Select
            labelId="algorithm-select-label"
            id="algorithm-select"
            value={chosenAlgorithm}
            onChange={handleSelectAlgorithm}
            >
                {algorithmOptions}
            </Select>
          </FormControl>
            <ListItem >
              <ListItemIcon>
                <Tooltip title="Add Node">
                  <AddIcon className={classes.addNodeIcon} aria-label="Add Node" onClick={() => { props.addNode() }}/>
                </Tooltip>
              </ListItemIcon>
              <ListItemIcon>
                <Tooltip title="Add Edge">
                  <SyncAltIcon className={classes.addEdgeIcon} aria-label="Add Edge" onClick={() => handleClickOpenDialog()} />
                </Tooltip>
              </ListItemIcon>
            </ListItem>
          <FormControl className={classes.formControl}>
            <InputLabel id="starting-node-select-label">Starting Node</InputLabel>
            <Select
            labelId="starting-node-select-label"
            id="starting-node-select"
            value={chosenStartingNode}
            onChange={handleSelectStartingNode}
            disabled={!mustHasStartNode()}
            >
                {nodeOptions}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="target-node-select-label">Target Node</InputLabel>
            <Select
            labelId="target-node-select-label"
            id="target-node-select"
            value={chosenTargetNode}
            onChange={handleSelectTargetNode}
            disabled={!mustHasTargetNode()}
            >
                {nodeOptions}
            </Select>
          </FormControl>
          <div className={classes.sliderRoot}>
            <Typography id="discrete-slider-small-steps" gutterBottom>
              Speed
            </Typography>
            <Slider
              defaultValue={2}
              getAriaValueText={handleValueText}
              aria-labelledby="discrete-slider-small-steps"
              step={1}
              marks={marks}
              min={1}
              max={5}
              onChange={handleExecutionSpeed}
              value={chosenSpeed}
              valueLabelDisplay="auto"
            />
          </div>
          <div>
            <Button className={classes.executeAlgorithmBtn} variant="contained" onClick={() => handleClearGraph()}>
              Clear
            </Button>
            <Button className={classes.executeAlgorithmBtn} variant="contained" color="primary" onClick={() => handleExecuteAlgorithm()}>
              Execute
            </Button>
          </div>
          <SimpleDialog nodes={props.nodes} open={openDialog} onClose={handleCloseDialog} />
          <AlgorithmExplanation algorithm={chosenAlgorithm} contentText={handleAlgorithmExpContentText()} open={openDialogAlgorithmExp} onClose={handleCloseDialogAlgorithmExp} />
        </div>
    );
}

export default AlgorithmSetting;
