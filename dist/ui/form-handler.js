const mainForm = document.querySelector("#main-form");
const addButton = document.querySelector("#btn-add");
const submitButton = document.querySelector("#btn-submit");

let count = 0;

function br() {
    return document.createElement("br");
}

function div(text) {
    let div = document.createElement("div");
    div.innerHTML = text;
    return div;
}

function changeImage(img, file) {
    
    if (img && file && file[0]) {
        img.src = window.URL.createObjectURL(file[0]);
        img.style.display = "inline-block"
    }
    else {
        img.style.display = "none";
    }
}

function createTemplate(id) {

    let mainCard = document.createElement("div");
    mainCard.className = "card";

    let cardBody = document.createElement("div");
    cardBody.className = "card-body";

    let title = document.createElement("h6");
    title.className = "card-title text-muted";
    title.innerText = "Submission " + (id + 1);

    let imageSubmission = document.createElement("input");
    imageSubmission.type = "file";
    imageSubmission.accept = "image/*";
    imageSubmission.capture = "camera";
    imageSubmission.name = "image " + (id + 1);
    imageSubmission.required = true;

    let preview = document.createElement("img");
    preview.className = "col-12";
    preview.style.height = "400px";
    preview.style.display = "none";

    imageSubmission.onchange = function(event) {
        changeImage(preview, imageSubmission.files);
    }

    let description = document.createElement("textarea");
    description.className = "col-12";
    description.name = "description " + (id + 1);
    description.required = true;

    let deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-sm";
    deleteBtn.role = "button";
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = function(event) {
        event.preventDefault();
        mainCard.remove();
    }

    let bottom = document.createElement("div");
    bottom.className = "d-flex justify-content-end";
    bottom.appendChild(deleteBtn);

    cardBody.appendChild(title);
    cardBody.appendChild(div("Image"));
    cardBody.appendChild(imageSubmission);
    cardBody.appendChild(preview);
    cardBody.appendChild(br());
    cardBody.appendChild(br());
    cardBody.appendChild(div("Description"));
    cardBody.appendChild(description);
    cardBody.appendChild(bottom);
    mainCard.appendChild(cardBody);

    return mainCard;
}


submitButton.addEventListener("click", function () {
    mainForm.submit();
});

addButton.addEventListener("click", function () {
    let newCard = createTemplate(count++);
    mainForm.appendChild(newCard);
});