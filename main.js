    let btnAddFolder = document.querySelector("#addFolder");
    let btnAddTextFile = document.querySelector("#addTextFile");
    let divbreadcrumb = document.querySelector("#breadcrumb");
    let divContainer = document.querySelector("#container");
    let templates = document.querySelector("#templates");
    let aRootPath = document.querySelector("a[purpose='path']");
    let resources = [];
    let cfid = -1; // initially we are at root (which has an id of -1)
    let rid = 0;

    let divApp = document.querySelector("#app");
    let divAppTitleBar = document.querySelector("#app-title-bar");
    let divAppTitle = document.querySelector("#app-title");
    let divAppMenuBar = document.querySelector("#app-menu-bar");
    let divAppBody = document.querySelector("#app-body");
    btnAddFolder.addEventListener("click", addFolder);
    btnAddTextFile.addEventListener("click", addTextFile);
    aRootPath.addEventListener("click",viewFolderFromPath);

    // validation - unique, non-blank
    function addFolder(){
        let rname = prompt("Enter folder's name");
        if(rname != null){
            rname = rname.trim();
        }

        if(!rname){ // empty name validation
            alert("Empty name is not allowed.");
            return;
        }
        let nameExists = resources.some(r=>r.rname == rname && r.pid == cfid);
        if(nameExists){
            alert(rname + " is already in use. Try some other name")
            return;
        }
        let pid = cfid;
        rid++;
        addFolderHTML(rname, rid, pid);
        resources.push({
            rid: rid,
            rname: rname,
            rtype: "folder",
            pid: cfid
        });
        saveToStorage();
    }

    function addTextFile(){
        let rname = prompt("Enter file's name");
        if(rname != null){
            rname = rname.trim();
        }

        if(!rname){ // empty name validation
            alert("Empty name is not allowed.");
            return;
        }
        let nameExists = resources.some(r=>r.rname == rname && r.pid == cfid);
        if(nameExists){
            alert(rname + " is already in use. Try some other name")
            return;
        }
        let pid = cfid;
        rid++;
        addTextFileHTML(rname, rid, pid);
        resources.push({
            rid: rid,
            rname: rname,
            rtype: "text-file",
            pid: cfid,
            isBold:false,
            isItalic:false,
            isUnderline:false,
            bgColor:"#ffffff",
            textColor:"#000000",
            fontSize:16,
            fontFamily:"Times New Roman",
            text:"I am a new File"
        });
        saveToStorage();
    }

    function deleteFolder(){
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let fidTBD = parseInt(divFolder.getAttribute("rid"));
        let fname = divName.innerHTML;
        let sure = confirm(`Are You Sure you want to delete ${fname}`);
        if(!sure) return;
        this.parentNode.remove();
        deleteHelper(fidTBD);
        saveToStorage();
    }
    function deleteHelper(fidTBD) {
        let children = resources.filter(r=>r.pid == fidTBD);
        for(let i=0;i<children.length;i++){
            deleteHelper(children[i].rid)
        }
        let ridx = resources.findIndex(r=>r.rid == fidTBD)
        resources.splice(ridx,1);
    }

    function deleteTextFile(){
        let divFile = this.parentNode;
        let divName = divFile.querySelector("[purpose='name']");
        let fidTBD = parseInt(divFile.getAttribute("rid"));
        let fname = divName.innerHTML;
        let sure = confirm(`Are You Sure you want to delete ${fname}`);
        if(!sure) return;
        this.parentNode.remove();
        let ridx = resources.findIndex(r=>r.rid == fidTBD)
        resources.splice(ridx,1);
        saveToStorage();
    }

    // empty, old, unique
    function renameFolder(){
        let nrname = prompt("Enter folder's name");
        if(nrname != null){
            nrname = nrname.trim();
        }

        if(!nrname){ // empty name validation
            alert("Empty name is not allowed.");
            return;
        }

        let spanRename = this;
        let divFolder = spanRename.parentNode;
        let divName = divFolder.querySelector("[purpose=name]");
        let orname = divName.innerHTML;
        let ridTBU = parseInt(divFolder.getAttribute("rid"));
        if(nrname == orname){
            alert("Please enter a new name.");
            return;
        }

        let alreadyExists = resources.some(r => r.rname == nrname && r.pid == cfid);
        if(alreadyExists == true){
            alert(nrname + " already exists.");
            return;
        }

        // change html
        divName.innerHTML = nrname;
        // change ram
        let resource = resources.find(r => r.rid == ridTBU);
        resource.rname = nrname;
        // change storage
        saveToStorage();
    }

    function renameTextFile(){
        let nrname = prompt("Enter file's name");
        if(nrname != null){
            nrname = nrname.trim();
        }

        if(!nrname){ // empty name validation
            alert("Empty name is not allowed.");
            return;
        }

        let spanRename = this;
        let divFile = spanRename.parentNode;
        let divName = divFile.querySelector("[purpose=name]");
        let orname = divName.innerHTML;
        let ridTBU = parseInt(divFile.getAttribute("rid"));
        if(nrname == orname){
            alert("Please enter a new name.");
            return;
        }

        let alreadyExists = resources.some(r => r.rname == nrname && r.pid == cfid);
        if(alreadyExists == true){
            alert(nrname + " already exists.");
            return;
        }

        // change html
        divName.innerHTML = nrname;
        // change ram
        let resource = resources.find(r => r.rid == ridTBU);
        resource.rname = nrname;
        // change storage
        saveToStorage();
    }

    function viewFolder(){
        divApp.style.display = "none";
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let fname = divName.innerHTML;
        let fid = parseInt(divFolder.getAttribute("rid"));
        let aPathTemp = templates.content.querySelector("a[purpose='path']");
        let aPath = document.importNode(aPathTemp,true);
        aPath.innerHTML = fname;
        aPath.setAttribute("rid",fid);
        divbreadcrumb.appendChild(aPath);
        aPath.addEventListener("click",viewFolderFromPath);

        cfid = fid;
        divContainer.innerHTML = "";
        for(let i = 0; i < resources.length; i++){
            if(resources[i].pid == cfid){
                if(resources[i].rtype == "folder"){

                    addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }else if(resources[i].rtype == "text-file"){
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
            }
        }


    }

   

    function addFolderHTML(rname, rid, pid){
        let divFolderTemplate = templates.content.querySelector(".folder");
        let divFolder = document.importNode(divFolderTemplate, true); // makes a copy

        let spanRename = divFolder.querySelector("[action=rename]");
        let spanDelete = divFolder.querySelector("[action=delete]");
        let spanView = divFolder.querySelector("[action=view]");
        let divName = divFolder.querySelector("[purpose=name]");

        spanRename.addEventListener("click", renameFolder);
        spanDelete.addEventListener("click", deleteFolder);
        spanView.addEventListener("click", viewFolder);
        divName.addEventListener("dblclick",viewFolder)
        divName.innerHTML = rname;
        divFolder.setAttribute("rid", rid);
        divFolder.setAttribute("pid", pid);

        divContainer.appendChild(divFolder);
    }
    function addTextFileHTML(rname, rid, pid){
        let divTextFileTemplate = templates.content.querySelector(".text-file");
        let divTextFile = document.importNode(divTextFileTemplate, true); // makes a copy

        let spanRename = divTextFile.querySelector("[action=rename]");
        let spanDelete = divTextFile.querySelector("[action=delete]");
        let spanView = divTextFile.querySelector("[action=view]");
        let divName = divTextFile.querySelector("[purpose=name]");

        spanRename.addEventListener("click", renameTextFile);
        spanDelete.addEventListener("click", deleteTextFile);
        spanView.addEventListener("click", viewTextFile);
        divName.addEventListener("dblclick",viewTextFile)
        divName.innerHTML = rname;
        divTextFile.setAttribute("rid", rid);
        divTextFile.setAttribute("pid", pid);

        divContainer.appendChild(divTextFile);
    }

    function viewFolderFromPath(){
        let fid = this.getAttribute("rid");
        cfid = fid;
        //to set the breadCrumb
       for(let i=divbreadcrumb.children.length-1;i>=0;i--){
           if(divbreadcrumb.children[i]==this){
               break;
           }
           divbreadcrumb.removeChild(divbreadcrumb.children[i]);
       }
        //to set the container
        divContainer.innerHTML = "";
        for(let i = 0; i < resources.length; i++){
            if(resources[i].pid == cfid){
                if(resources[i].rtype == "folder"){

                    addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }else if(resources[i].rtype == "text-file"){
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
            }
        }
    }
    function saveToStorage(){
        let rjson = JSON.stringify(resources); // used to convert jso to a json string which can be saved
        localStorage.setItem("data", rjson);
    }

    function loadFromStorage(){
        let rjson = localStorage.getItem("data");
        if(!rjson){
            return;
        }
       
        resources = JSON.parse(rjson);
        for(let i = 0; i < resources.length; i++){
            if(resources[i].pid == cfid){
                if(resources[i].rtype == "folder"){

                    addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }else if(resources[i].rtype == "text-file"){
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
            }
            if(resources[i].rid > rid){
                rid = resources[i].rid;
            }
        }
    }
    loadFromStorage();
// to prevent namespace pollution
