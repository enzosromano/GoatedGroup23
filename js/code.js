const urlBase = "http://group23.xyz/LAMPAPI/";
const extension = "php";

// global variables
let userId = 0;
let firstName = "";
let lastName = "";

let editRow = null;

function createUser() {
    userId = 0;
    firstName = "";
    lastName = "";

    let fname = document.getElementById("userFirstName").value;
    let lname = document.getElementById("userLastName").value;
    let email = document.getElementById("email").value;
    let pnumber = document.getElementById("phoneNumber").value;
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    document.getElementById("loginResult").innerHTML = "";

    let tmp = {
        firstName: fname,
        lastName: lname,
        email: email,
        phoneNumber: pnumber,
        login: login,
        password: password,
    };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/AddUser." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                document.getElementById("loginResult").innerHTML =
                    "User/Password combination incorrect";
                return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "contacts.html";
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function doLogin() {
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;
    //	var hash = md5( password );

    document.getElementById("loginResult").innerHTML = "";

    let tmp = { login: login, password: password };
    //	var tmp = {login:login,password:hash};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/Login." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let jsonObject = JSON.parse(xhr.responseText);
            userId = jsonObject.id;

            if (userId < 1) {
            document.getElementById("loginResult").innerHTML =
                "User/Password combination incorrect";
            return;
            }

            firstName = jsonObject.firstName;
            lastName = jsonObject.lastName;

            saveCookie();

            window.location.href = "contacts.html";
        }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    document.cookie =
        "firstName=" +
        firstName +
        ",lastName=" +
        lastName +
        ",userId=" +
        userId +
        ";expires=" +
        date.toGMTString();
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
        firstName = tokens[1];
        } else if (tokens[0] == "lastName") {
        lastName = tokens[1];
        } else if (tokens[0] == "userId") {
        userId = parseInt(tokens[1].trim());
        }
    }

    // DONT FORGET TO UNCOMMENT -- FOR TESTING!!! ---------------------------------------------------------------------
    
    if (userId < 0) {
        window.location.href = "index.html";
    } else {
        document.getElementById("welcomeMsg").innerHTML =
        "Welcome, " + firstName + ".";
    }
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function addContact() {
    let newContactFName = document.getElementById("first-name-form").value;
    let newContactLName = document.getElementById("last-name-form").value;
    let newContactEmail = document.getElementById("email-form").value;
    let newContactPhone = document.getElementById("phone-form").value;
    
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById("contactAddResult").innerHTML = "";
    });

    let tmp = { userID: userId, userFirstName: firstName, userLastName: lastName , 
                contactFirstName: newContactFName, contactLastName: newContactLName, 
                contactEmail: newContactEmail, contactPhoneNumber: newContactPhone };
                
    let jsonPayload = JSON.stringify(tmp);


    let url = urlBase + "/AddContact." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("contactAddResult").innerHTML =
            "Contact has been added!";
        }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
    
    // refresh table with new contact
    contactTable();
    location.reload();
}

// function deleteUser() {

//   //Initialize variables for the username and the password for the user to be deleted
//   let deleteUserName = document.getElementById("username-form").value;
//   console.log(deleteUserName);
//   let deleteUserPassword = document. getElementById("password-form").value;
//   console.log(deleteUserPassword);
//   document.addEventListener('DOMContentLoaded', function() {
//     document.getElementById("deleteUserResult").innerHTML = "";
// });

//   //Create a tmp object that contains the username and the passweord of the user to be deleted
//   let tmp = {Login: deleteUserName, password: deleteUserPassword}

//   //Initialize a variable that contains a JSON o0bject of the login of the user to be deleted
//   let jsonPayLoad = JSON.stringify(tmp);

//   //Link the php file that contains the api that deletes the user
//   let url = urlBase + "/DeleteUser." + extension;

//   //Initialize a variable to get a request from the DeleteUser.php
//   let xhr = new XMLHttpRequest();

//   //Provide parameters for the http request
//   xhr.open("POST", url, true);
  
