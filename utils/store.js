const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '..', 'database', 'users.json');
const STEPS_FILE = path.join(__dirname, '..', 'database','steps.json');

let users = [];
let steps = [];

loadSteps();
loadUsers();

function initStore(){
    loadUsers();
    loadSteps();
}

function getNextID(table) {
    
    let nextID = 1;
    if (table.length == 0){
        return nextID;
    }
    let maxindex = 0
    for (let i = 1; i < table.length; i++) {
        if (table[i].id > table[maxindex].id) {
            maxindex = i;     
        }
    }
    return table[maxindex].id + 1;
}

function loadUsers(){
    if (fs.existsSync(USERS_FILE)){
        const raw = fs.readFileSync(USERS_FILE);
        try{
            users = JSON.parse(raw);
        }catch(err){
            console.log('Hiba az adatok beolvasása során!', err);
            users = [];
        }
    }else{
        saveUsers(users);
    }
}

function loadSteps(){
    if (fs.existsSync(STEPS_FILE)){
        const raw = fs.readFileSync(STEPS_FILE);
        try{
            steps = JSON.parse(raw);
        }catch(err){
            console.log('Hiba az adatok beolvasása során!', err);
            steps = [];
        }
    }else{
        saveSteps(steps);
    }
}

function saveUsers(users){
    fs.writeFileSync(USERS_FILE, JSON.stringify(users));
}

function saveSteps(steps){
    fs.writeFileSync(STEPS_FILE, JSON.stringify(steps));
}

function IsEmailExists(email){
    let exists = false;
    users.forEach(user => {
        if (user.email == email){
            exists = true;
            return;
        }
    });
    return exists;
}

module.exports = {
    users,
    steps,
    initStore,
    saveUsers,
    saveSteps,
    getNextID,
    IsEmailExists
}

