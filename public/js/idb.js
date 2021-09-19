// variable to hold db connection
const db;
// establish a connection to IndexedDB db called budget
const request = indexedDB.open('budget', 1);

// this event will emit it the db version changes
request.onupgradeneeded = function(event) {
    // save a ref to the db
    const db = event.target.result;
    //create an object store (table) called 'new_input'
    db.createObjectStore('new_ticket', { autoIncrement: true })
};