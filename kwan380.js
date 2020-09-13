var index = 0,
    sections = document.getElementsByClassName("section"),
    imgs = document.getElementsByClassName("icon"),
    num = imgs.length,
    productSection = document.getElementById("product-section");
    search = productSection.getElementsByTagName("input")[0],
    commentBut = document.getElementById("commentBut"),
    showCom = document.getElementById('showCom'),
    guestName = document.getElementById('guestName'),
    comment = document.getElementById('comment'),
    newsList = document.getElementById('news-list');

function initiation() {
    for (var i = 0; i < num; i++) {
        sections[i].style.display = "none";
    }
    sections[index].style.display = "block";
}

function changeSection() {
    for (var i=0;i<num;i++){
        imgs[i].style.background = "white";
        sections[i].style.display = "none";
    }
    imgs[index].style.background = "gray";
    sections[index].style.display = "block";
}

window.onload = function(){
    initiation();
    getProducts();
    displayNews();
    getComments();
    getvcard();
    for (var i =0;i<num;i++){
        imgs[i].id = i;
        imgs[i].onclick = function(){
            index = this.id;
            changeSection();
        }
    }
}

function getProducts() {
    const fetchPromise = fetch('http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/items', {
        headers : {
            "Accept" : "application/json",
            },
        });
    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then((data) => displayProducts(data));
}

function displayProducts(data){
    const tab = document.getElementById("products-list");
    var html = "";
    for (var i =0;i<data.length; i++){
        html += getImg(data,i) + getTitle(data,i) +
            getDetail(data, i);
    }
    tab.innerHTML = html;
}

function getImg(data, i) {
    var src = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/itemimg?id=" + data[i].ItemId;
    var html = "";
    html += "<div style='padding: 20px 0 15px'>"
    var img = new Image();
    img.src = src;
    html += "<img src='" + img.src + "' max-width=55% height=250px>";
    html += "</div>";
    return html;
}


function getTitle(data, i) {
    var html = "";
    html += "<p style='clear: both; padding-top: 20px'>";
    var description = data[i].Title;
    html += description + "</p>";
    return html;
}


function getDetail(data, i) {
    var html = "";
    html += "<div style='height: 70px;>"
    html += "<p style='font-size: 16px; color: gray;>";
    html += 'Country:'  + data[i].Origin  + "<hr>";
    html += 'Type: ' + data[i].Type + "<hr>";
    html += 'Price: ' + data[i].Price;
    html += "</p>" + "</div>";
    html += "<button style='height:28px;width:100px;font-size:20px; border:1px solid black;' type=‘button’>Buy now</button>"
    return html;
}

search.oninput = function() {
    var content = search.value.trim();
    var uri = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/search?term=" + content;
    const fetchPromise = fetch(uri, {
        headers : {
            "Accept" : "application/json",
            },
        });
    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then((data) => displayProducts(data));
}

function displayNews(){
    const fetchPromise = fetch('http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/news', {
        headers : {
            "Accept" : "application/json",
            },
        });
    const streamPromise = fetchPromise.then((response) => response.json());
    streamPromise.then((data) => showNews(data));
}

function showNews(data){
    var html = "";
    for (var i =0;i<data.length; i++){
        html += getImage(data, i) + getImageDetails(data, i) +
            getDesciptionField(data, i);
    }
    newsList.innerHTML = html;
}

function getImage(data, i) {
    var html = "";

    html += "<div style='padding: 20px 0 15px' class='news-image-div'>"
    var img = new Image();
    img.src = data[i].enclosureField.urlField;
    html += "<img src='" + img.src + "' max-width=55% height=400px>";
    html += "</div>";
    return html;
}

function getImageDetails(data, i){
    var html = "";
    html += "<p style='font-size: 16px; color: gray; float: left; width: 50%'>";
    html += "<a href=" + data[i].linkField + ">";
    html += data[i].titleField;
    html += "</a>";
    html += "<p style='font-size: 16px; color: gray; float: right; width: 50%'>";
    html += data[i].pubDateField + "</p>";
    html += "</p>";
    return html;
}

function getDesciptionField(data, i) {
    var html = "";
    html += "<p style='clear: both; padding-top: 20px'>";
    var descriptionField = data[i].descriptionField;
    html += descriptionField + "</p>"
    return html;
}

function getComments() {
    const fetchPromise = fetch('http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/htmlcomments', {
        headers : {
            "Accept" : "application/json",
            },
        });
    const streamPromise = fetchPromise.then((response) => response.text());
    streamPromise.then((data) => showCom.innerHTML = data);
}

commentBut.onclick = function(){
    const uri = "http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/comment?name=" + guestName.value;
    const fetchPromise = fetch(uri, {headers : {
        "Content-Type" : "application/json;charset=UTF-8",},
            method : "POST",
            body : JSON.stringify(comment.value)
    }).then(response => {getComments()});
    comment.value = '';
    guestName.value = '';
}

function getvcard(){
    const fetchPromise = fetch('http://redsox.uoa.auckland.ac.nz/ds/DairyService.svc/vcard', {
        headers : {
            "Accept" : "application/json",
            },
        });
    const streamPromise = fetchPromise.then((response) => response.text());
    streamPromise.then((data) => console.log(data));
}
