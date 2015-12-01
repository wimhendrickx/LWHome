var favMovies = new Firebase('https://blinding-torch-7787.firebaseio.com/');
 
function saveToList(event) {
    if (event.which == 13 || event.keyCode == 13) { // as the user presses the enter key, we will attempt to save the data
        var courseName = document.getElementById('courseName').value.trim();
        if (courseName.length > 0) {
            saveToFB(courseName);
        }
        document.getElementById('courseName').value = '';
        return false;
    }
};
 
function saveToFB(courseName) {
    // this will save data to Firebase
    favCourses.push({
        name: courseName
    });
};
 
function refreshUI(list) {
    var lis = '';
    for (var i = 0; i < list.length; i++) {
        lis += '<li data-key="' + list[i].key + '">' + list[i].name + ' [' + genLinks(list[i].key, list[i].name) + ']</li>';
    };
    document.getElementById('favCourses').innerHTML = lis;
};
 
function genLinks(key, mvName) {
    var links = '';
    links += '<a href="javascript:edit(\'' + key + '\',\'' + mvName + '\')">Edit</a> | ';
    links += '<a href="javascript:del(\'' + key + '\',\'' + mvName + '\')">Delete</a>';
    return links;
};
 
function edit(key, mvName) {
    var courseName = prompt("Update the course name", mvName); // to keep things simple and old skool :D
    if (courseName && courseName.length > 0) {
        // build the FB endpoint to the item in movies collection
        var updateMovieRef = buildEndPoint(key);
        updateMovieRef.update({
            name: courseName
        });
    }
}
 
function del(key, mvName) {
    var response = confirm("Are certain about removing \"" + mvName + "\" from the list?");
    if (response == true) {
        // build the FB endpoint to the item in movies collection
        var deleteMovieRef = buildEndPoint(key);
        deleteMovieRef.remove();
    }
}
 
function buildEndPoint (key) {
	return new Firebase('https://blinding-torch-7787.firebaseio.com/' + key);
}
 
// this will get fired on inital load as well as when ever there is a change in the data
favMovies.on("value", function(snapshot) {
    var data = snapshot.val();
    var list = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            name = data[key].name ? data[key].name : '';
            if (name.trim().length > 0) {
                list.push({
                    name: name,
                    key: key
                })
            }
        }
    }
    // refresh the UI
    refreshUI(list);
});
