let closeBtn = document.querySelector(".close");
let fullScreenBtn = document.querySelector(".fullscreen");
closeBtn.addEventListener("click",handleClose);
fullScreenBtn.addEventListener("click",handleFullScreen);

function handleClose(){
    divApp.style.display = "none";
}

function handleFullScreen(){
    divApp.style.position=="relative"?divApp.style.position="absolute":divApp.style.position="relative";
}
function viewTextFile(){
    divApp.style.display = "block";
    divApp.style.position="relative";
    let spanView = this;
    let divTextFile = spanView.parentNode;
    let divName = divTextFile.querySelector("[purpose='name']");
    let fname = divName.innerHTML;
    let fid = parseFloat(divTextFile.getAttribute("rid"));

    let divNotepadMenuTemplate = templates.content.querySelector("[purpose='notepad-menu']")
    let divNotepadMenu = document.importNode(divNotepadMenuTemplate,true);
    divAppMenuBar.innerHTML = "";
    divAppMenuBar.appendChild(divNotepadMenu);

    let divNotepadBodyTemplate = templates.content.querySelector("[purpose='notepad-body']")
    let divNotepadBody = document.importNode(divNotepadBodyTemplate,true);
    divAppBody.innerHTML = "";
    divAppBody.appendChild(divNotepadBody);

    divAppTitle.innerHTML = fname;
    divAppTitle.setAttribute("rid",fid);

    let spanSave = divAppMenuBar.querySelector("[action=save]");
    let spanBold = divAppMenuBar.querySelector("[action=bold]");
    let spanItalic = divAppMenuBar.querySelector("[action=italic]");
    let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
    let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
    let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
    let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
    let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
    let spanDownload = divAppMenuBar.querySelector("[action=download]");
    let spanForUpload = divAppMenuBar.querySelector("[action=forupload]");
    let inputUpload = divAppMenuBar.querySelector("[action=upload]");
    let textArea = divAppBody.querySelector("textArea");

    spanSave.addEventListener("click", saveNotepad);
    spanBold.addEventListener("click", makeNotepadBold);
    spanItalic.addEventListener("click", makeNotepadItalic);
    spanUnderline.addEventListener("click", makeNotepadUnderline);
    inputBGColor.addEventListener("change", changeNotepadBGColor);
    inputTextColor.addEventListener("change", changeNotepadTextColor);
    selectFontFamily.addEventListener("change", changeNotepadFontFamily);
    selectFontSize.addEventListener("change", changeNotepadFontSize);
    spanDownload.addEventListener("click", downloadNotepad);
    inputUpload.addEventListener("change", uploadNotepad);
    spanForUpload.addEventListener("click", function(){
        inputUpload.click();
    })
    let resource = resources.find(r=>r.rid==fid);
    spanBold.setAttribute("pressed",!resource.isBold);
    spanItalic.setAttribute("pressed",!resource.isItalic);
    spanUnderline.setAttribute("pressed",!resource.isUnderline);
    inputBGColor.value = resource.bgColor;
    inputTextColor.value = resource.textColor;
    selectFontFamily.value = resource.fontFamily;
    selectFontSize.value = resource.fontSize;
    textArea.value = resource.text;

    spanBold.dispatchEvent(new Event("click"));
    spanItalic.dispatchEvent(new Event("click"));
    spanUnderline.dispatchEvent(new Event("click"));
    inputBGColor.dispatchEvent(new Event("change"));
    inputTextColor.dispatchEvent(new Event("change"));
    selectFontFamily.dispatchEvent(new Event("change"));
    selectFontSize.dispatchEvent(new Event("change"));
    textArea.dispatchEvent(new Event("change"));

    function changeNotepadTextColor(){
        console.log("change");
        let color = this.value;
        let textArea = divAppBody.querySelector("textarea");
        textArea.style.color = color;
    }
    function changeNotepadFontSize() {
        let fs = this.value;
        textArea.style.fontSize = fs+'px';
        
    }
    function changeNotepadBGColor() {
        let color = this.value;
        let textArea = divAppBody.querySelector("textarea");
        textArea.style.backgroundColor = color; 
    }
    function changeNotepadFontFamily() {
        let font = this.value;
        let textArea = divAppBody.querySelector("textarea");
        textArea.style.fontFamily = font; 
    }
    function downloadNotepad() {
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.rid == fid);
        let divNotepadMenu = this.parentNode;
        
        let strForDownload = JSON.stringify(resource);
        let encodedData = encodeURIComponent(strForDownload);
        
        let aDownload = divNotepadMenu.querySelector("a[purpose=download]");
        aDownload.setAttribute("href", "data:text/json; charset=utf-8, " + encodedData);
        aDownload.setAttribute("download", resource.rname + ".json");

        aDownload.click();
    }
    function uploadNotepad() {
        let file = window.event.target.files[0]; 
        let reader = new FileReader();
        reader.addEventListener("load", function(){
            let data = window.event.target.result;
            let resource = JSON.parse(data);

            let spanBold = divAppMenuBar.querySelector("[action=bold]");
            let spanItalic = divAppMenuBar.querySelector("[action=italic]");
            let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
            let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
            let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
            let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
            let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
            let textArea = divAppBody.querySelector("textArea");

            spanBold.setAttribute("pressed",!resource.isBold);
            spanItalic.setAttribute("pressed", !resource.isItalic);
            spanUnderline.setAttribute("pressed", !resource.isUnderline);
            inputBGColor.value = resource.bgColor;
            inputTextColor.value = resource.textColor;
            selectFontFamily.value = resource.fontFamily;
            selectFontSize.value = resource.fontSize;
            textArea.value = resource.text;

            spanBold.dispatchEvent(new Event("click"));
            spanItalic.dispatchEvent(new Event("click"));
            spanUnderline.dispatchEvent(new Event("click"));
            inputBGColor.dispatchEvent(new Event("change"));
            inputTextColor.dispatchEvent(new Event("change"));
            selectFontFamily.dispatchEvent(new Event("change"));
            selectFontSize.dispatchEvent(new Event("change"));
        })
        reader.readAsText(file);       
    }

    function saveNotepad(){
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r=>r.rid==fid);
        resource.isBold = spanBold.getAttribute("pressed")=="true";
        resource.isItalic=spanItalic.getAttribute("pressed")=="true";
        resource.isUnderline=spanUnderline.getAttribute("pressed")=="true";
        resource.bgColor = inputBGColor.value;
        resource.textColor=inputTextColor.value;
        resource.fontFamily = selectFontFamily.value;
        resource.fontSize = selectFontSize.value;
        resource.text = textArea.value;
        saveToStorage();
    }
    function makeNotepadBold(){
        let isPressed = this.getAttribute("pressed");
        if(isPressed=="false"){
            this.setAttribute("pressed",true);
            textArea.style.fontWeight = "bold";
        }else{
            this.setAttribute("pressed",false);
            textArea.style.fontWeight = "normal";
            
        }
    }
    function makeNotepadItalic(){
        let isPressed = this.getAttribute("pressed");
        if(isPressed=="false"){
            this.setAttribute("pressed",true);
            textArea.style.fontStyle = "italic";
        }else{
            this.setAttribute("pressed",false);
            textArea.style.fontStyle = "normal";
            
        }
    }
    function makeNotepadUnderline(){
        let isPressed = this.getAttribute("pressed");
        if(isPressed=="false"){
            this.setAttribute("pressed",true);
            textArea.style.textDecoration = "underline";
        }else{
            this.setAttribute("pressed",false);
            textArea.style.textDecoration = "none";
            
        }
    }
}