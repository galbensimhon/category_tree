import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import {renameChild, getFatherPath, getOldNodePath} from '../utills/utills'
import {FILE, FOLDER} from "../utills/constants";
import {useHistory} from 'react-router-dom'
import Tree from "./Tree";
import queryString from 'query-string'
import {Button, Container, Typography} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Prompt }  from 'react-router';
import {loadData, saveData} from "../Api";

export function TreeContainer() {
    const [loading, setLoading] = useState(false);
    const [changeWithoutSaving, setChangeWithoutSaving] = useState(false);
    const [allData, setAllData] = useState({});
    const history = useHistory();

    const getExposedRootName = () => {
        let parsed = queryString.parse(window.location.search);
        if(!parsed || !parsed.id){
            alert('problem with getting category tree..');
            history.push(`${process.env.PUBLIC_URL}/`);
            return null;
        }
        return parsed.id;
    }
    const [rootName, setRootName] = useState(getExposedRootName());

    const getRootNodes = () => {
        return _.filter(_.values(allData), (node) => { return node.isRoot === true;});
    }

    const newSearchClicked = () => {
        history.push(`${process.env.PUBLIC_URL}/`);
    }
    const onSaveClicked = () => {
        saveData(allData);
        setChangeWithoutSaving(false);
    }

    const onRename = (newName) => {
        if(newName){
            let [old_node, name] = getOldNodePath(newName);
            if(old_node == null || name == null)
                return;
            // in case renaming the root
            let new_node = `/${name}`;
            let nodes_copy = JSON.parse(JSON.stringify(allData)) || {};
            if(!nodes_copy[old_node].isRoot){
                let father_path = getFatherPath(newName);
                if(father_path == null){
                    return;
                }
                new_node = `${father_path}/${name}`;
                if (new_node in allData){
                    alert(`There is already a file with this name in folder,\n Please insert different name!`);
                    return;
                }
                nodes_copy[father_path].children = nodes_copy[father_path].children.filter((item) => item !== old_node)
                nodes_copy[father_path].children.push(new_node);
            }
            else{
                // case renaming root name, and already have another root with the specific name
                let root_nodes = getRootNodes();
                if (root_nodes.includes(new_node)){
                    alert(`There is already a different root with this name,\n Please insert different name!`);
                    return;
                }
                setRootName(name);

            }
            renameChild(nodes_copy, old_node, new_node);
            console.log(`Renaming ${old_node} to ${new_node}`);
            setAllData(nodes_copy);
            setChangeWithoutSaving(true);
        }
    };
    const onDelete = (file) => {
        let nodes_copy = JSON.parse(JSON.stringify(allData)) || {};
        Delete(nodes_copy, file);
        setAllData(nodes_copy);
        console.log(`Deleting file ${file}`);
        setChangeWithoutSaving(true);
    }
    const Delete = (nodes_copy, file) => {
        if(file){
            if(nodes_copy[file].type === FOLDER){
                _.forEach(nodes_copy[file].children, (child) => {
                    Delete(nodes_copy, child);
                });
            }
            if(!nodes_copy[file].isRoot){
                let father_path = getFatherPath(file);
                if(father_path == null || allData[father_path].type === FILE){
                    return;
                }
                nodes_copy[father_path].children = nodes_copy[father_path].children.filter((item) => item !== file);
            }
            delete nodes_copy[file];
        }
    }
    const onAdd = (newFile, is_file) => {
        if(newFile){
            if ((allData != null || allData) && newFile in allData){
                alert(`There is already a file with this name in folder,\n Please insert different name!`);
                return;
            }
            let nodes_copy = JSON.parse(JSON.stringify(allData)) || {};
            let father_path = getFatherPath(newFile);
            if(father_path == null || allData[father_path].type === FILE){
                return;
            }
            nodes_copy[father_path].children.push(newFile);

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
            console.log(`Adding ${is_file ? FILE : FOLDER} ${newFile}`);
            setAllData(nodes_copy);
            setChangeWithoutSaving(true);
        }
    };

    useEffect(() => {
        const onRender = async () => {
            let res = await loadData();
            setAllData(res);
        }
        onRender();
    }, [])

    useEffect(() => {
        window.addEventListener('beforeunload', alertUser);
        window.addEventListener('unload', handleEnd);
        return () => {
            window.removeEventListener('beforeunload', alertUser);
            window.removeEventListener('unload', handleEnd);
        }
    }, [])
    const alertUser = e => {
        e.preventDefault()
        e.returnValue = ''
    }
    const handleEnd = async () => {
        await fetch({
            url: setChangeWithoutSaving(false),
            method: 'PUT'
        })
    }

    const LoadingComponent = () => (
        <Grid item container  justify={'center'} xs={12} style={{minHeight: 200}} >
            <Grid item xs={12} style={{marginTop: '10px'}}>
                <div style={{display: 'flex', flexDirection:'column', justifyContent: 'center', justifyItems: 'center'}}>
                    <Typography style={{marginBottom: '10px'}} variant="h5" align="center" color="textPrimary" >
                        Loading tree...
                    </Typography>
                    <CircularProgress style={{margin:'auto'}} color={'primary'}/>
                </div>
            </Grid>
        </Grid>
    );

    return(
        <div>
            <Prompt
                when={changeWithoutSaving}
                message={() => 'Are u sure to leave page?\nChanges you made may not be saved.'} />
            <Container maxWidth={'sm'} >
                <Grid item container justify={'center'} xs={12} md={12} spacing={0} wrap={"nowrap"}>
                    <Tooltip title="Go to select another tree!">
                        <Button onClick={newSearchClicked} style={{marginTop: '10px', marginBottom: '10px', marginRight: '5px'}} variant="contained" color="primary">
                            Change tree
                        </Button>
                    </Tooltip>
                    <Tooltip title="Saving your changes..">
                        <Button style={{marginTop: '10px', marginBottom: '10px', marginLeft: '5px'}} onClick={onSaveClicked} variant="contained" color="primary">
                            Save
                        </Button>
                    </Tooltip>
                </Grid>
            </Container>
            <Container maxWidth={'xl'}>
                <Paper elevation={3} style={{marginBottom: '10px'}}>
                    <Grid container justify={'center'}>
                        {loading ? <LoadingComponent/> :
                            <Grid item xs={12} style={{minHeight: 200, marginTop: '15px'}}>
                                    <Tree
                                        nodes={allData}
                                        setNodes={setAllData}
                                        onRename={onRename}
                                        onDelete={onDelete}
                                        onAdd={onAdd}
                                        onLoading={setLoading}
                                        rootName={rootName}
                                    />
                            </Grid>
                        }
                    </Grid>
                </Paper>
            </Container>
        </div>
    )
}

export default TreeContainer;
