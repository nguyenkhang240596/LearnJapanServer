var FCM = require('fcm-node');
var serverKey = 'AAAA8hPIXpk:APA91bGkLY8tNvGQNyqgNngoYRkb5EuSb22Hh48n3XNz0DYklcJBw8EjV1hKQUxErkFdGcCIwEIsWTwo7ENeU8QussM1jltpAjCmd-Gg5oy83Mz5Z85zpdIhhBkS9o_PisRqqf0S70GQ'; //put your server key here
var fcm = new FCM(serverKey);

global.message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: 'Token', 
    collapse_key: 'myCollapseKey',
    
    notification: {
        title: 'Learn Japan', 
        body: '' 
    },
    
    data: {  //you can send only notification or only data(or include both)
        my_key: 'my value',
        my_another_key: 'my another value'
    }
};

    

var config = {
  apiKey: "AIzaSyADnJnv7Lntfka2JwWqaG-WzgOWLQsq2f4",
  authDomain: "learnjapan-4b5b5.firebaseapp.com",
  databaseURL: "https://learnjapan-4b5b5.firebaseio.com",
  projectId: "learnjapan-4b5b5",
  storageBucket: "learnjapan-4b5b5.appspot.com",
  messagingSenderId: "1039713984153"
};

var firebase = require('firebase');
firebase.initializeApp(config);
var database = firebase.database();
var sitesToVisitRef = firebase.database().ref("SettingNotification");

var schedule = require('node-schedule');

sitesToVisitRef.on('child_added', function(data) {
  console.log(data.key, data.val(),"added")
    schedule.scheduleJob(data.key, data.val()["time"], function(){
        var msg = global.message;
        msg.to = data.val()["token"];
        msg.notification.body = data.val()["msg"];
        console.log(msg.to, 'to')
        fcm.send(msg, function(err, response){
            if (err) {
                console.log("Something has gone wrong!");
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
    });
}); 

sitesToVisitRef.on('child_changed', function(data) {
    var job = schedule.scheduledJobs[data.key]
    job.cancel();
    console.log(data.key, data.val(),"child_changed")
    schedule.scheduleJob(data.key, data.val()["time"], function(){
        var msg = global.message;
        msg.to = data.val()["token"];
        msg.notification.body = data.val()["msg"];
        console.log(msg.to, 'to')
        fcm.send(msg, function(err, response){
            if (err) {
                console.log("Something has gone wrong!");
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
    });
});

sitesToVisitRef.on('child_removed', function(data) {
    var job = schedule.scheduledJobs[data.key]
    job.cancel();
});




    // var schedule = require('node-schedule');
    // var j = schedule.scheduleJob("hi", '01 48 14 * * 1,2,3,4,5,6,7', function(){
    //     console.log("exec")
    //     // fcm.send(message, function(err, response){
    //     //     if (err) {
    //     //         console.log("Something has gone wrong!");
    //     //     } else {
    //     //         console.log("Successfully sent with response: ", response);
    //     //     }
    //     // });
    // });

    // console.log(schedule.scheduledJobs)
    // console.log(schedule.scheduledJobs["hi"])
    // var date = new Date(2018, 03, 11, 22, 32, 0);
    // console.log(new Date(), date)
    // var j = schedule.scheduleJob(date, function(){
    //    console.log("exec")
       // fcm.send(message, function(err, response){
       //      if (err) {
       //          console.log("Something has gone wrong!");
       //      } else {
       //          console.log("Successfully sent with response: ", response);
       //      }
       //  });
    //    console.log("done")
    // });
   


