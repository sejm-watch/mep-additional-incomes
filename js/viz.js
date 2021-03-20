d3.csv("/data/declarations.csv", function(data) {
    for (var i = 0; i < data.length; i++) {
        console.log(data[i].deputy_name);
    }
});
