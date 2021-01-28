import React, {useState} from 'react';
import _ from 'lodash';
import { FaFile, FaFolder, FaFolderOpen, FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import FormDialog from "./FormDialog";
import {FOLDER, RENAME, FILE} from "../utills/constants"
import AlertDialog from "./AlertDialog";
import '../App.css'

const attributes = {
    className: 'custom-root',
    disabledClassName: 'custom-disabled',
    dividerClassName: 'custom-divider',
    selectedClassName: 'custom-selected'
}

export function Node(props) {
    const { node, getChildren, level, onToggle, menuItems, setters } = props;
    const [showContextMenu, setShowContextMenu] = useState(false);

    const getName = (node) => _.last(node.path.split('/'));
    const handleClick = (e) => {
        if (e.type === 'click') {
            onToggle(node);
        } else if (e.type === 'contextmenu') {
            setShowContextMenu(true);
        }
    }

    const type_to_setter = {
        'Add file': setters.ADD,
        'Add folder': setters.ADD,
        'Rename': setters.RNAME,
        'Delete': setters.DEL
    }
    const handleClickOk = (name, type) => {
        if(type === RENAME){
            type_to_setter[type](`${node.path} ${name}`);
        }
        else{
            type_to_setter[type](`${node.path}/${name}`, type === 'Add file');
        }
    }
    const handleDeleteClick = () => {
        type_to_setter['Delete'](node.path);
    }
    // initial attributes for file
    let node_chevron = null;
    let node_icon = <FaFile />;
    let subtree_node = null;

    if(node.type === FOLDER){
        if(node.isOpen){
            node_chevron = <FaChevronDown />;
            node_icon = <FaFolderOpen />;
            subtree_node = _.map(getChildren(node), (child) => {
                return (<Node {...props} node={child} level={level+1} />)
            });
        }
        else{
            node_chevron = <FaChevronRight />;
            node_icon = <FaFolder />;
        }
    }

    let items = node.type === FILE ? menuItems.filter((item) => item.type === 'both') : menuItems;
    items = _.map(items, (item) => {
        return (
            <MenuItem attributes={attributes}>
                {
                    item.needNameInput ?
                        (<FormDialog text={item.text} onClickOk={handleClickOk} />) :
                        (
                            node.type === FOLDER ? (<AlertDialog text={item.text} alert_message={'Alert!'} content={'Are u sure to delete this folder? each folder/file inside will be deleted too.'} handleClickOk={handleDeleteClick} />) :
                                (<div onClick={handleDeleteClick}>{item.text}</div>)
                        )
                }
            </MenuItem>
        )
    });

    // each node have unique path
    let unique_id = node.path;
    return(
        <React.Fragment>
            <div style={{paddingLeft: `${level*15}px`}} >
                <ContextMenuTrigger id={unique_id}>
                    <div style={{marginRight: '5px', fontSize: '20px', backgroundColor: '#fff'}} onClick={handleClick} onContextMenu={handleClick} >
                        { node_icon }
                        { getName(node) }
                        { node_chevron }
                    </div>
                </ContextMenuTrigger>
                {
                    showContextMenu ? (<ContextMenu hideOnLeave={true} id={unique_id}>{items}</ContextMenu>) : null
                }
            </div>
            { subtree_node }
        </React.Fragment>
    )
}

export default Node;