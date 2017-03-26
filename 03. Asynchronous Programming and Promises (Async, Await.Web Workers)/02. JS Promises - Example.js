console.log("Before promise");

new Promise(function(resolve, reject) {
    console.log("Promise started");
    setTimeout(function() {
        console.log("Promis resolved");      
        resolve("Promise done!"); 
    }, 2000);
    //reject("Test Error");
    console.log("Promise finished");
})
.then(function(result) {
    console.log("Then returned: " + result);
})
.catch(function(error) { console.log(error); });

console.log('After promise');
