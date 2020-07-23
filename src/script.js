// id
let i = 0;
let root;
let currentFolder;
// File
class File{
    constructor(id,name){
        this.id = id;
        this.text = '';
        this.name = name
    }
    open(){

    }
    close(){

    }
}
// Folder
class Folder{
    constructor(id,root,name){
        this.child = {};
        this.id = id;
        this.root = root;
        this.name = name;
    }

    addNewChildElement(idOfTheNewElement,type,name,root1){
        if(type === 'file'){
            const newChild = new File(idOfTheNewElement,name);
            this.child[idOfTheNewElement] = newChild;
            let idOfTheParent = root1.id;
            this.placeTheNode(this.createTheNewNode(
                idOfTheNewElement,
                type,
                name,
                ()=>{this.removeChildElement(idOfTheNewElement);this.removeTheChildNodeFromDom(idOfTheNewElement)},
                ()=>{this.child[idOfTheNewElement].open();console.log('clciked')}),
                `${idOfTheParent}Cont`);
            return this.child[idOfTheNewElement];
        }
        else if(type === 'folder'){
            const newChild = new Folder(idOfTheNewElement,root1,name);
            this.child[idOfTheNewElement] = newChild;
            let idOfTheParent = root1.id;
            this.placeTheNode(this.createTheNewNode(
                idOfTheNewElement,
                type,
                name,
                ()=>{
                    this.removeChildElement(idOfTheNewElement);
                    this.removeTheChildNodeFromDom(idOfTheNewElement);
                },
                ()=>{
                    currentFolder = this.child[idOfTheNewElement];
                    console.log('done');
                }),`${idOfTheParent}Cont`)
        return this.child[idOfTheNewElement]
        }
        console.log(this.root)
        return null;
    }
    removeChildElement(id){
        delete this.child[id];
        if(this.child[id]){
            return false;
        }
        return true;
    }
    createTheNewNode(idOfTheNewElement,type,name,callbackForRemovoning,callbackForClicking){
        if(type === 'file'){
            return this.createNewFileNode(idOfTheNewElement,name,callbackForRemovoning,callbackForClicking)
        }
        else if(type === 'folder'){
            console.log(this.createNewFolderNode(idOfTheNewElement,name,callbackForRemovoning,callbackForClicking))
            return this.createNewFolderNode(idOfTheNewElement,name,callbackForRemovoning,callbackForClicking);
            
        }
    }
    createNewFileNode(idOfTheNewElement,name,callbackForRemovoning,callbackForClicking){
        const newNode = document.createElement('div');
        newNode.classList.add('file');
        newNode.setAttribute('id',idOfTheNewElement);
        // File Name
        const FileName = document.createElement('div');
        FileName.classList.add('fileName');
        FileName.innerText = name; 
        // File Icon
        const FileIcon = document.createElement('div');
        FileIcon.classList.add('fileIcon');
        const extension = name.split('.')[1];
        if( extension === 'js'){
            FileIcon.classList.add('IconJS');
            FileIcon.innerHTML = '<i class="fab fa-js"></i>';
        }
        else if(extension === 'html' || extension === 'htm'){
            FileIcon.classList.add('IconHTML');
            FileIcon.innerHTML = '<i class="fab fa-html5"></i>';
        }
        else if(extension === 'css'){
            FileIcon.classList.add('IconCSS');
            FileIcon.innerHTML = '<i class="fab fa-css3-alt"></i>';
        }
        else{
            FileIcon.innerHTML = '<i class="fas fa-file"></i>';
        }
        // File Controlls 
        const FileControl = document.createElement('div');
        FileControl.classList.add('file');
        FileControl.classList.add('fileControls');
        // Close Button
        const CloseBtn = document.createElement('div');
        CloseBtn.classList.add('fileIcon');
        CloseBtn.classList.add('IconClose');
        CloseBtn.innerHTML = '<i class="fas fa-window-close"></i>';
        CloseBtn.addEventListener('click',callbackForRemovoning,true);
        FileControl.appendChild(CloseBtn);
        // appending The files To parent
        newNode.appendChild(FileIcon);
        newNode.appendChild(FileName);
        newNode.appendChild(FileControl);
        newNode.addEventListener('click',callbackForClicking,true);
        return newNode;
    }
    createNewFolderNode(idOfTheNewElement,name,callbackForRemovoning,callbackForClicking){
        // Main Node
        const newNode = document.createElement('div');
        newNode.classList.add('folder');
        newNode.setAttribute('id',idOfTheNewElement);
        newNode.addEventListener('click',callbackForClicking,true);
        // Folder Content
        const FolderRest = document.createElement('div');
        FolderRest.classList.add('folderRest');
        FolderRest.setAttribute('id',`${idOfTheNewElement}Cont`)
        // Header
        const FolderHeader = document.createElement('div');
        FolderHeader.classList.add('folderHeader');
        // Icons
        const MoreIcon = document.createElement('div');
        MoreIcon.classList.add('folderIcon');
        MoreIcon.innerHTML = '<i class="fas fa-chevron-down"></i>';
        MoreIcon.addEventListener('click',() => {MoreIcon.classList.toggle('folderMoreIcon');FolderRest.classList.toggle('folderRestActive')})
        const FolderIcon = document.createElement('div');
        FolderIcon.classList.add('folderIcon');
        FolderIcon.innerHTML = '<i class="fas fa-folder"></i>';
        // Title
        const FolderTitle = document.createElement('div');
        FolderTitle.innerText = name;
        FolderTitle.classList.add('folderTitle');
        // Appending
        FolderHeader.appendChild(MoreIcon);
        FolderHeader.appendChild(FolderIcon);
        FolderHeader.appendChild(FolderTitle);
        newNode.appendChild(FolderHeader);
        newNode.appendChild(FolderRest);
        return newNode;
    }
    removeTheChildNodeFromDom(id){
        document.getElementById(id).remove();
    }
    placeTheNode(node,parentId){
        document.getElementById(parentId).appendChild(node);
    }
}

