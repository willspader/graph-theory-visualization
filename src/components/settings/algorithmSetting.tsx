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
    clearExecutionGraphBtn: {
      marginTop: theme.spacing(5),
      marginLeft: theme.spacing(5.5)
    },
    removeGraphBtn: {
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(6.3)
    },
    executeAlgorithmExecuteBtn: {
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(9)
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
    if (e.target.innerText === 'ADICIONAR') {
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
      <DialogTitle className={classes.dialogTitle} id="simple-dialog-title">Adicionar Aresta</DialogTitle>
      <FormControl className={classes.formControlAddEdge}>
        <InputLabel id="from-node-select-label">V??rtice de Sa??da</InputLabel>
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
        <InputLabel id="to-node-select-label">V??rtice de Entrada</InputLabel>
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
        label="Peso"
        type="number"
        onChange={handleEdgeWeight}
        value={chosenEdgeWeight}
      />
      <DialogActions>
        <Button onClick={(e) => handleClose(e)} color="primary">
          Cancelar
        </Button>
        <Button onClick={(e) => handleClose(e)} color="primary">
          Adicionar
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
            <h4>Proposta</h4>
            <p>O algoritmo BFS visita todos os v??rtices de um grafo e explora apenas arestas que ainda n??o foram visitadas.</p>
            <p>Pode ser executado para grafos dirigidos e n??o-dirigidos. </p>
            <p>Geralmente ?? utilizado para descobrir todos v??rtices que podem ser alcan??ados a partir de um v??rtice inicial, sendo essa a execu????o utilizada nessa ferramenta de visualiza????o.</p>
            <p>BFS n??o resolve um problema espec??fico, ?? um algoritmo intermedi??rio que pode ser utilizado para resolver diversos problemas na computa????o, como por exemplo, motores de recomenda????es at?? K n??veis de dist??ncia.</p>
            <h4>Execu????o</h4>
            <p>Todos os v??rtices adjacentes de um v??rtice <i>v</i> s??o descobertos antes de continuar explorando o grafo, sendo oposto do DFS.</p>
            <p>H?? possibilidade de adapt??-lo para determinar o caminho mais curto entre dois v??rtices de um grafo sem peso nas arestas.</p>
            <h4>Complexidade de Tempo</h4>
            <p>A complexidade de tempo de execu????o por Grande-O ?? O(V + E), sendo V o n??mero de v??rtices e E o n??mero de arestas.</p>
            <h4>Considera????es da Ferramenta</h4>
            <p>Caso possua, o peso das arestas ?? ignorado na execu????o.</p>
          </div>
        )
      } else if (chosenAlgorithm === Algorithms.DFS.toString()) {
          return (
            <div style={{
              color: 'black'
            }}>
              <h4>Proposta</h4>
              <p>O algoritmo DFS visita todos os v??rtices de um grafo e explora apenas arestas que ainda n??o foram visitadas. </p>
              <p>Pode ser executado para grafos dirigidos e n??o-dirigidos. </p>
              <p>Geralmente ?? utilizado para descobrir todos v??rtices que podem ser alcan??ados a partir de um v??rtice inicial, sendo essa a execu????o utilizada nessa ferramenta de visualiza????o. </p>
              <p>Frequentemente ?? adaptado para gerar uma ordem topol??gica dos v??rtices do grafo, sendo utilizada para situa????es onde h?? uma ordem de execu????o de tarefas a ser respeitada. </p>
              <p>N??o ?? poss??vel descobrir o caminho mais curto entre dois v??rtices de um grafo sem ou com peso nas arestas. </p>
              <h4>Execu????o</h4>
              <p>Sempre que poss??vel, DFS aprofunda at?? o ??ltimo n??vel de um caminho atrav??s das arestas. Quando n??o h?? outra aresta para percorrer, o algoritmo realiza backtracking para visitar todas arestas dos v??rtices anteriores.  </p>
              <h4>Complexidade de Tempo</h4>
              <p>A complexidade de tempo de execu????o por Grande-O ?? O(V + E), sendo V o n??mero de v??rtices e E o n??mero de arestas.</p>
              <h4>Considera????es da Ferramenta</h4>
              <p>Caso possua, o peso das arestas ?? ignorado na execu????o.</p>
            </div>
          )
      } else if (chosenAlgorithm === Algorithms.DIJKSTRA.toString()) {
          return (
            <div style={{
              color: 'black'
            }}>
              <h4>Proposta</h4>
              <p>O algoritmo de Dijkstra visa resolver o problema de caminho mais curto em um grafo dirigido ou n??o-dirigido com pesos n??o-negativos nas arestas. O caminho mais curto ?? calculado pela soma dos pesos das arestas. </p>
              <p>?? semelhante ao algoritmo de Bellman-Ford e melhor complexidade de tempo, no entanto, Dijkstra falha em grafos com pesos negativos nas arestas. </p>
              <h4>Execu????o</h4>
              <p>Quando ?? executado a partir de um v??rtice inicial <i>v</i>, ?? calculado o caminho mais curto entre <i>v</i> e todos os outros v??rtices que podem ser alcan??ados. </p>
              <p>Ap??s t??rmino do algoritmo, geralmente busca-se o caminho mais curto entre dois v??rtices espec??ficos, sendo essa a proposta de implementa????o nessa ferramenta. </p>
              <h4>Complexidade de Tempo</h4>
              <p>A complexidade de tempo de execu????o por Grande-O ?? O(E * log(V)), sendo E o n??mero de arestas e V o n??mero de v??rtices.</p>
              <h4>Considera????es da Ferramenta</h4>
              <p>Arestas sem peso ter??o valor 1 inferido nos c??lculos.</p>
              <p>Para visualizar o caminho mais curto entre dois v??rtices, escolha o v??rtice inicial e final no menu ?? esquerda.</p>
            </div>
          )
      } else if (chosenAlgorithm === Algorithms.BELLMAN_FORD.toString()) {
          return (
            <div style={{
              color: 'black'
            }}>
              <h4>Proposta</h4>
              <p>O algoritmo de Bellman-Ford visa resolver o problema de caminho mais curto em um grafo dirigido ou n??o-dirigido e permitindo pesos negativos nas arestas. O caminho mais curto ?? calculado pela soma dos pesos das arestas. </p>
              <p>Por possuir tempo de execu????o maior do que Dijkstra, ?? recomendado utilizar apenas quando h?? possibilidade de pesos negativos nas arestas, pois o algoritmo de Dijkstra falha nesse quesito.</p>
              <h4>Execu????o</h4>
              <p>Quando ?? executado a partir de um v??rtice inicial <i>v</i>, ?? calculado o caminho mais curto entre <i>v</i> e todos os outros v??rtices que podem ser alcan??ados. </p>
              <p>Ap??s t??rmino do algoritmo, geralmente busca-se o caminho mais curto entre dois v??rtices espec??ficos, sendo essa a proposta de implementa????o nessa ferramenta. </p>
              <h4>Complexidade de Tempo</h4>
              <p>A complexidade de tempo de execu????o por Grande-O ?? O(V * E), sendo V o n??mero de v??rtices e E o n??mero de arestas.</p>
              <h4>Considera????es da Ferramenta</h4>
              <p>Arestas sem peso ter??o valor 1 inferido nos c??lculos.</p>
              <p>Para visualizar o caminho mais curto entre dois v??rtices, escolha o v??rtice inicial e final no menu ?? esquerda.</p>
            </div>
          )
      } else if (chosenAlgorithm === Algorithms.KRUSKAL.toString()) {
          return (
            <div style={{
              color: 'black'
            }}>
              <h4>Proposta</h4>
              <p>O algoritmo de Kruskal encontra a ??rvore geradora m??nima com menor peso em um grafo n??o-dirigido. </p>
              <p>Uma ??rvore geradora ?? um sub-grafo com todos as arestas que conectam todos os v??rtices do grafo original. </p>
              <p>Cada v??rtice precisa ter ao menos uma areasta.</p>
              <h4>Execu????o</h4>
              <p>Nesse caso, busca-se o conjunto de arestas com menor peso e que conecte todos os v??rtices do grafo.</p>
              <p>O peso de uma ??rvore geradora m??nima ?? dado pela soma do peso de todas as arestas.</p>
              <h4>Complexidade de Tempo</h4>
              <p>A complexidade de tempo de execu????o por Grande-O ?? O(E log E), sendo E o n??mero de arestas.</p>
              <h4>Considera????es da Ferramenta</h4>
              <p>A ferramenta permite execu????o em grafos dirigidos para fins did??ticos. </p>
              <p>Arestas sem peso ter??o valor 1 inferido nos c??lculos.</p>
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

    const handleClearExecution = () => {
      props.clearExecution();
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
              label="Grafo Dirigido"
              disabled={props.nodes > 0}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="algorithm-select-label">Algoritmo</InputLabel>
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
                <Tooltip title="Adicionar V??rtice">
                  <AddIcon className={classes.addNodeIcon} aria-label="Adicionar V??rtice" onClick={() => { props.addNode() }}/>
                </Tooltip>
              </ListItemIcon>
              <ListItemIcon>
                <Tooltip title="Adicionar Aresta">
                  <SyncAltIcon className={classes.addEdgeIcon} aria-label="Adicionar Aresta" onClick={() => handleClickOpenDialog()} />
                </Tooltip>
              </ListItemIcon>
            </ListItem>
          <FormControl className={classes.formControl}>
            <InputLabel id="starting-node-select-label">V??rtice Inicial</InputLabel>
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
            <InputLabel id="target-node-select-label">V??rtice Destino</InputLabel>
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
              Velocidade
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
            <Button className={classes.executeAlgorithmExecuteBtn} variant="contained" color="primary" onClick={() => handleExecuteAlgorithm()}>
              Executar
            </Button>
            <Button className={classes.clearExecutionGraphBtn} variant="contained" onClick={() => handleClearExecution()}>
              Limpar Execu????o
            </Button>
            <Button className={classes.removeGraphBtn} variant="contained" onClick={() => handleClearGraph()}>
              Remover Grafo
            </Button>
          </div>
          <SimpleDialog nodes={props.nodes} open={openDialog} onClose={handleCloseDialog} />
          <AlgorithmExplanation algorithm={chosenAlgorithm} contentText={handleAlgorithmExpContentText()} open={openDialogAlgorithmExp} onClose={handleCloseDialogAlgorithmExp} />
        </div>
    );
}

export default AlgorithmSetting;
