var windows = [
  {
    name: "welcome",
    isOpen: true,
    isMinimized: false,
    hasFocus: true,
    taskbarid: "#noteTaskbarIcon",
    taskbarindicator: "#noteTaskbarIndicator",
    windowid: "#welcomenote"
  },
  {
    name: "settings",
    isOpen: false,
    isMinimized: false,
    hasFocus: false,
    taskbarid: "#settingsTaskbarIcon",
    taskbarindicator: "#settingsTaskbarIndicator",
    windowid: "#settingswindow"
  },
  {
    name: "weather",
    isOpen: false,
    isMinimized: false,
    hasFocus: false,
    taskbarid: "#weatherTaskbarIcon",
    taskbarindicator: "#weatherTaskbarIndicator",
    windowid: "#weatherPanel"
  },
  {
    name: "startMenu",
    isOpen: false,
    isMinimized: false,
    hasFocus: false,
    taskbarid: "#startmenuTaskbarIcon",
    taskbarindicator: "",
    windowid: "#startMenuPanel"
  }
];

var openedWindows = [windows[0]];

<!-- MAKE PANEL DRAGGABLE IF IT HAS A HEADER -->
$(".panel").draggable({
  appendTo: "body",
  handle: ".header"
});

<!-- TOGGLE PANEL STATES -->
function FocusWindow(windowToFocus){
  console.log("focus!");
  var objectarr = windows.filter(obj => {
    return obj.name === windowToFocus
  });
  
  var object = objectarr[0];
  //Focus Window
  object.isOpen = true;
  object.isMinimized = false;
  object.hasFocus = true;
  //remove item from openedwindows array
  openedWindows = openedWindows.filter(function( obj ) {
    return obj.name !== object.name;
  });
  //and puts it at the back
  openedWindows.push(object);
  UpdateTaskBar();
  UpdateZIndex();
}

function CloseWindow(windowToClose){
  var objectarr = windows.filter(obj => {
    return obj.name === windowToClose
  });
  var object = objectarr[0];
  //Close Window
  $(object.windowid).toggle("fade");
  object.isOpen = false;
  object.isMinimized = false;
  object.hasFocus = false;
  //remove item from openedwindows array
  openedWindows = openedWindows.filter(function( obj ) {
    return obj.name !== object.name;
  });
  UpdateTaskBar();
  UpdateZIndex();
}

function MinimizeWindow(windowToClose){
  var objectarr = windows.filter(obj => {
    return obj.name === windowToClose
  });
  var object = objectarr[0];
  
  //MinimizeWindow
  $(object.windowid).effect("drop", { direction: "down" });
  object.isOpen = true;
  object.isMinimized = true;
  object.hasFocus = false;
  //remove item from openedwindows array
  openedWindows = openedWindows.filter(function( obj ) {
    return obj.name !== object.name;
  });
  UpdateTaskBar();
  UpdateZIndex();
}

function TaskbarIconClick(clickedIcon){
  var objectarr = windows.filter(obj => {
    return obj.name === clickedIcon
  });
  var object = objectarr[0];
  
  if(object.name == "startMenu"){
    if(object.isOpen){
      //Close Window
      $(object.windowid).toggle("drop", { direction: "down" });
      object.isOpen = false;
      object.isMinimized = false;
      object.hasFocus = false;
      //remove item from openedwindows array
      openedWindows.pop();
    }
    else{
      //Open window
      $(object.windowid).toggle("drop", { direction: "down" });
      object.isOpen = true;
      object.isMinimized = false;
      object.hasFocus = true;
      //put item at end of openedwindows array
      openedWindows.push(object);
    }
  }
  else{
    //If the start menu is open, close it
    if(windows[3].isOpen){
      //Close Window
      $(windows[3].windowid).toggle("drop", { direction: "down" });
      windows[3].isOpen = false;
      windows[3].isMinimized = false;
      windows[3].hasFocus = false;
      //remove item from openedwindows array
      openedWindows.pop();
    }
    if(object.isOpen){
      if(object.isMinimized){
        //Restore Window
        $(object.windowid).toggle("drop", { direction: "down" });
        object.isOpen = true;
        object.isMinimized = false;
        object.hasFocus = true;
        //put item at end of openedwindows array
        openedWindows.push(object);
      }
      else{
        if(object.hasFocus){
          //Minimize Window
          $(object.windowid).effect("drop", { direction: "down" });
          object.isOpen = true;
          object.isMinimized = true;
          object.hasFocus = false;
          //remove item from openedwindows array
          openedWindows = openedWindows.filter(function( obj ) {
              return obj.name !== object.name;
          });
        }
        else{
          //Focus Window
          object.isOpen = true;
          object.isMinimized = false;
          object.hasFocus = true;
          //remove item from openedwindows array
          openedWindows = openedWindows.filter(function( obj ) {
              return obj.name !== object.name;
          });
          //and puts it at the back
          openedWindows.push(object);
        }
      }
    }
    else{
      //Open window
        $(object.windowid).toggle("fade");
        object.isOpen = true;
        object.isMinimized = false;
        object.hasFocus = true;
        //put item at end of openedwindows array
        openedWindows.push(object);
    }
  }
  UpdateTaskBar();
  UpdateZIndex();
}

function UpdateTaskBar(){
  //Remove the focus state from all windows
  for(var i = 0; i < windows.length; i++){
    windows[i].hasFocus = false;
  }
  
  //apply focus state on last openedwindow
  if(openedWindows.length > 0){
    openedWindows[openedWindows.length - 1].hasFocus = true;
  }
  
  for(var i = 0; i < windows.length; i++){
    $(windows[i].taskbarid).removeClass();
    $(windows[i].taskbarid).addClass("taskbarIconWrapper");
    
    if(windows[i].isOpen){
      $(windows[i].taskbarid).addClass("active");
      $(windows[i].taskbarindicator).removeClass("unfocused");
      
      if(windows[i].hasFocus){
        $(windows[i].taskbarindicator).show();
        $(windows[i].taskbarid).addClass("focused");
      }
      if(windows[i].isMinimized){
        $(windows[i].taskbarindicator).show();
        $(windows[i].taskbarindicator).addClass("unfocused");
      }
    }
    else{
      $(windows[i].taskbarindicator).addClass("unfocused");
      $(windows[i].taskbarindicator).hide();
    }
  }
}

function UpdateZIndex(){
  for(var i = 0; i < openedWindows.length; i++){
    for(var j = 0; j < 4; j++){
      $(openedWindows[i].windowid).removeClass("zindex" + j);
    }
    $(openedWindows[i].windowid).addClass("zindex" + i);
  }
}

<!-- TASKBAR DATE / TIME -->
function GetTime(){
  var date = new Date();
  var today = formatAMPM(date);
  var month = date.getMonth();
  month += 1;
  var calDate =
    month.toString() +
    "/" +
    date.getDate().toString() +
    "/" +
    date.getFullYear();

  $(".taskbarTime").html(today + "<br />" + calDate);
}

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

function updateTime() {
  setTimeout(function () {
    GetTime();
    updateTime();
  }, 60000);
}

GetTime();
updateTime();
