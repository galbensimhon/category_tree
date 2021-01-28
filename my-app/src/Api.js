import {FOLDER, serverLocalHost} from './utills/constants'
import _ from "lodash";

export const loadData = async () => {
    let url = `${serverLocalHost}/calculate_tree/load`;
    try {
        let res = await fetch(url);
        let sean = await res.json();
        console.log(sean)
        return sean;
    }
    catch (e) {
        console.log('some error on load '+ e)
        return null;
    }
}

const collapseData = (data) => {
    let newData = _.values(data);
    newData = _.map(newData, (node) => {
        return node.isOpen ? {
            ...node,
            isOpen: false
        } : node;
    })
    let obj = {};
    _.forEach(newData, (node) => {
        obj[node.path] = node;
    })
    return obj;
}

export const saveData = async (data) => {
    let dataToSave = collapseData(data);
    try {
        const url = `${serverLocalHost}/calculate_tree/save`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSave)
        });
        return await res.json();
    }
    catch (e) {
        console.log(`while try to saving, the error: ${e}`);
        return {error: 'unexpected error, in frontend!'}
    }
}