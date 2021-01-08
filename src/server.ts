import express = require("express");
import multer = require("multer");
import path = require("path");
import fs = require("fs");

const app = express();
const port = 3030;

app.use(express.static(path.join(__dirname, "ui"), {
    cacheControl: false,
}))

function getTodayDirName() {
    return new Date().toLocaleDateString().replace("/", "-").replace("/", "-");
}

function getNowDirName() {
    let now = new Date();
    return now.toLocaleTimeString().replace(/:/g, "-") + " " + now.getSeconds();
}

function createUpload() {
    return multer({
        // storage: storage,
        dest: path.join(__dirname, "uploads")
    });
}

function getExt(name: string) {
    return name.split("/")[1];
}

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.post("/submit", createUpload().any(), (req: express.Request, res: express.Response) => {
    let files = req.files;
    let descs = req.body;

    if (files.length == 0) {
        console.log("no files");
        res.sendFile(path.join(__dirname, "submitted.html"));
        return; 
    }
    let rootFiles = path.join(__dirname, "files");
    let todayFolder = path.join(rootFiles, getTodayDirName());
    let nowFolder = path.join(todayFolder, getNowDirName());
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
    let i = 0;
    for (let file in files) {
        // console.log(files[file]);
        let newName = path.join(nowFolder, `case-${i + 1}.${getExt(files[file].mimetype)}`);
        let newDescName = path.join(nowFolder, `case-${i + 1}-description.txt`);
        let currentFile = path.join(__dirname, "uploads", files[file].filename);
        fs.renameSync(currentFile, newName);
        let d: string = descs[`description ${i + 1}`];
        if (d.trim()) {
            fs.writeFileSync(newDescName, d);
        }
        i++;
    }
    res.sendFile(path.join(__dirname, "submitted.html"));
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});