// Callback  that is called when First create Folder is called
const createRoot = (creationalBtnsId,controlBtnsId) => {
    // Firstly we have to remove the creational buttons
    const creationalBtns = document.getElementById(creationalBtnsId);
    creationalBtns.remove();
    //Secondly we have to turn on the control buttons
    const controlBtns = document.getElementById(controlBtnsId).children;
    // Cause element.children returns a HtmlCollection i turn it to a array to be able to loop through it
    [...controlBtns].map(element => {
        element.removeAttribute('disabled');
    });
    // Thirdly create the root Folder
    // new Folder
    root = new Folder(i,undefined,'Your_Project');
    root.placeTheNode(root.createTheNewNode(i,'folder','Your_Project',()=>{root.removeTheChildNodeFromDom(i)},()=>{console.log('main clicked'); currentFolder = root}),'fileNavigation');
    // making the current folder to be the root
    currentFolder = root;
    // changing the idea
    i++;
    console.log(root);
}
// Callback For The creation of new File
const createNewFile = (name) => {
    currentFolder.addNewChildElement(i,'file',name,currentFolder);
    i++;
}
const onPressFile = () => {
    console.log('change')
    const inputMain = document.getElementById('inputForName');
    const input = inputMain.cloneNode(true);
    inputMain.parentElement.replaceChild(input,inputMain);
    input.parentElement.classList.add('givingNameActive');
    input.addEventListener('keyup',(event) => {
        if(event.keyCode === 13 && event.target.value ){
            event.preventDefault();
            createNewFile(event.target.value);
            event.target.value = '';
            input.parentElement.classList.remove('givingNameActive');
        }
    })
}

// Callback for the creation of the new folder
const createNewFolder = (name) => {
    currentFolder.addNewChildElement(i,'folder',name,currentFolder);
    i++;
}
const onPressFolder = () => {
    console.log('change')
    const inputMain = document.getElementById('inputForName');
    const input = inputMain.cloneNode(true);
    inputMain.parentElement.replaceChild(input,inputMain);
    input.parentElement.classList.add('givingNameActive');
    input.addEventListener('keyup',(event) => {
        if(event.keyCode === 13 && event.target.value ){
            event.preventDefault();
            createNewFolder(event.target.value);
            event.target.value = '';
            input.parentElement.classList.remove('givingNameActive');
        }
    })
}

// Function for placing the Callback
const placeTheCallback = (idOfTheElement,type,callback) => {
    document.getElementById(idOfTheElement).addEventListener(type,callback);
}
// Palcing The Callbacks
placeTheCallback('createRootBtn','click',()=>{createRoot('creationBtns','controlBtns')})
placeTheCallback('addNewFile','click',onPressFile);
placeTheCallback('addNewFolder','click',onPressFolder);