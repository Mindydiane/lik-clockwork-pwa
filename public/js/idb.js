// variable to hold db connection
const db;
// establish a connection to IndexedDB db called budget
const request = indexedDB.open('budget', 1);

// this event will emit it the db version changes
request.onupgradeneeded = function(event) {
    // save a ref to the db
    const db = event.target.result;
    //create an object store (table) called 'new_input'
    db.createObjectStore('new_input', { autoIncrement: true })
};

// get function set up to be sucessfully created w/object store
request.onsuccess = function(event) {
    db = event.target.result;
    // ck if app is online
    if (navigator.onLine) {
       uploadPizza(); 
    }
};

request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transcation(['new_input'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('new_input');
    // add record to your store w/add method
    budgetObjectStore.add(record);
}

function uploadBudget() {
    // open a trans on your pending db
    const transaction = db.transaction(['new_input'], 'readwrite');
    // access your pending object store
    const budgetObjectStore = transaction.objectStore('new_input');
    //get all records from store and set to a variable
    const getAll = budgetObjectStore.getAll();
    
    getAll.onsuccess = function() {
        // if there was data in indexedDb store, let's send it to the api server
        if (getAll.result.lengeth > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                  Accept: 'application/json, text/plain, */*',
                  'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(['new_input'], 'readwrite');
                const budgetObjectStore = transaction.objectStore('new_input');
                // clear all items in your store
                budgetObjectStore.clear();
            })
            .catch(err => {
            // set reference to redirect back here
            console.log(err);
            })
        }
    };
}

// listen fo app coming back online
window.addEventListener('online', uploadBudget);