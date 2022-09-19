var pairs = [];

function editRow(num) {

    let keys = document.getElementsByClassName('key');
    let indices = document.getElementsByClassName('index');
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

    let keys = document.getElementsByClassName('key');
    let indices = document.getElementsByClassName('index');
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
    clearForm();
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

function getLogin(){
    let user = document.getElementById('loginUser').value;
    let pass = document.getElementById('loginPass').value;

    console.log(user, pass)

    let data = {
        "user" : user,
        "pass" : pass
    }

    ajaxFunc(undefined, '/login', "GET", data)
}

function ajaxFunc(key, path, method, d) {

    let xhr = new XMLHttpRequest();
    xhr.open(method, path, true);

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = () => {
        if (xhr.status == 200) {
            console.log('success');
        } else console.log('status ' + xhr.status)
        //console.log(xhr.responseText);
    }


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
        //setTimeout is a hacky solution - fix later
        setTimeout(() => {
            window.location.reload()
        }, 1000)

    }

    if (method == 'GET'){
        var data = JSON.stringify({
            "user" : ""+d.user+"",
            "pass" : ""+d.pass+""
        })
        console.log('This is a get request');
        xhr.send(data);
    }

    xhr.onerror = () => {
        console.log("Something went wrong")
    }
}

function clearForm() {
    document.getElementById('editRowForm').reset();
}