//   //Set the value of the HTTP request header (must be set right after http open method but befor the http send method)
//   xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

//   try {
//     xhr.onreadystatechange = function () {
//       if (this.readyState == 4 && this.status == 200) {
//         let jsonObject = JSON.parse(xhr.responseText);
//         if(jsonObject == "User does not exist!"){
//           document.getElementById("deleteUserResult").innerHTML = 
//          "Incorrect User Credentials";
//          return;
//         }
//         document.getElementById("deleteUserResult").innerHTML = 
//          "User deleted!";
//         console.log(jsonObject);

//         doLogout();
//       }
//     };
//     xhr.send(jsonPayLoad);
//   } catch (err) {
//     document.getElementById("deleteUserResult").innerHTML = err.message;
//   }
// }

function deleteContact(row) {          
                                                        
    let fName = row.children[0].textContent;
    let lName = row.children[1].textContent;
    let email = row.children[2].textContent;
    let phone = row.children[3].textContent;
 
    document.getElementById("deleteContactResult").innerHTML = "";
    
    let tmp = { userID: userId, userFirstName: firstName, userLastName: lastName, 
                contactFirstName: fName, contactLastName: lName, 
                contactEmail: email, contactPhoneNumber: phone };
    
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/DeleteContact." + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("contactTableResult").innerHTML =
                "Contact has been deleted";
                
                // idk what is returned.. 
                let jsonObject = JSON.parse(xhr.responseText);
                console.log("deleteContact output: " + JSON.stringify(jsonObject));
                
                
            } 
        };
        xhr.send(jsonPayload);
        
    } catch (err) {
        document.getElementById("contactDeleteResult").innerHTML = err.message;
    }
    
    
    // refresh table after deletion?
    contactTable();
    location.reload();
}

function editContact() {
    
    // API will need to know new data and data of contact to be deleted.
    let newFName = document.getElementById("first-edit-form").value;
    console.log(newFName);
    let newLName = document.getElementById("last-edit-form").value;
    console.log(newLName);
    let newEmail = document.getElementById("email-edit-form").value;
    console.log(newEmail);
    let newPhone = document.getElementById("phone-edit-form").value;
    console.log(newPhone.length);
    let oldFName = editRow.children[0].textContent;
    console.log(oldFName);
    let oldLName = editRow.children[1].textContent;
    let oldEmail = editRow.children[2].textContent;
    let oldPhone = editRow.children[3].textContent;
    
    document.getElementById("editContactResult").innerHTML = "";

    if(newFName.length === 0){
        newFName = editRow.children[0].textContent;
    }
    if(newLName.length === 0){
        newLName = editRow.children[1].textContent;
    }
    if(newEmail.length === 0){
        newEmail = editRow.children[2].textContent;
    }
    if(newPhone.length === 0){
        newPhone = editRow.children[3].textContent;
    }

    let tmp =   {   userID: userId, userFirstName: firstName, userLastName: lastName , 
                    contactFirstName: oldFName, contactLastName: oldLName, 
                    contactEmail: oldEmail, contactPhoneNumber: oldPhone, 
                    newContactFirstName: newFName, newContactLastName: newLName, 
                    newContactEmail: newEmail, newContactPhoneNumber: newPhone
                };
    
    
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/EditContact." + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("editContactResult").innerHTML =
                "Contact has been edited!";
            }
        };
        
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("editContactResult").innerHTML = err.message;
    }
    
    // refresh table after changes
    contactTable();
    location.reload();
}

