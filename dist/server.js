"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var multer = require("multer");
var path = require("path");
var fs = require("fs");
var app = express();
var port = 3030;
app.use(express.static(path.join(__dirname, "ui"), {
    cacheControl: true,
}));
function getTodayDirName() {
    return new Date().toLocaleDateString().replace("/", "-").replace("/", "-");
}
function getNowDirName() {
    var now = new Date();
    return now.toLocaleTimeString().replace(/:/g, "-") + " " + now.getSeconds();
}
function createUpload() {
    return multer({
        // storage: storage,
        dest: path.join(__dirname, "uploads")
    });
}
function getExt(name) {
    return name.split("/")[1];
}
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.post("/submit", createUpload().any(), function (req, res) {
    var files = req.files;
    var descs = req.body;
    var rootFiles = path.join(__dirname, "files");
    var todayFolder = path.join(rootFiles, getTodayDirName());
    var nowFolder = path.join(todayFolder, getNowDirName());
    if (!fs.existsSync(rootFiles)) {
        console.log("creating today dir");
        fs.mkdirSync(rootFiles);
    }
    if (!fs.existsSync(todayFolder)) {
        console.log("creating today dir");
        fs.mkdirSync(todayFolder);
    }
    if (!fs.existsSync(nowFolder)) {
        fs.mkdirSync(nowFolder);
    }
    // console.log(descs);
    var i = 0;
    for (var file in files) {
        // console.log(files[file]);
        var newName = path.join(nowFolder, "case-" + (i + 1) + "." + getExt(files[file].mimetype));
        var newDescName = path.join(nowFolder, "case-" + (i + 1) + "-description.txt");
        var currentFile = path.join(__dirname, "uploads", files[file].filename);
        fs.renameSync(currentFile, newName);
        var d = descs["description " + (i + 1)];
        if (d.trim()) {
            fs.writeFileSync(newDescName, d);
        }
        i++;
    }
    res.sendFile(path.join(__dirname, "submitted.html"));
});
app.listen(port, function () {
    console.log("Listening on port " + port);
});
//# sourceMappingURL=server.js.map