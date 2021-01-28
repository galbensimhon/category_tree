import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import {getItemsContextMenu} from '../utills/utills'
import Node from "./Node.js";
import {Container} from "@material-ui/core";

export function Tree(props) {
    const { nodes, setNodes, onRename, onDelete, onAdd, rootName } = props;

    const getRootNodes = (exposed) => {
        return _.filter(exposed, (node) => { return node.isRoot === true;});
    }
    const getExposedNodes = () => {
        return _.filter(_.values(nodes), (node) => { return node.path.startsWith(`/${rootName}/`) || node.path === `/${rootName}`;})
    }

    const exposedNodes = getExposedNodes();
    const rootNodes = getRootNodes(exposedNodes);
    const items = getItemsContextMenu();
    const setters = {
        ADD: onAdd,
        RNAME: onRename,
        DEL: onDelete,
    }

    const onToggle = (node) => {
        let nodes_copy = JSON.parse(JSON.stringify(nodes)) || {};
        nodes_copy[node.path].isOpen = !nodes_copy[node.path].isOpen;
        setNodes(nodes_copy);
    }
    const getChildNodes = (node) => {
        return _.map(node.children, (path) => {
            return nodes[path];
        });
    }

    return(
        <Container maxWidth={'md'} >
            {
                _.map(rootNodes, (node) => {
                    return (<Node node={node} getChildren={getChildNodes} level={1} onToggle={onToggle}
                                  menuItems={items} setters={setters} />)
                })
            }
        </Container>
    )
}

export default Tree;