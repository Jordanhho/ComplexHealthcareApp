

$(document).ready(function() {

    

    $("#start_button").on("click", function(event) {
        startButton(event);
    });

    /** google web speech api  */
    var langs = ['English', ['en-CA', 'Canada']];
    var final_transcript = '';
    var recognizing = false;
    var ignore_onend;
    var start_timestamp;

   //* Google Web Speech API */
   if (!('webkitSpeechRecognition' in window)) {
     upgrade();
   } else {
     start_button.style.display = 'inline-block';
     var recognition = new webkitSpeechRecognition();
     recognition.continuous = true;
     recognition.interimResults = true;
   
     recognition.onstart = function() {
       recognizing = true;
       showInfo('info_speak_now');
     };
   
     recognition.onerror = function(event) {
       if (event.error == 'no-speech') {
         showInfo('info_no_speech');
         ignore_onend = true;
       }
       if (event.error == 'audio-capture') {
         showInfo('info_no_microphone');
         ignore_onend = true;
       }
       if (event.error == 'not-allowed') {
         if (event.timeStamp - start_timestamp < 100) {
           showInfo('info_blocked');
         } else {
           showInfo('info_denied');
         }
         ignore_onend = true;
       }
     };
   
     recognition.onend = function() {
       recognizing = false;
       if (ignore_onend) {
         return;
       }
       if (!final_transcript) {
         showInfo('info_start');
         return;
       }
       showInfo('');
       if (window.getSelection) {
         window.getSelection().removeAllRanges();
         var range = document.createRange();
         range.selectNode(document.getElementById('final_span'));
         window.getSelection().addRange(range);
       }
     };
   
     recognition.onresult = function(event) {
       var interim_transcript = '';
       for (var i = event.resultIndex; i < event.results.length; ++i) {
         if (event.results[i].isFinal) {
           final_transcript += event.results[i][0].transcript;
         } else {
           interim_transcript += event.results[i][0].transcript;
         }
       }
       final_transcript = capitalize(final_transcript);
       final_span.innerHTML = linebreak(final_transcript);
       final_span.innerHTML = linebreak(interim_transcript);
       //interim_span.innerHTML = linebreak(interim_transcript);
     };
   }
   
   function upgrade() {
     start_button.style.visibility = 'hidden';
     showInfo('info_upgrade');
   }
   
   var two_line = /\n\n/g;
   var one_line = /\n/g;
   function linebreak(s) {
     return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
   }
   
   var first_char = /\S/;
   function capitalize(s) {
     return s.replace(first_char, function(m) { return m.toUpperCase(); });
   }
   
   
   function startButton(event) {
        if (recognizing) {
          recognition.stop();
          console.log("stopped");
        return;
        }
        //final_transcript = '';
        // recognition.lang = select_dialect.value;
        recognition.start();
        //ignore_onend = false;
        //final_span.innerHTML = '';
        // interim_span.innerHTML = '';
        //showInfo('info_allow');
        // showButtons('none');
        start_timestamp = event.timeStamp;
    }
    
   function showInfo(s) {
     if (s) {
       for (var child = info.firstChild; child; child = child.nextSibling) {
         if (child.style) {
           child.style.display = child.id == s ? 'inline' : 'none';
         }
       }
       info.style.visibility = 'visible';
     } else {
       info.style.visibility = 'hidden';
     }
   }


   /* own code */


   var chat_bot_msges = {
    "chat_bot":[
        {"hello": "Hello X person msg"}, 
        {"diabetes": "diabetes msg"},
        {"mental health": "mental health msg template"}
    ]
  }

   var chat_msg_index = 0;
   var bot_init = 0;



   //init chat
   addChat("bot_chat_template");

   //hello, diabites, mental health test examples

   $("#send_msg").on("click", function() {

     //add user chat
      addChat("user_chat_template");

      setTimeout(function() {
        //add bot chat
        addChat("bot_chat_template");
      }, 200);
   });


   
   function findKeywordFromStr(msg) {
    //if keyword matches mental health

    //if keyword matches diabetes

    //if it matches hello/hi
   }



  //bot_chat_template_
   function addChat(type_id) {

      //curr chat log
      var chat_log = $("#chat_log");

      var new_chat_box_id = "#" + type_id + "_" + chat_msg_index;

      var new_chat_box = $('#' + type_id ).clone();

      new_chat_box.attr("id", new_chat_box_id);

      //curr textarea value:
      var curr_msg = $.trim($("#final_span").val());

      //set chat value depending on user or bot
      if(type_id == "user_chat_template") {

        new_chat_box.find(".msg").text(curr_msg);
      }
      else {
        var bot_msg = "";
        //if init
        if(bot_init == 0) {
          bot_msg = chat_bot_msges.chat_bot[0]["hello"];
          bot_init = 1;
        }
        //search in key words for the text
        else {

            //loop through all bot msg types
            $.each(chat_bot_msges.chat_bot, function(bot_msg_i, bot_msg_val) {
              var bot_key = Object.keys(bot_msg_val)[0];
              if(curr_msg.includes(bot_key.toLowerCase())) {
                bot_msg = bot_msg_val[bot_key];
                return false;
              }
            });
          
        }
        new_chat_box.find(".msg").text(bot_msg);
      }
      
      new_chat_box.appendTo(chat_log).show("slow");

      chat_msg_index++;

      //empty out prevous chat
      final_span.innerHTML = '';
   }

});

