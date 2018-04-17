// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection

  // App routes
  routes: routes,
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});





var medArray = [];
//save medication
function saveMedication() {  
  var names = document.getElementById('names').value;
  var sdate = document.getElementById('sdate').value;
  var edate = document.getElementById('edate').value;
  var times = document.getElementById('times').value;

  Framework7.request.post('http://top9hosting.com/greencf_api/data_actions.php', { oname: names, osdate: sdate,  oedate: edate, otimes: times, action: 'save_medication'}, function (data) {
    app.dialog.alert(data, '');
    loadMedication();
  });
}  

//on medicatio page init
$$(document).on('page:init', '.page[data-name="medication"]', function (e) {
  loadMedication();
});

//load mediccation records
function loadMedication(){
  var items = [];
  Framework7.request.get('http://top9hosting.com/greencf_api/medication_view.php', function (data) {
    var getdata = JSON.parse(data);
    var objcounts = Object.keys(getdata).length - 1;
    console.log(objcounts);
    console.log(getdata['0']['name']);  
    
    var i = 0;
    for(i = 0; i < objcounts; i++){
      console.log(i);
      items.push({
        title: getdata[i]['name'],
        usage: getdata[i]['usage'],
        times: getdata[i]['time'],
        id:    getdata[i]['id']
      });
    }

    console.log(items);

    var virtualList = app.virtualList.create({
      // List Element
      el: '.virtual-list',
      // Pass array with items
      items: items,
      // Custom search function for searchbar
      searchAll: function (query, items) {
        var found = [];
        for (var i = 0; i < items.length; i++) {
          if (items[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
        }
        return found; //return array with mathced indexes
      },
      // List item Template7 template
      itemTemplate:
        '<li data-id="{{id}}" data-tbl="med">' +
          '<div class="item-content itm">' +
            '<div class="item-media"><i class="f7-icons size-22">calendar_fill</i></div>' +
            '<div class="item-inner">' +
                '<div class="item-title">{{title}}</div>' +
                '<div class="item-after">{{times}} Times {{usage}}</div>' +
                '<div class="fab fab-right-bottom" id="load_action{{id}}"></div>'+
            '</div>' +
            
          '</div>' +
        '</li>' ,
      // Item height
      height: app.theme === 'andriod' ? 63 : 73,
      });

  });
}


//get medicatio data from storage
function getMedication(){
  var getmed = localStorage.getItem('medication');
  getmed = JSON.parse(getmed);
  return getmed;
}


//display delete button
$$(document).on('click', '.virtual-list li', function (){
  //console.log('click');
 // console.log($$(this).data('id'));
  var getid = $$(this).data('id');
  var datatbl =$$(this).data('tbl');
  //console.log(datatbl);
  var loadi = document.getElementById('load_action'+getid);

  loadi.innerHTML = '<i data-id="'+getid+'" data-tbls="'+datatbl+'" class="f7-icons size-22 color-red hands del">trash_fill</i>';
  setTimeout(function(){ 
    loadi.innerHTML = '';
   },  2000);
});



//-------------------------News----------------------------------------------------------
//on news page init
$$(document).on('page:init', '.page[data-name="news"]', function (e) {
  var items = [];
  Framework7.request.get('http://top9hosting.com/greencf_api/news.php', function (data) {
    var getdata = JSON.parse(data);
    var objcounts = Object.keys(getdata).length - 1;
    console.log(objcounts);
    console.log(getdata);
    console.log(getdata['0']['title']); 

    var i = 0;
    for(i = 0; i < objcounts; i++){
      var nlinks = getdata[i]['link'];
      var imgi = nlinks.replace("releases", "images");
      var imgn = imgi.replace(".htm", "-large.jpg");

      console.log(imgn);
      items.push({
        titles: getdata[i]['title'],
        date: getdata[i]['date'],
        imgs: imgn,
        descr: getdata[i]['desc'],
        links: getdata[i]['link'],
      });
    }

    console.log(items);
    var virtualList = app.virtualList.create({
      // List Element
      el: '.virtual-list',
      // Pass array with items
      items: items,
      // Custom search function for searchbar
      searchAll: function (query, items) {
        var found = [];
        for (var i = 0; i < items.length; i++) {
          if (items[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
        }
        return found; //return array with mathced indexes
      },
      // List item Template7 template
      itemTemplate:
      '<div class="block block-strong newswrp">' +
      '<div class="card demo-card-header-pic">' +
          '<div style="background-image:url({{imgs}})" class="card-header align-items-flex-end newsh">{{titles}}</div>'+
          '<div class="card-content card-content-padding">' +
          '<p class="date">Posted on {{date}}</p>' +
          '<p{{titles}}</p>' +
          '<p{{descr}}</p>' +
          '</div>' +
          '<div class="card-footer"><a href="{{links}}" class="link external">Read more</a></div>' +
      '</div>'+
      '</div>',
      // Item height
      height: app.theme === 'andriod' ? 63 : 73,
      });
  });
});




//------------------------calculate BMI------------------------------------
$$(document).on('click', '.btn_bmi', function (){
  var bmiw = document.getElementById('bmiw').value;
  var bmih = document.getElementById('bmih').value;
  var bmi = (bmiw / bmih / bmih) * 10000;
  var bmiResult = document.getElementById('bmi_result');
  bmi = bmi.toFixed(2);

  if(bmi >= 18.5 && bmi <= 25){
    bmiResult.innerHTML = '<img src="../img/happy.png"> Your normal ';
    bmiResult.classList.add('r_green');
    bmiResult.classList.remove('r_yellow');
    bmiResult.classList.remove('r_red');
  }
  if(bmi <= 18.5){
    bmiResult.innerHTML = '<img src="../img/sad.png"> Your underweight!  ';
    bmiResult.classList.add('r_yellow');
    bmiResult.classList.remove('r_green');
    bmiResult.classList.remove('r_red');
  }
  if(bmi >=30){
    bmiResult.innerHTML = '<img src="../img/shocked.png"> Your Obese!  ';
    bmiResult.classList.add('r_red');
    bmiResult.classList.remove('r_green');
    bmiResult.classList.add('r_yellow');
  }
 // console.log(bmi);

});


//--------------------------Appointments-------------------------------------
//on Appointments page init
$$(document).on('page:init', '.page[data-name="appointment"]', function (e) {
  loadAppointments();
});

//load Appointments
function loadAppointments(){
  var items = [];
  Framework7.request.get('http://top9hosting.com/greencf_api/appointments_view.php', function (data) {
    var getdata = JSON.parse(data);
    var objcounts = Object.keys(getdata).length - 1;
    console.log(objcounts);
    console.log(getdata['0']['clinic_name']);  
    
    var i = 0;
    for(i = 0; i < objcounts; i++){
      console.log(i);
      items.push({
        clininame: getdata[i]['clinic_name'],
        docname: getdata[i]['doctor_name'],
        apdate: getdata[i]['app_date'],
        id: getdata[i]['id']
      });
    }

    console.log(items);

    var virtualList = app.virtualList.create({
      // List Element
      el: '.virtual-list',
      // Pass array with items
      items: items,

      // List item Template7 template
      itemTemplate:
        '<li data-id="{{id}}" data-tbl="apt">' +
          '<div class="item-content itm">' +
            '<div class="item-media"><i class="f7-icons size-22">calendar_fill</i></div>' +
            '<div class="item-inner">' +
                '<div class="item-title">{{clininame}} - {{docname}}</div>' +
                '<div class="item-after">{{apdate}} </div>' +
                '<div class="fab fab-right-bottom" id="load_action{{id}}"></div>'+
            '</div>' +
            
          '</div>' +
        '</li>' ,
      // Item height
      height: app.theme === 'andriod' ? 63 : 73,
      });

  });
}

//save appointments
//var medArray = [];
function saveAppointment() {  
  var names = document.getElementById('names').value;
  var doctor = document.getElementById('doctor').value;
  var sdate = document.getElementById('sdate').value;

  Framework7.request.post('http://top9hosting.com/greencf_api/data_actions.php', { oname: names, odoctor: doctor,  odate: sdate, action: 'save_appointments'}, function (data) {
    app.dialog.alert(data, '');
    loadAppointments();
  });
}  


//----------delete ---------------------------------------------
$$(document).on('click', '.del', function (){
  var getdid = $$(this).data('id');
  var whichdata = $$(this).data('tbls');
  //delete medicine
  if(whichdata == 'med'){
    Framework7.request.post('http://top9hosting.com/greencf_api/data_actions.php', { id: getdid, action: 'delete_medication'}, function (data) {
      app.dialog.alert(data, '');
      loadMedication();
    });
  }
  //delete appointments
  if(whichdata == 'apt'){
    Framework7.request.post('http://top9hosting.com/greencf_api/data_actions.php', { id: getdid, action: 'delete_appointmwnts'}, function (data) {
      app.dialog.alert(data, '');
      loadAppointments();
    });
  }

});