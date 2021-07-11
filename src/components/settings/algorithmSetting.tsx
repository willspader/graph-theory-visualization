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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 135,
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    },
    addNodeIcon: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
      color: "black",
      fontSize: 35,
      cursor: "pointer"
    },
    addEdgeIcon: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(2.5),
      color: "black",
      fontSize: 30,
      cursor: "pointer"
    }
  }),
);

export default function AlgorithmSetting() {
    const classes = useStyles();

    const [chosenAlgorithm, setAlgorithm] = React.useState('');

    const algorithms = [Algorithms.BFS, Algorithms.DFS]
    let algorithmOptions = []
    for (let i = 0; i < algorithms.length; i++) {
        algorithmOptions.push(<MenuItem key={algorithms[i]} value={algorithms[i]}> {algorithms[i]} </MenuItem>)
    }

    const [chosenStartingNode, setStartingNode] = React.useState('');

    const handleSelectAlgorithm = (event: React.ChangeEvent<{ value: unknown }>) => {
        setAlgorithm(event.target.value as string);
    };

    const handleSelectStartingNode = (event: React.ChangeEvent<{ value: unknown }>) => {
        setStartingNode(event.target.value as string);
    };

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
                  <AddIcon className={classes.addNodeIcon} aria-label="Add Node" onClick={() => alert('oi')}/>
                </Tooltip>
              </ListItemIcon>
              <ListItemIcon>
                <Tooltip title="Add Edge">
                  <SyncAltIcon className={classes.addEdgeIcon} aria-label="Add Edge" onClick={() => alert('ola')} />
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
                <MenuItem value={0}> 0 </MenuItem>
                <MenuItem value={1}> 1 </MenuItem>
            </Select>
          </FormControl>
        </div>
    );
}
