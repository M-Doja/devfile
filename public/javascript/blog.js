// BLOG PAGE-----------------------------------------------------------

function showMenu() {
    $("#menu").toggle();
    // $("#ctrlBtn").hide();
}
function closeForm() {
  $(".form").toggle();
  // $("#ctrlBtn").show();
}

// SHOW WELCOME MSG TO ADMIN OR VISITOR
$('#visitor').css( 'display', 'inline-block');
$('#admin').css( 'display', 'none');

// WILL DISPLAY ADMIN CTRLS IF ADMINKEY IS ENTERED
document.getElementById('AdminBtn').addEventListener('click', function() {
  var Key = 'admin';
  var name = $('#AdminName').val();
  var keyStr = document.getElementById('key').value;
  var adminkey = keyStr.toLowerCase();
    if(adminkey === Key) {

      // $('#admin').css( 'display', 'inline-block')
      $("#msg").html("Welcome Admin " + name);
      $('#delBtn').css( 'display', 'inline-block');
      // $('.editBtn').css( 'display', 'inline-block');
      $('#visitor').css( 'display', 'none');
      $("#adPan").css( 'display', 'none');
      $("#ctrlBtn").css( 'margin-top', '40px');
    }
    else {
      alert('Please enter a valid Admin Key!');
      $('#visitor').css( 'display', 'inline-block')
      document.getElementById('key').value = '';
      $('#AdminName').val('');
    }
    console.log(adminkey);
    document.getElementById('key').value = '';
    $('#AdminName').val('');
}, false);

// SORT BLOGS
// $("li").sort(function(a,b){
//     return new Date($(a)) > new Date($(b));
// }).each(function(){
//     $("#blogs").prepend(this);
// })

//  Creates an empty Array
var blogs = [];

// BLOG CONSTRUCTOR FUNCTIION
function BlogPost(title, description, body, pic, author, date){
  this.title = title;
  this.description = description;
  this.body = body;
  this.pic = pic;
  this.author = author;
  this.date = new Date();
}
console.log(BlogPost);

// SAVE A BLOG ENTRY TO DATABASE
// STORE INPUT IN VARIABLES
function saveBlog(){
  var title = document.getElementById("blogTitle").value;
  var body = document.getElementById("blogBody").value;
  var description = document.getElementById("blogDescription").value;
  var pic = document.getElementById("blogPhotoURL").value;
  var author = document.getElementById("blogAuthor").value;

  // if feild is empty then return out of function, else execute
  if (title === ""  || body === ""  || author === "") {
    return
  }
  var blog = new BlogPost(title, description, body, pic, author, Date);
  console.log(blog);

  // SAVE BLOG TO DATABASE
  var req = new XMLHttpRequest();
  req.open('POST',"https://pages-blogger.firebaseio.com/.json");
  req.onload = function(){
      $(".form").hide();
      getBlogs();
  }
  // CLEAR THE FORM OF DATA FOR NEXT ENTRY
  document.getElementById("blogTitle").value = "";
  document.getElementById("blogDescription").value = "";
  document.getElementById("blogBody").value = "";
  document.getElementById("blogPhotoURL").value = "";
  document.getElementById("blogAuthor").value = "";

  req.send(JSON.stringify(blog));

    // setting date created
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  var output = d.getFullYear() + '/' +
      ((''+month).length<2 ? '0' : '') + month + '/' +
      ((''+day).length<2 ? '0' : '') + day;

  document.getElementById("blogs").value = "<br><time>" + output + "</time>";
}

