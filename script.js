//add event listener on plus button and the event is of click
// show and hide modal on click of add button

let addBtn = document.querySelector('.add-btn');
let modalCont = document.querySelector('.modal-cont');
let deleteBtn = document.querySelector('.remove-btn');
let color = ['red', 'blue','green', 'pink'];
let isModalHidden = true;

let textArea = document.querySelector('.textarea-cont');
let mainCont = document.querySelector('.main-content');
//storing data of each ticket in teh form of array
let ticketArr = [];
if(localStorage.getItem('TaskArr')) {
    let ticketArrStr = localStorage.getItem("TaskArr");
    ticketArr = JSON.parse(ticketArrStr);
    for(let i = 0; i < ticketArr.length; i++) {
        let ticket = ticketArr[i];
        createTicket(ticket.value, ticket.color, ticket.id);
    }
}

addBtn.addEventListener('click', function() {
    if (isModalHidden) {
        modalCont.style.display = "flex" //show the modal
        isModalHidden = false;
    }
    else {
        modalCont.style.display = "none" //hide the modal
        isModalHidden = true;

    }
})

//On click of delete button make it red and if again clicked make it black

let isDeleteBtnActive = false;

deleteBtn.addEventListener('click', function() {
    if (isDeleteBtnActive) {
    deleteBtn.style.color = "black";
    console.log(deleteBtn);
    isDeleteBtnActive = false;
    }
    else {
    deleteBtn.style.color = "red";
    console.log(deleteBtn);
    isDeleteBtnActive = true;
    }
})

//filter ticket
let filterColor = document.querySelectorAll('.color');
for(let i = 0; i < filterColor.length; i++) {
    filterColor[i].addEventListener('click', function() {
        let allTicketsColor = document.querySelectorAll('.ticket-color');
        let filterSelectedColor = filterColor[i].classList[1];
        for(let j = 0; j < allTicketsColor.length; j++) {
            let currentTicketColor = allTicketsColor[j].classList[1];
            if(filterSelectedColor == currentTicketColor) {
                allTicketsColor[j].parentElement.style.display = 'block';
            }else {
                allTicketsColor[j].parentElement.style.display = 'none';

            }
        }
    })
    filterColor[i].addEventListener('dblclick', function() {
        let allTicketsColor = document.querySelectorAll('.ticket-color');
        for(let j = 0; j < allTicketsColor.length; j++) {
        allTicketsColor[j].parentElement.style.display = 'block';
        }
    })
}


let allPriorityColor = document.querySelectorAll('.priority-color');
let priorityColor = 'red';
for(let i=0;i<allPriorityColor.length;i++){
    allPriorityColor[i].addEventListener('click',function(){
        // console.log(allPriorityColor[i].classList[1]);  
        //before we add border, let's remove border from all
        for(let j=0;j<allPriorityColor.length;j++){
            allPriorityColor[j].classList.remove('active');
        }

        allPriorityColor[i].classList.add('active'); // add border
        //update the priority Color
        priorityColor = allPriorityColor[i].classList[1];
    })
}

// Instantiate
var uid = new ShortUniqueId();


textArea.addEventListener('keydown', function(e) {
    let key = e.key;
    if(key == "Enter") {
        // console.log(textArea.value);
        createTicket(textArea.value, priorityColor); //generate ticket
        modalCont.style.display = "none" //hide the modal
        isModalHidden = true;
        textArea.value = "";
    }
})

function createTicket(task, priorityColor, ticketId) {
    //create the below structure with js and add it to main container
    //  <div class="ticket-cont">
    //         <div class="ticket-color"></div>
    //         <div class="ticket-id">#54f</div>
    //         <div class="ticket-area">Some Task</div>

    //     </div>
    let id;
    if(ticketId) {
        id = ticketId;
    }else {
        id = uid.rnd();
    }

    let ticketCont = document.createElement('div');
    ticketCont.className = 'ticket-cont'; //  <div class="ticket-cont">
    ticketCont.innerHTML = `<div class="ticket-color ${priorityColor}"></div> 
                            <div class="ticket-id"># ${id}</div> 
                            <div class="ticket-area"> ${task}</div>
                            <div class='lock-unlock-btn'>
                                <i class="fa-solid fa-lock"></i>
                            </div>`
    if(!ticketId) {
        ticketArr.push({id:id, color:priorityColor, value:task});
        updateLocalStorage();
        // updateLocalStorage();
    }
    mainCont.appendChild(ticketCont);

    //handle delete ticket
    ticketCont.addEventListener('click', function() {
        if(isDeleteBtnActive) {
        ticketCont.remove();
        let ticketIndex = ticketArr.findIndex(function(ticketObj) {
            return ticketObj.id == id;
        })
        ticketArr.splice(ticketIndex,1);
        updateLocalStorage();
        }
    })

    //Handle lock unlock btn
    let lockUnlockBtn = ticketCont.querySelector('.lock-unlock-btn i');
    let ticketArea = ticketCont.querySelector('.ticket-area');

        lockUnlockBtn.addEventListener('click',function(){
        if(lockUnlockBtn.classList.contains('fa-lock')){
            lockUnlockBtn.classList.remove('fa-lock');
            lockUnlockBtn.classList.add('fa-lock-open');
            ticketArea.setAttribute('contenteditable', 'true');
        }else{
            lockUnlockBtn.classList.remove('fa-lock-open');
            lockUnlockBtn.classList.add('fa-lock');
            ticketArea.setAttribute('contenteditable', 'false');

        }
    let ticketIndex = ticketArr.findIndex(function(ticketObj) {
        return ticketObj.id == id;
    })
    ticketArr[ticketIndex].value = ticketArea.innerText;
    updateLocalStorage();
})

//handle priority  change
let ticketColor = ticketCont.querySelector('.ticket-color');
ticketColor.addEventListener('click', function() {
    let currentColor = ticketColor.classList[1];
    // console.log(currentColor);
    let idx = color.findIndex(function(col) {
        return col == currentColor;
    })
    let nextIdx = (idx+1)%color.length;
    let nextColor = color[nextIdx];

    ticketColor.classList.remove(currentColor);
    ticketColor.classList.add(nextColor);

    let ticketIndex = ticketArr.findIndex(function(ticketObj) {
        return ticketObj.id == id;
    })
    ticketArr[ticketIndex].color = nextColor;
    updateLocalStorage(); 
})

}

function updateLocalStorage() {
    let ticketArrStr = JSON.stringify(ticketArr);
    localStorage.setItem("TaskArr", ticketArrStr);
}
