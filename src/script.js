// id
let i = 0;
let root;
let currentFolder;
let currentFile;

// File
class File{
    constructor(id, name){
        this.id = id;
        this.text = '';
        this.name = name
    }
    // tabCont0
    createTabSection(num){
        const Tab = document.createElement('div');
        Tab.classList.add('tabs_container');
        Tab.setAttribute('id',`tabCont${num}`);
        return Tab;
    }
    // input0
    createInputSection(num){
        const InputCont = document.createElement('div');
        InputCont.classList.add('textarea-container');
        const Input = document.createElement('textarea');
        Input.classList.add('textarea');
        Input.setAttribute('placeholder','Type your text here!');
        Input.setAttribute('cols','30');
        Input.setAttribute('rows','10');
        Input.setAttribute('id',`input${num}`);
        Input.addEventListener('change', (e) => { currentFile.text = e.target.value; },true)
        InputCont.appendChild(Input);
        return InputCont;
    }

    createEditorSection(num){
        const Section = document.createElement('div');
        Section.classList.add('editorSection');
        Section.appendChild(this.createTabSection(num));
        Section.appendChild(this.createInputSection(num));
        return Section;
    }

    setTheDetails(text){
        const detail = document.getElementById('detailFile');
        detail.innerText = text;
    }
    
    callbackForTurningTabActive(file){
        currentFile = file;
        this.setTheDetails(file.name);
        const allTabs = [...document.getElementById('tabCont0').children];
        allTabs.forEach(item => {
            item.classList.remove('tab_active');
        })

        const Tab = document.getElementById(`${this.id}Tab`);
        if(Tab){
            Tab.classList.add('tab_active');
        }
        const Input = document.getElementById('input0');
        Input.value = file.text;
    }

    createTab(num){
        const exists = document.getElementById(`${this.id}Tab`);
        if(exists){
            this.callbackForTurningTabActive(this)
            return;
        }
        const Tab = document.createElement('div');
        Tab.classList.add('tab');
        let icon = document.createElement('i');
        const nameParts = this.name.split('.')
        const extension = nameParts[nameParts.length-1].toLowerCase();
        if( extension === 'js'){
            icon.classList.add('IconJS');
            icon.classList.add('fab','fa-js');
        } else if(extension === 'html' || extension === 'htm'){
            icon.classList.add('IconHTML');
            icon.classList.add('fab','fa-html5');
        } else if(extension === 'css'){
            icon.classList.add('IconCSS');
            icon.classList.add('fab','fa-css3-alt');
        } else{
            icon.classList.add('fas','fa-file');
        }
        icon.classList.add('tabIcon');

        const p = document.createElement('p');
        p.classList.add('tab_title');
        p.innerText = this.name;

        const button = document.createElement('button');

        button.classList.add('tab_close');
        button.innerHTML = '<i class="fas fa-times"></i>';
        button.addEventListener('click',()=>{this.close(this)},true)

        Tab.appendChild(icon);
        Tab.appendChild(p);
        Tab.appendChild(button);
    
        Tab.setAttribute('id',`${this.id}Tab`);
        Tab.addEventListener('click',()=>{this.callbackForTurningTabActive(this)},true);

        const parent = document.getElementById(`tabCont${num}`);
        parent.appendChild(Tab);

        this.callbackForTurningTabActive(this);
    }

    open(){
        const exists = document.getElementById(this.id);
        if(!exists){
            console.log('1');
            return ;
        }
        const editorInnner = document.getElementById('editorInner');
        const doesInputExist = editorInnner.children.length;
        if(!doesInputExist){
            editorInnner.innerText = '';
            editorInnner.appendChild(this.createEditorSection(0))
        }
        this.createTab(0);

    }
    
    close(file){
        document.getElementById(`${file.id}Tab`).remove();
        const hasChildren = [...document.getElementById('tabCont0').children].length;
        if(!hasChildren){
            const editorInner = [...document.getElementById('editorInner').children][0];
            editorInner.remove();
            document.getElementById('editorInner').innerText = 'Choose a file to work on';
            this.setTheDetails(' none ')
            return;
        }
        const firstTab = [...document.getElementById('tabCont0').children][0];
        const idAtr = firstTab.id;
        const id = idAtr.slice(0,-3);
        const fileCont = document.getElementById(id);
        fileCont.click();
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

    setTheDetails(text){
        const detail = document.getElementById('detailFolder');
        detail.innerText = `fol. where new items will be added - ${text}`;
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
                    this.setTheDetails(this.child[idOfTheNewElement].name);
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
        const nameParts = name.split('.');
        const extension = nameParts[nameParts.length-1].toLowerCase();
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

        // Add event listeners to every file node
        newNode.addEventListener('click', callbackForClicking, true);
        
        // Add a removing callback to close button
        CloseBtn.addEventListener('click', callbackForRemovoning, true);
        
        // Append icon, name and button file
        newNode.appendChild(FileIcon);
        newNode.appendChild(FileName);
        newNode.appendChild(CloseBtn);



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
        MoreIcon.addEventListener('click',() => {MoreIcon.classList.toggle('folderMoreIcon');FolderRest.classList.toggle('folderRestActive')},true)

        const FolderIcon = document.createElement('div');
        FolderIcon.classList.add('folderIcon');
        FolderIcon.innerHTML = '<i class="fas fa-folder"></i>';

        // Folder title
        const FolderTitle = document.createElement('div');
        FolderTitle.innerText = name;
        FolderTitle.classList.add('folderTitle');

        //! Close button makes error for root project, add functionality so that we can remove root folder as well
        //! Root is not needed to be removed
        // Add a closing button
        const CloseBtn = document.createElement('div');
        CloseBtn.classList.add('fileIcon');
        CloseBtn.classList.add('IconClose');
        CloseBtn.innerHTML = '<i class="fas fa-window-close"></i>';
        
        // Add a removing callback to close button
        CloseBtn.addEventListener('click', callbackForRemovoning, true);

        // Append icons, and title and close button to folder header
        FolderHeader.appendChild(MoreIcon);
        FolderHeader.appendChild(FolderIcon);
        FolderHeader.appendChild(FolderTitle);
        FolderHeader.appendChild(CloseBtn);

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
        console.log(id)
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
    root.setTheDetails(root.name);
    root.placeTheNode(
        root.createTheNewNode(i, 'folder', 'Your_Project', ()=> {
            root.removeTheChildNodeFromDom(i);
        }, ()=>{
        currentFolder = root;
        root.setTheDetails(root.name);
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
    },true)
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
    },true)
}

// Function for placing the Callback
const placeTheCallback = (idOfTheElement,type,callback) => {
    document.getElementById(idOfTheElement).addEventListener(type,callback,true);
}

// Palcing The Callbacks
placeTheCallback('createRootBtn', 'click',() => {
    createRoot('creationBtns', 'controlBtns')
});
placeTheCallback('addNewFile', 'click', onPressFile);
placeTheCallback('addNewFolder', 'click', onPressFolder);


