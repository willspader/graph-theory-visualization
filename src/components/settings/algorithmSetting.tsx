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
    edgeDirectionInterruptor: {
      margin: theme.spacing(1),
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
    }
  }),
);

interface SimpleDialogProps {
  open: boolean;
  nodes: number;
  onClose: (value: IAddEdge) => void;
}

interface IAddEdge {
  fromNode: number;
  toNode: number;
  isDirected: boolean;
}

function SimpleDialog(props: SimpleDialogProps) {
  const classes = useStyles();
  const { onClose, nodes, open } = props;

  const [chosenFromNode, setFromNode] = React.useState('');

  const [chosenToNode, setToNode] = React.useState('');

  const [isDirected, setDirection] = React.useState(true);

  const handleSelectFromNode = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFromNode(event.target.value as string);
  };

  const handleSelectToNode = (event: React.ChangeEvent<{ value: unknown }>) => {
    setToNode(event.target.value as string);
  };

  const handleEdgeDirection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDirection(event.target.checked);
  };

  const handleClose = () => {
    onClose({fromNode: +chosenFromNode, toNode: +chosenToNode, isDirected: isDirected});
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
      <FormControlLabel
        control={
          <Switch
            checked={isDirected}
            onChange={handleEdgeDirection}
            name="edgeDirection"
            color="primary"
          />
        }
        className={classes.edgeDirectionInterruptor}
        label="Directed Edge"
      />
    </Dialog>
  );
}

const AlgorithmSetting = (props: any) => {
    const classes = useStyles();

    const [chosenAlgorithm, setAlgorithm] = React.useState('');

    const [chosenStartingNode, setStartingNode] = React.useState('');

    const [openDialog, setOpenDialog] = React.useState(false);

    const handleSelectAlgorithm = (event: React.ChangeEvent<{ value: unknown }>) => {
        setAlgorithm(event.target.value as string);
    };

    const handleSelectStartingNode = (event: React.ChangeEvent<{ value: unknown }>) => {
        setStartingNode(event.target.value as string);
    };

    const handleClickOpenDialog = () => {
      setOpenDialog(true);
    };

    const handleCloseDialog = (edge: IAddEdge) => {
      setOpenDialog(false);
      props.addEdge(edge.fromNode, edge.toNode, edge.isDirected);
    };

    const handleExecuteAlgorithm = () => {
      const executionOption = { algorithm: chosenAlgorithm, startingNode: chosenStartingNode }
      props.executeVisualization(executionOption);
    }

    const algorithms = [Algorithms.BFS, Algorithms.DFS]
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
                  <AddIcon className={classes.addNodeIcon} aria-label="Add Node" onClick={() => {props.addNode()}}/>
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
            >
                {nodeOptions}
            </Select>
          </FormControl>
          <div>
            <Button className={classes.executeAlgorithmBtn} variant="contained" onClick={() => {props.clearGraph()}}>
              Clear
            </Button>
            <Button className={classes.executeAlgorithmBtn} variant="contained" color="primary" onClick={() => handleExecuteAlgorithm()}>
              Execute
            </Button>
          </div>
          <SimpleDialog nodes={props.nodes} open={openDialog} onClose={handleCloseDialog} />
        </div>
    );
}

export default AlgorithmSetting;
