var pairs = [];

//Could figure out how to use cookies so that you can't edit/delete a user 
//that is logged in on another tab or computer as well
window.onload = checkForUser();

//Checks if user is logged in and displays that on screen
//Also used to make sure edits aren't made if not logged in.
function checkForUser(){

    let isLogged = sessionStorage.getItem('logged');
    let user = sessionStorage.getItem('user');
    let el = document.getElementById('current-user');

    switch(isLogged){
        case 'true':
            el.innerHTML = "Logged in as: " +`<span>`+ user + `</span>`;
            el.style.color = "#000";
            break;
        case 'false':
            el.innerHTML = "You are not logged in";
            el.style.color = "#dd3444";
            break;
        case null:
            el.innerHTML = "Session Storage key does not yet exist";
            el.style.color = "#dd3444";
            break;
        default:
            el.innerHTML = "Something is wrong"
            el.style.color = "#dd3444";

    }
};
function editRow(num) {

    let keys = document.getElementsByClassName('key');
    let indices = document.getElementsByClassName('index');
    var currentUser = sessionStorage.getItem('user');
    let user = document.getElementsByClassName('user');
    
    if(user[num].innerHTML == sessionStorage.getItem('user')){
        setTimeout(() => {
            document.getElementById('edit-close').click();
            alert("You can't edit a user that you're logged in with!")},
            500);
    }
    if(currentUser == 'none' || currentUser == null) {
        //Need a better solution, can still click modal buttons if ur quick enough
        setTimeout(() => {
            document.getElementById('edit-close').click();
            alert("You must login to edit the database!")},
            500);
    }
    for (i = 0; i < indices.length; i++) {
        let newPair = {
            index: i,
            key: keys[i].innerHTML
        };
        pairs.push(newPair);
    }
    document.getElementById('editModalLabel').innerHTML = "Edit User #" + keys[num].innerHTML;
}

function deleteRow(num) {

    let user = document.getElementsByClassName('user');
    var currentUser = sessionStorage.getItem('user');
    if(user[num].innerHTML == sessionStorage.getItem('user')){
        //let modal = document.getElementById('delModal');
        //modal.preventDefault();
        setTimeout(() => {
            //Simulate button click on modal to close - can't figure out 
            //prevent default. 
            document.getElementById('del-close').click();
            alert("You can't delete a user that you're logged in with!")},
            500);
    }

    if(currentUser == 'none' || currentUser == null) {
        //Need a better solution
        setTimeout(() => {
            document.getElementById('del-close').click();
            alert("You must login to edit the database!")},
            500);
    }

    let keys = document.getElementsByClassName('key');
    let indices = document.getElementsByClassName('index');
    //I forgot what this does, but I need it
    for (i = 0; i < indices.length; i++) {
        let newPair = {
            index: i,
            key: keys[i].innerHTML
        };
        pairs.push(newPair);
    }
    document.getElementById('delModalLabel').innerHTML = "Delete User #" + keys[num].innerHTML;
}

function confirmEdit() {
    let name = document.getElementById('userN').value;
    let pass = document.getElementById('password').value
    let passC = document.getElementById('passwordConfirm').value;
    // Want to make it so you can keep same username, changing just password,
    // going to figure that out later
    if (name == '' || pass == '' || passC == '') {
        return alert('Please fill out all fields');
    }
    if (name.length <= 6) {
        return alert('Username must be at least 6 characters')
    }
    if (pass.length <= 6) {
        return alert('Password must be at least 6 characters');
    }
    if (pass != passC) {
        return alert('Passwords do not match');
    }
    let keyToDel = document.getElementById('editModalLabel').innerText.replace(/[^0-9]+/g, '');

    let data = {
        "name": name,
        "pass": pass
    }

    ajaxFunc(keyToDel, '/database', "PUT", data)
    //Reset Form values
    document.getElementById('editRowForm').reset();
}

function confirmDel() {
    //Get the correct index of the record from key-value pairs global array
    let keyToDel = document.getElementById('delModalLabel').innerText.replace(/[^0-9]+/g, '');
    for (var i = 0; i < pairs.length; i++) {
        if (pairs[i].key === keyToDel) {
            var index = pairs[i].index;
        }
    }

    ajaxFunc(keyToDel, '/database', "DELETE")

    document.getElementsByClassName('index')[index].remove();
    pairs = [];
}

function getLogin() {
    let isLogged = sessionStorage.getItem('logged');
    console.log(isLogged)
    if (isLogged === 'true') {
        return alert("You're already logged in!")
    } else {
        let user = document.getElementById('loginUser').value;
        let pass = document.getElementById('loginPass').value;

        console.log("Getting login data...")

        let data = {
            "user": user,
            "pass": pass
        }

        ajaxFunc(undefined, '/login', "GET", data);
    }

}
function logOut(){
    let isLogged = sessionStorage.getItem('logged');
    if (isLogged !== 'true') {
        return alert("You aren't logged in!")
    } else {
        //Reset session storage on logout
        sessionStorage.setItem('logged', false);
        sessionStorage.setItem('user', 'none');
        alert("Logout Successful.");
        checkForUser();
    }

}
function ajaxFunc(key, path, method, d) {

    if (method == 'GET') {
        path = path + "/" + d.user + "/" + d.pass + ""
    }
    let xhr = new XMLHttpRequest();
    xhr.open(method, path, true);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    if (method == 'DELETE') {
        var data = JSON.stringify({
            "key": "" + key + ""
        })
        console.log('This is a delete request');
        xhr.send(data);
    }

    if (method == 'PUT') {
        var data = JSON.stringify({
            "key": "" + key + "",
            "name": d.name,
            "pass": d.pass
        })
        console.log('This is a put request');
        xhr.send(data);
        //reload window so the edited user is updated on screen
        //there's probably a better way?
        setTimeout(() => {
            window.location.reload()
        }, 1000)

    }

    if (method == 'GET') {
        console.log(path)
        var data = JSON.stringify({
            "user": "" + d.user + "",
            "pass": "" + d.pass + ""
        })
        console.log('This is a get request');
        xhr.send(data);
    }

    xhr.onload = () => {
        if (xhr.status == 200) {
            console.log('success');
        } else console.log('status ' + xhr.status)
        //State whether login was successful or not
        var response = xhr.responseText;
        if (response == "Login Successful!") {
            //Will need to change route when this site is live
            window.location.replace('http://livedatabase.herokuapp.com/database');
            alert(response);
            //Setup session storage
            sessionStorage.setItem('logged', true);
            sessionStorage.setItem('user', d.user);
        } 
        if (response == "Incorrect Password!") {
            alert(response)
            document.getElementById('loginPass').value = '';
        }
        if(response == "This username does not exist!"){
            alert(response);
        }
    }
    xhr.onerror = () => {
        console.log("Something went wrong")
    }
}