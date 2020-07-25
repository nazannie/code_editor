// id
let i = 0;
let root;
let currentFolder;

// File
class File{
    constructor(id, name){
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
    constructor(id, root, name){
        this.child = {};
        this.id = id;
        this.root = root;
        this.name = name;
    }

    addNewChildElement(idOfTheNewElement, type, name, root1) {
        if (type === 'file') {
            const newChild = new File(idOfTheNewElement, name);
            this.child[idOfTheNewElement] = newChild;

            let idOfTheParent = root1.id;

            this.placeTheNode(this.createTheNewNode(
                idOfTheNewElement,
                type,
                name,
                ()=> {
                    this.removeChildElement(idOfTheNewElement);
                    this.removeTheChildNodeFromDom(idOfTheNewElement);
                },
                ()=> {
                    this.child[idOfTheNewElement].open();
                }),
                `${idOfTheParent}Cont`);

            return this.child[idOfTheNewElement];

        } else if (type === 'folder') {
            const newChild = new Folder(idOfTheNewElement, root1, name);
            this.child[idOfTheNewElement] = newChild;
            
            let idOfTheParent = root1.id;

            this.placeTheNode(this.createTheNewNode (
                idOfTheNewElement,
                type,
                name,
                ()=> {
                    this.removeChildElement(idOfTheNewElement);
                    this.removeTheChildNodeFromDom(idOfTheNewElement);
                },
                ()=> {
                    currentFolder = this.child[idOfTheNewElement];
                }),`${idOfTheParent}Cont`);

            return this.child[idOfTheNewElement];

        }

        return null;
    }

    removeChildElement(id){
        delete this.child[id];

        if(this.child[id]){
            return false;
        }

        return true;
    }

    createTheNewNode(idOfTheNewElement, type, name, callbackForRemovoning, callbackForClicking){
        if(type === 'file'){
            return this.createNewFileNode(idOfTheNewElement ,name, callbackForRemovoning, callbackForClicking)
        } else if(type === 'folder'){
            return this.createNewFolderNode(idOfTheNewElement, name, callbackForRemovoning, callbackForClicking);  
        }
    }

    createNewFileNode = function(idOfTheNewElement, name, callbackForRemovoning, callbackForClicking) {

        // Create new file element
        const newNode = document.createElement('div');
        newNode.classList.add('file');
        newNode.setAttribute('id',idOfTheNewElement);

        // Set File Name
        const FileName = document.createElement('div');
        FileName.classList.add('fileName');
        FileName.innerText = name; 

        // Set File Icon
        const FileIcon = document.createElement('div');
        FileIcon.classList.add('fileIcon');

        // Add extensions for js, html and css files    
        const extension = name.split('.')[1];
        if( extension === 'js'){
            FileIcon.classList.add('IconJS');
            FileIcon.innerHTML = '<i class="fab fa-js"></i>';
        } else if(extension === 'html' || extension === 'htm'){
            FileIcon.classList.add('IconHTML');
            FileIcon.innerHTML = '<i class="fab fa-html5"></i>';
        } else if(extension === 'css'){
            FileIcon.classList.add('IconCSS');
            FileIcon.innerHTML = '<i class="fab fa-css3-alt"></i>';
        } else{
            FileIcon.innerHTML = '<i class="fas fa-file"></i>';
        }

        // Add a closing button
        const CloseBtn = document.createElement('div');
        CloseBtn.classList.add('fileIcon');
        CloseBtn.classList.add('IconClose');
        CloseBtn.innerHTML = '<i class="fas fa-window-close"></i>';
        
        // Add a removing callback to close button
        CloseBtn.addEventListener('click', callbackForRemovoning, true);
        
        // Append icon, name and button file
        newNode.appendChild(FileIcon);
        newNode.appendChild(FileName);
        newNode.appendChild(CloseBtn);

        // Add event listeners to every file node
        newNode.addEventListener('click', callbackForClicking, true);
        newNode.addEventListener("mouseover", () => {
            newNode.querySelector('.IconClose').style.display = 'block';
        });
        newNode.addEventListener("mouseout", () => {
            newNode.querySelector('.IconClose').style.display = 'none';
        });

        newNode.addEventListener('click', () => {
            console.log('Add file');
        })

        return newNode;
    }

    createNewFolderNode = function(idOfTheNewElement, name, callbackForRemovoning, callbackForClicking){

        // Folder main node
        const newNode = document.createElement('div');
        newNode.classList.add('folder');
        newNode.setAttribute('id',idOfTheNewElement);
        newNode.addEventListener('click',callbackForClicking,true);

        // Folder content
        const FolderRest = document.createElement('div');
        FolderRest.classList.add('folderRest');
        FolderRest.setAttribute('id',`${idOfTheNewElement}Cont`)

        // Folder header
        const FolderHeader = document.createElement('div');
        FolderHeader.classList.add('folderHeader');
        
        // Folder icons
        const MoreIcon = document.createElement('div');
        MoreIcon.classList.add('folderIcon');
        MoreIcon.innerHTML = '<i class="fas fa-chevron-down"></i>';
        MoreIcon.addEventListener('click',() => {MoreIcon.classList.toggle('folderMoreIcon');FolderRest.classList.toggle('folderRestActive')})

        const FolderIcon = document.createElement('div');
        FolderIcon.classList.add('folderIcon');
        FolderIcon.innerHTML = '<i class="fas fa-folder"></i>';

        // Folder title
        const FolderTitle = document.createElement('div');
        FolderTitle.innerText = name;
        FolderTitle.classList.add('folderTitle');

        //! Close button makes error for root project, add functionality so that we can remove root folder as well
        // Add a closing button
        // const CloseBtn = document.createElement('div');
        // CloseBtn.classList.add('fileIcon');
        // CloseBtn.classList.add('IconClose');
        // CloseBtn.innerHTML = '<i class="fas fa-window-close"></i>';
        
        // Add a removing callback to close button
        // CloseBtn.addEventListener('click', callbackForRemovoning, true);

        // Append icons, and title and close button to folder header
        FolderHeader.appendChild(MoreIcon);
        FolderHeader.appendChild(FolderIcon);
        FolderHeader.appendChild(FolderTitle);
        // FolderHeader.appendChild(CloseBtn);

        // Append header and rest to the folder main node
        newNode.appendChild(FolderHeader);
        newNode.appendChild(FolderRest);

        // Add event listeners to every file node
        //! Yet works Buggy
        // newNode.addEventListener("mouseover", () => {
        //     newNode.querySelector('.IconClose').style.display = 'block';
        // });
        // newNode.addEventListener("mouseout", () => {
        //     newNode.querySelector('.IconClose').style.display = 'none';
        // });

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
const createRoot = (creationalBtnsId, controlBtnsId) => {
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
    root = new Folder(i, undefined, 'Your_Project');
    root.placeTheNode(
        root.createTheNewNode(i, 'folder', 'Your_Project', ()=> {
            root.removeTheChildNodeFromDom(i)
        }, ()=>{
        currentFolder = root
    }), 'fileNavigation');

    // making the current folder to be the root
    currentFolder = root;
    // changing the idea
    i++;
}

// Callback For The creation of new File
const createNewFile = (name) => {
    currentFolder.addNewChildElement(i, 'file', name, currentFolder);
    i++;
}

const onPressFile = () => {
    const inputMain = document.getElementById('inputForName');
    const input = inputMain.cloneNode(true);

    inputMain.parentElement.replaceChild(input,inputMain);
    input.parentElement.classList.add('givingNameActive');

    input.addEventListener('keyup', (event) => {
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
placeTheCallback('createRootBtn', 'click',() => {
    createRoot('creationBtns', 'controlBtns')
});
placeTheCallback('addNewFile', 'click', onPressFile);
placeTheCallback('addNewFolder', 'click', onPressFolder);