// DISPLAY ALL THE BLOGS FROM DATABASE ON THE PAGE
function getBlogs(){
  var req = new XMLHttpRequest();
  req.open("GET", "https://pages-blogger.firebaseio.com/.json");
  req.onload = function(){
  console.log(req);
  if (200 <= this.status < 400){
    var res = JSON.parse(this.response);
    console.log(res);
    var elemStr = "";
    blogs.length = 0; // empties the array
    for (var prop in res){
      res[prop]._id = prop;
      blogs.push(res[prop]);
      elemStr += "<br><li><span id='BlogTitle'>" + res[prop].title + "</span><br>"
      + "<img class='img-responsive' src='"+res[prop].pic +"'><br>"
      + "Summary:  "+ res[prop].description + "<br>"
      + "Author: <b>" + res[prop].author + "</b><br>"
      + "Published: " +  res[prop].date + "<br><br>" +  res[prop].body + "<br><br>"
      + "<button style='margin-bottom:40px;' class='btn btn-warning btn-sm editBtn' onclick='startEdit(" + (blogs.length - 1) + ")'>Edit</button>"
      + "</li><a href='#'>Top</a><hr class='hr'>"
      $("#blogMessage").hide();
      $("#buttonsGoHere").html('');
    }
    document.getElementById('blogs').innerHTML = elemStr;
    // console.log(res);
    }else {
      console.log(this.response);
    }
  }
  req.send();
}
getBlogs();

function ShowEditBtn(){
  $(".editBtn").css("display", "inline-block");
}
// EDIT A SPECFIC BLOG POST
// GET DATA ON SPECIFIC BLOG TO EDIT
function startEdit(index){
  $("#editTitle").val(blogs[index].title);
  $("#editDescription").val(blogs[index].description);
  $("#editBody").val(blogs[index].body);
  $("#editPic").val(blogs[index].pic);
  $("#editAuthor").val(blogs[index].author);
  $("#editSubmitButton").html('<button onclick="saveEdit(' + index +')" class="btn btn-primary">Save Changes</button>');
  $("#myModal").modal('toggle');
}

// STORES EDIT INPUT IN NEW BLOG
function saveEdit(index){
  var title = $("#editTitle").val();
  var description = $("#editDescription").val();
  var body = $("#editBody").val();
  var pic = $("#editPic").val();
  var author = $("#editAuthor").val();
  var blog = new BlogPost(title, description, body, pic, author, Date);

    // SENDING EDIT TO DATABASE FOR SPECIFIC BLOG
  $.ajax({
    url: "https://pages-blogger.firebaseio.com/" + blogs[index]._id + "/.json",
    type: "PUT",
    data: JSON.stringify(blog)
  }).success(function(res){
     res = this.response
    getBlogs();
  })
  $("#myModal").modal('toggle');
}

// DELETE A SPECFIC BLOG OR BLOGS
function deleteBlogs() {
  var elemStr = "";
  for (var i=0; i<blogs.length; i+=1){
    elemStr +="<li><input id='"+ blogs[i]._id + "'type='checkbox' value='false' class='form-control' style='dislay:inline-block; margin-right:5px; margin-bottom:5px;'/>" + blogs[i].title + ": " + blogs[i].description + " | " + blogs[i].body + "</li>"
    }
    $("#blogs").html(elemStr);
    $("#buttonsGoHere").html('<button class="btn btn-success" onclick="saveDelete()">Delete Selected</button><button class="btn btn-danger" onclick="cancel()">Cancel</button>');
  }

// CANCEL BLOG DELETING ACTION
function cancel(){
  $("#buttonsGoHere").html('');
  getBlogs();
}

// TRACK WHAT BLOG TO DELETE
var delCount,
    boxes;
function saveDelete(){
  delCount = 0;
  boxes = $(":checkbox:checked");
  if(boxes.length > 0){
    deleteBlogsFunc(boxes[0].id);
  }
}

// DELETING SPECFIC BLOG FROM DATA BASE
//  recursive function
function deleteBlogsFunc(id){
  $.ajax({
    url:'https://pages-blogger.firebaseio.com/' + id + '/.json', type: 'DELETE'
  }).success(function(){
    delCount += 1;
    if(delCount < boxes.length){
      deleteBlogsFunc(boxes[delCount].id);
    } else {
      getBlogs();
    }
  })
}