function contactTable() {
    
    document.getElementById("contactTableResult").innerHTML = "";

    // refresh table, delete all rows except for header
    let table = document.getElementById("contact-table");
    let num_rows = table.rows.length;
    for (let i = num_rows - 1; i > 0; i--) {
        table.deleteRow(i);
    }
	
    let tmp = { userID: userId, userFirstName: firstName, userLastName: lastName };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/SearchContacts." + extension;
    
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                
                let jsonObject = JSON.parse(xhr.responseText);
                
                let table = document.getElementById("contact-table");
                
                jsonObject.results.forEach(function(object) {
                    let tr = document.createElement("tr");
                    let first = object.contactFirstName;
                    let last = object.contactLastName;
                    let email = object.contactEmail;
                    let phone = object.contactPhoneNumber;
			        // console.log(first + last + email);
                    tr.innerHTML =  '<td>' + first + '</td>' +
                                    '<td>' + last + '</td>' +
                                    '<td>' + email + '</td>' +
                                    '<td>' + phone + '</td>' +                              
                                    '<td class = "edit"> <button class = "editBtn" onclick = "editPopup(this.parentNode.parentNode);"> <img src="images/editicon.png" alt="edit" height="40px" width="40px"> </button> </td>' +
                                    '<td class = "remove"> <button class = "removeBtn" onclick = "deleteContact(this.parentNode.parentNode);"> <img src="images/removeicon.png" alt="delete" height="40px" width="40px"> </button> </td>' ;
                    table.appendChild(tr);
                });
            }
        };
        
        xhr.send(jsonPayload);
        
    } catch (err) {
        document.getElementById("contactTableResult").innerHTML = err.message;
    }
}


function searchContacts() {

    let contactName = document.getElementById("contactName").value;

    let tmp = { userID: userId, userFirstName: firstName, userLastName: lastName };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/SearchContacts." + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200) {
                
                let jsonObject = JSON.parse(xhr.responseText);
                let table = document.getElementById("contact-table");
                let num_rows = table.rows.length;
                for (let i = num_rows - 1; i > 0; i--) {
                    table.deleteRow(i);
                }

                jsonObject.results.forEach(function(object) {
                    let chosenContact = object.contactFirstName.concat(' ', object.contactLastName);
                    console.log(chosenContact);

                    if(chosenContact.toUpperCase().includes(contactName.toUpperCase())){
                        console.log(chosenContact);
                        
                        let tr = document.createElement("tr");
                        
                        let first = object.contactFirstName;
                        let last = object.contactLastName;
                        let email = object.contactEmail;
                        let phone = object.contactPhoneNumber;
                        tr.innerHTML =  '<td>' + first + '</td>' +
                                    '<td>' + last + '</td>' +
                                    '<td>' + email + '</td>' +
                                    '<td>' + phone + '</td>' +                              
                                    '<td class = "edit"> <button class = "editBtn" onclick = "editPopup(this.parentNode.parentNode);"> <img src="images/editicon.png" alt="edit" height="40px" width="40px"> </button> </td>' +
                                    '<td class = "remove"> <button class = "removeBtn" onclick = "deleteContact(this.parentNode.parentNode);"> <img src="images/removeicon.png" alt="delete" height="40px" width="40px"> </button> </td>' ;
                    table.appendChild(tr);
                    }

                });
            }
        };
        xhr.send(jsonPayload);

    } catch (err) {
        document.getElementById("searchContactResult").innerHTML = err.message;
    }
}



// popup styling
function contactPopup() {
    document.querySelector("#addContactBtn").addEventListener("click", function() {
        document.querySelector("#popup").classList.add("active");
    } );
    document.querySelector("#popup .closeBtn").addEventListener("click", function() {
        document.querySelector("#popup").classList.remove("active");
    } );
}

function editPopupClose() {
    document.querySelector("#popupEdit .closeBtn").addEventListener("click", function() {
        document.querySelector("#popupEdit").classList.remove("active");
    });
}

function editPopup(row) {
    editRow = row;
    document.querySelector("#popupEdit").classList.add("active");
}   

// these functions change html/css elements and so need the DOM to be loaded in order to run
document.addEventListener('DOMContentLoaded', function() {
    //contactTable();
    contactPopup();
    editPopupClose();
});

function startup(){
    readCookie();
    contactTable();
}

function showHidePassword(){
    var x = document.getElementById("loginPassword");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}