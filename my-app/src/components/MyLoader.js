import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import {Container} from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from "@material-ui/core/InputLabel";
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import FormDialog from "./FormDialog";
import { MenuItem } from "react-contextmenu";
import { saveData, loadData } from '../Api'
import _ from "lodash";
import {FILE, FOLDER} from "../utills/constants";
import {getFatherPath} from "../utills/utills";

const useStyles = makeStyles((theme) => ({
    button:{
        marginBottom: theme.spacing(1)
    }
}));

export function MyLoader() {
    const classes = useStyles();
    const [treeName, setTreeName] = useState(null);
    const history = useHistory();
    const [nodes, setNodes] = useState({});

    const getRootNodes = (nodes) => {
        return _.map(_.filter(_.values(nodes), (node) => { return node.isRoot === true;}),(node) => _.last(node.path.split('/')));
    }
    const [allRoots, setAllRoots] = useState({});

    const onAddRoot = (newFile, is_file, is_root) => {
        if(newFile){
            if ((nodes != null || nodes) && newFile in nodes){
                alert(`There is already a file with this name in folder,\n Please insert different name!`);
                return;
            }
            let nodes_copy = JSON.parse(JSON.stringify(nodes)) || {};
            if(!is_root) {
                let father_path = getFatherPath(newFile);
                if (father_path == null || nodes[father_path].type === FILE) {
                    return;
                }
                nodes_copy[father_path].children.push(newFile);
            }

            nodes_copy[newFile] = is_file ? {
                path: newFile,
                type: FILE,
                isOpen: false
            } : {
                path: newFile,
                type: FOLDER,
                isOpen: false,
                children: []
            }
            if(is_root){
                nodes_copy[newFile].isRoot = true;
            }
            console.log(`Adding ${is_file ? FILE : FOLDER} ${newFile}`);
            saveData(nodes_copy);
            setNodes(nodes_copy);
        }
    };

    useEffect(() => {
    }, [allRoots, treeName])

    useEffect(() => {
        const onRender = async () => {
            let res = await loadData();
            setNodes(res);
            setAllRoots(getRootNodes(res));
        }
        onRender();
    }, [])
    const changedCateTreeOption = (name) => {
        setTreeName(name);
    }
    const loadClicked = () => {
        if(treeName === '' || treeName == null){
            alert('Please choose category tree first, and then click Load!');
            return;
        }
        history.push(`${process.env.PUBLIC_URL}/categorytree/tree?id=${treeName}`)
    }
    const createClicked = (name, type) => {

        let newRoots = allRoots.slice();
        newRoots.push(name);
        setAllRoots(newRoots);
        onAddRoot(`/${name}`, false, true);
        changedCateTreeOption(name);
    }

    let no_roots_bool = allRoots.length > 0;
    const InitialComponent = () => (
        <Grid align="center" item  className={classes.button}>
            <Button style={{marginTop: '10px', marginBottom: '10px', marginLeft: '5px'}} variant="contained" color="primary">
                <FormDialog text={'Create'} onClickOk={createClicked} />
            </Button>
        </Grid>
    );
    return(
        <div>
            <Container maxWidth={'md'} >
                    { no_roots_bool ? (
                        <Paper elevation={3} >
                            <Grid container alignItems={'center'} direction={'column'}>
                                <Grid item >
                                    <FormControl style={{minWidth: 250}} >
                                        <InputLabel>Select category tree</InputLabel>
                                        <Select value={treeName}
                                            onChange={(e) => changedCateTreeOption(e.target.value)}>
                                            {
                                                _.map(allRoots, (node) => {
                                                    return (<MenuItem value={node}>{node}</MenuItem>)
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item className={classes.button}>
                                    <Tooltip title="Go to selected category!">
                                        <Button style={{marginTop: '10px', marginBottom: '10px', marginRight: '5px'}} onClick={loadClicked} variant="contained" color="primary">
                                            Go!
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Create new category tree!">
                                        <Button style={{marginTop: '10px', marginBottom: '10px', marginLeft: '5px'}} variant="contained" color="primary">
                                            <FormDialog text={'Create'} onClickOk={createClicked} />
                                        </Button>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Paper>) :
                        (<InitialComponent/>)
                    }
            </Container>
        </div>
    )
}

export default MyLoader;