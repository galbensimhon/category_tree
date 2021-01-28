import {ADD_FILE, ADD_FOLDER, DELETE, FOLDER, RENAME} from "./constants";
import _ from "lodash";

export const getFatherPath = (path) => {
    const regex = RegExp('(.*)\\/.+$', 'gm');
    let father_node = regex.exec(path) || null;
    return father_node != null ? father_node[1] : null;
}
export const getOldNodePath = (path) => {
    const regex = RegExp('(.*)\\s(.+)$', 'gm');
    let node = regex.exec(path) || null;
    return node != null ? [node[1], node[2]] : [null, null];
}

export const renameChild = (nodes_copy, old_name, new_name) => {
    _.forEach(nodes_copy[old_name].children, (child) => {
        renameChild(nodes_copy, child, `${new_name}/${_.last(child.split('/'))}`);
    });
    let new_children = _.map(nodes_copy[old_name].children, (child) => {
        return `${new_name}/${_.last(child.split('/'))}`;
    })
    nodes_copy[new_name] = {
        ...nodes_copy[old_name],
        path: new_name,
        children: new_children
    }
    delete nodes_copy[old_name];

}

export function getItemsContextMenu() {
    return [
        {
            text: ADD_FILE,
            type: FOLDER,
            needNameInput: true,
        },
        {
            text: ADD_FOLDER,
            type: FOLDER,
            needNameInput: true,
        },
        {
            text: DELETE,
            type: 'both',
        },
        {
            text: RENAME,
            type: 'both',
            needNameInput: true,
        }
    ];
}