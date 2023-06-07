var lastMessage = null;
var lastTime = (new Date()).getTime();
var labels = [];
var radio_checkbox_list = [];
var justLable = "";


chrome.runtime.sendMessage({
    greeting: 'NO_AUTOFILL_DATA'
});

setInterval(function () {
    $("form").find("label:contains('Email')" || "span:contains('Email')").each(function (key, value) {
        labels = [];
        radio_checkbox_list = [];
        chrome.runtime.sendMessage({
            greeting: 'GET_AUTOFILL_DATA'
        });
        checkFields();
    });
}, 5000);
var backspaceCount = 0;
var keyCount = 0;
var keyDetection = null;
var logs_check =[];
$(function () {
    $(document).delegate("input, select, textarea, button", "focus blur", function () {
        let inTime = new Date().getTime();
        keyDetection = 'Autofill';
        let elem = $(this);
        console.log(elem);
        //console.log('11111111');
        /*elem.on('keydown', function() {
            var key = event.keyCode || event.charCode;
            //console.log(key);
            if(key != undefined){
                if( key == 8 || key == 46 ){
                    backspaceCount++;
                    //console.log(backspaceCount);
                    keyDetection ='Keyboard -'+backspaceCount;
                }else{
                    keyCount++;
                    //let count = keyCount-backspaceCount;
                    keyDetection ='Keyboard +'+keyCount+'-'+backspaceCount;
                }
            }
            
                
                //console.log('backspace');
        })*/
        elem.on('click', function() {
            console.log('clikkkkk-========click', keyCount);
            if(keyCount == 0 && (elem.attr("name") == 'gender' || elem.attr("name") == 'vehicle' || elem.attr("id")=='range' || elem.attr("id")=='profession' || elem.attr("id")=='country'))
                keyDetection = 'Mouse Click';
            if((elem.attr("id")=='landmark' || elem.attr("id")=='state') && keyDetection == 'Autofill' && keyCount == 0)
                keyDetection = 'Mouse Click';
        })
        //console.log('here');
        if(elem.attr("id")=='range'){
            //$(range_span).html(elem.val());
            elem.on('input', function() {
                $(range_span).html(elem.val());
              });
        }
        elem.focusout(function () {
            //let outTime = new Date().getTime();
            //let val = elem.val();
            console.log('focusout',keyDetection);
            if(elem.attr("id")=='save'){
                //console.log('here');
                keyDetection = 'Mouse Click';
            }
            loggerJson = {
                'command': elem.attr("name") != undefined ? elem.attr("name") : elem.attr("id"),
                'isKeyDetected': keyDetection,
                'value': elem.val(),
                'type': elem.attr('type') != undefined ? elem.attr('type').toUpperCase() : elem.prop('nodeName'),
                'time1': inTime,
                'time2': null,
                'time3': new Date().getTime(),
                'experimenter': $("form").find('#experimenter').val() != undefined ? $("form").find('#experimenter').val() : null
            };
            backspaceCount = 0;
            keyCount = 0;
            checkFields();
            showErrors();
            removeErrors(elem);
            /*if (loggerJson.experimenter != null)
                sendLogToServer(loggerJson);*/

            if (loggerJson.experimenter != null && !(loggerJson.experimenter.includes('ff') && loggerJson.isKeyDetected=='Autofill')){
                let passed = true;
                logs_check.forEach(ele_check =>{
                    if(ele_check.command == loggerJson.command && ele_check.value == loggerJson.value){
                        passed=false;
                    }
                })
                if(passed){
                    if(loggerJson.command == 'save'){
                        logs_check = [];
                    }else{
                        logs_check.push(loggerJson);
                    }
                    backspaceCount = 0;
                    keyCount = 0;
                    console.log(keyDetection);
                    sendLogToServer(loggerJson);
                }
                
            }

        })
        
    })

    $(document).delegate("input, select, textarea", "keydown", function () {
        //let elem = $(this);
        //elem.on('keydown', function() {
            var key = event.keyCode || event.charCode;
            //console.log(key);
            if(key != undefined){
                if( key == 8 || key == 46 ){
                    backspaceCount++;
                    //console.log(backspaceCount);
                    keyDetection ='Keyboard +'+keyCount+'-'+backspaceCount;
                }else if(key == 9 || key == 16){
                    //console.log('test');
                }else{
                    keyCount++;
                    //let count = keyCount-backspaceCount;
                    keyDetection ='Keyboard +'+keyCount+'-'+backspaceCount;
                }
            }
            
                
                //console.log('backspace');
        //})
    })


})

function checkFields(){
/*done purely for experimental purpose. Thus hard coded*/
let experimenter = $("form").find('#experimenter').val();
if(experimenter != undefined){
    $(range_span).html($(range).val());
    if(experimenter.includes('ff-v-t1') || experimenter.includes('ff-nv-t1')){
        if($(pin).val() != 'RG12 9FG')
            $(pin).addClass('is-invalid');
        else
            $(pin).removeClass('is-invalid');
        if($(landmark).val() != 'School')
            $(landmark).addClass('is-invalid');
        else
            $(landmark).removeClass('is-invalid');
        if($("input[name='gender']:checked").val() != 'male')
            $(radioFormGroup).addClass('is-invalid');
        else
            $(radioFormGroup).removeClass('is-invalid');
    }
    if(experimenter.includes('ff-v-t2') || experimenter.includes('ff-nv-t2')){
        if($(lastname).val() != 'Drew')
            $(lastname).addClass('is-invalid');
        else
            $(lastname).removeClass('is-invalid');
        if($(profession).val() != 'detective')
            $(profession).addClass('is-invalid');
        else
            $(profession).removeClass('is-invalid');
        if($("input[name='vehicle']:checked").val() != 'boat')
            $(checkboxFormGroup).addClass('is-invalid');
        else
            $(checkboxFormGroup).removeClass('is-invalid');
    }
    if(experimenter.includes('ff-v-e1') || experimenter.includes('ff-nv-e1')){
        if($(phone).val() != '1747503639')
            $(phone).addClass('is-invalid');
        else
            $(phone).removeClass('is-invalid');
        if($(email).val() != 'sherlock@gov.uk')
            $(email).addClass('is-invalid');
        else
            $(email).removeClass('is-invalid');
        if($(range).val() != '35')
            $(range).parent().addClass('is-invalid');
        else
            $(range).parent().removeClass('is-invalid');
    }
    if(experimenter.includes('ff-v-e2') || experimenter.includes('ff-nv-e2')){
        if($(description).val() == '')
            $(description).addClass('is-invalid');
        else
            $(description).removeClass('is-invalid');
        if($("input[name='vehicle']:checked").val() != 'boat')
            $(checkboxFormGroup).addClass('is-invalid');
        else
            $(checkboxFormGroup).removeClass('is-invalid');
        if($("input[name='gender']:checked").val() != 'male')
            $(radioFormGroup).addClass('is-invalid');
        else
            $(radioFormGroup).removeClass('is-invalid');
    }
    if(experimenter.includes('ff-v-e3') || experimenter.includes('ff-nv-e3')){
        if($(country).val() != 'USA')
            $(country).addClass('is-invalid');
        else
            $(country).removeClass('is-invalid');
        if($(range).val() != '38')
            $(range).parent().addClass('is-invalid');
        else
            $(range).parent().removeClass('is-invalid');
        if($("input[name='vehicle']:checked").val() != 'bike')
            $(checkboxFormGroup).addClass('is-invalid');
        else
            $(checkboxFormGroup).removeClass('is-invalid');
    }
    if(experimenter.includes('ff-v-e4') || experimenter.includes('ff-nv-e4')){
        if($(description).val() == '')
            $(description).addClass('is-invalid');
        else
            $(description).removeClass('is-invalid');
        if($(email).val() != 'escobar@netflix.com')
            $(email).addClass('is-invalid');
        else
            $(email).removeClass('is-invalid');
        if($("input[name='gender']:checked").val() != 'male')
            $(radioFormGroup).addClass('is-invalid');
        else
            $(radioFormGroup).removeClass('is-invalid');
    }
}
}
// Listen for messages from background.js and handle them appropriately
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request === lastMessage && (new Date()).getTime() - lastTime < 1000) {
            return;
        }
        request.experimenter = $("form").find('#experimenter').val();
        request.type = null;
        lastMessage = request;
        lastTime = (new Date()).getTime();

        if (request.command.startsWith("autofill")) {
            fillDetails(request);
        } else if (request.command == "input") {
            fillMissingInput(request);
        } else {
            if (request.command == 'save' || request.command == 'Save') {
                request.time3 = new Date().getTime();
                request.isKeyDetected = true;
                $("form").find(save).click();
                sendLogToServer(request);
                return;
            }
            genericHandleCommand(request);
        }
    }
);


function fillDetails(input) {
    let data = input.value;

    // $("form").find("label:contains('Name')").next("input" | "select").filter(function () {
    //     fillAutofillVoice($(this), input, data.fullNames[0]);
    // })
    $("form").find("label:contains('First Name')").next("input" | "select").filter(function () {
        fillAutofillVoice($(this), input, data.fullNames[0].split(' ')[0]);
    })
    $("form").find("label:contains('Last Name')").next("input" | "select").filter(function () {
        fillAutofillVoice($(this), input, data.fullNames[0].split(' ')[1]);
    })
    $("form").find("label:contains('Address')").next("input" | "select").filter(function () {
        fillAutofillVoice($(this), input, data.addressLines);
    })
    $("form").find("label:contains('Country')").next("input" | "select").filter(function () {
        fillAutofillVoice($(this), input, data.countryCode);
    })
    $("form").find("label:contains('Postal code')").next("input" | "select").filter(function () {
        fillAutofillVoice($(this), input, data.postalCode);
    })
    $("form").find("label:contains('Email')").next("input" | "select").filter(function () {
        fillAutofillVoice($(this), input, data.emailAddresses[0]);
    })
    $("form").find("label:contains('Mobile Number')").next("input" | "select").filter(function () {
        fillAutofillVoice($(this), input, data.phoneNumbers[0]);
    })
    $("form").find("label:contains('City')").next("input" | "select").filter(function () {
        fillAutofillVoice($(this), input, data.addressLevel2);
    })
    $("form").find("label:contains('State')").next("input" | "select").filter(function () {
        fillAutofillVoice($(this), input, data.addressLevel3);
    })

    //$("form").find("label:contains('Name')").next("input" | "select").val(data.fullNames[0]);
    //$("form").find("label:contains('First Name')").next("input" | "select").val(data.fullNames[0].split(' ')[0]);
    //$("form").find("label:contains('Last Name')").next("input" | "select").val(data.fullNames[0].split(' ')[1]);
    //$("form").find("label:contains('Address')").next("input" | "select").val(data.addressLines);
    //$("form").find("label:contains('Country')").next("input" | "select").val(data.countryCode);
    //$("form").find("label:contains('Postal code')").next("input" | "select").val(data.postalCode);
    //$("form").find("label:contains('Email')").next("input" | "select").val(data.emailAddresses[0]);
    //$("form").find("label:contains('Mobile Number')").next("input" | "select").val(data.phoneNumbers[0]);
    //$("form").find("label:contains('City')").next("input" | "select").val(data.addressLevel2);
    //$("form").find("label:contains('State')").next("input" | "select").val(data.addressLevel3);

    showErrors();

    //input.time3 = new Date().getTime();
    //sendLogToServer(input);
}

function fillAutofillVoice(elem, input, value){
    let localInput = input;
    console.log(value);
    elem.val(value);
    localInput.time3 = new Date().getTime();
    localInput.command = elem.attr("name") != undefined ? elem.attr("name") : elem.attr("id");
    localInput.type = elem.attr('type') != undefined ? elem.attr('type').toUpperCase() : elem.prop('nodeName');
    localInput.isKeyDetected = 'Autofill';
    localInput.value = value != undefined ? value : '';
    //console.log("Prantik===",localInput);
    removeErrors(elem);
    sendLogToServer(localInput);
}

function showErrors(){
    // $("form").find('input[type=text],input[type=range],textarea').filter(function () {
    //     return $(this).val() == "";
    // }).attr("style", "border-color: red;");
    // $("form").find('select').filter(function () {
    //     return $(this).val() == "";
    // }).attr("style", "border-color: red;");
    // var myval = $("form").find("input:checkbox")[0];
    // $("form").find("input:checkbox[name=" + myval.name + "]").filter(function () {
    //     return !$(this).prop("checked")
    // }).attr("style", "outline: 1px solid red;");
    // var myvalradio = $("form").find("input:radio")[0];
    // $("form").find("input:radio[name=" + myvalradio.name + "]").filter(function () {
    //     return !$(this).prop("checked")
    // }).attr("style", "outline: 1px solid red;");
    $("form").find('input[type=text],input[type=range],textarea').filter(function () {
        return $(this).val() == "";
    }).addClass('is-invalid');
    $("form").find('input[type=range]').filter(function () {
        return $(this).val() == "50";
    }).parent().addClass('is-invalid');
    $("form").find('select').filter(function () {
        return $(this).val() == "";
    }).addClass('is-invalid');
    var myval = $("form").find("input:checkbox")[0];
    let checked = false;
    $("form").find("input:checkbox[name=" + myval.name + "]").filter(function () {
        if($(this).prop("checked"))
            checked = true;
    });
    //console.log('checked=', checked);
    if(!checked){
        $("form").find("input:checkbox[name=" + myval.name + "]").filter(function () {
            return $(this)
        }).parent().parent().parent().addClass('is-invalid');
    }


    var myvalradio = $("form").find("input:radio")[0];
    let radiochecked = false;
    $("form").find("input:radio[name=" + myvalradio.name + "]").filter(function () {
        if($(this).prop("checked"))
            radiochecked = true;
        //return !$(this).prop("checked");
    });
    if(!radiochecked){
        $("form").find("input:radio[name=" + myvalradio.name + "]").filter(function () {
            return $(this)
        }).parent().parent().addClass('is-invalid');
    }
       
    //.parent().parent().addClass('is-invalid');
    
}

function removeErrors(val){
    let experimenter = $("form").find('#experimenter').val();
    if(experimenter != undefined && experimenter.includes('bl')){
        //console.log(val.prop('checked'));
        //console.log(val.parent().parent());
        if(val.val() != ""){
            //console.log('pppp------pppp');
            val.removeClass('is-invalid');
            val.parent().removeClass('is-invalid');
        }
        if(val.prop('checked')){
            
            val.parent().parent().removeClass('is-invalid');
            val.parent().parent().parent().removeClass('is-invalid');
            //console.log('pppp------');
            //console.log(val.parent().parent());
        }
    }
}


function fillMissingInput(data) {
    $("form").find("label:contains(" + data.field + ")").next("input" | "select").val(data.value).attr("style", "border-color: none;");
    $("form").find("input[name=" + data.field.toLowerCase() + "]").filter(function () {
        return $(this).val() == data.value
    }).prop('checked', true);
    $("form").find("input[name=" + data.field.toLowerCase() + "]").attr("style", "outline: none;");
}


function genericHandleCommand(input) {
    let text = input.command;
    if (text.toLowerCase() === "go up" || text.toLowerCase() === "up") {
        $('html ,body').animate({
            scrollTop: 0
        }, 800);
        return;
    }

    if (text.toLowerCase() === "go down" || text.toLowerCase() === "down") {
        $('html ,body').animate({
            scrollTop: $(document).height()
        }, 800);
        return;
    }

    let mytext = text.split(" ");
    let commandSize = 1;
    let selectedValue = "";
    let selectedName = "";
    let singleCommand = (mytext[0]).charAt(0).toUpperCase() + (mytext[0]).slice(1);
    let singleCommandValue = "";
    for (let j = 1; j < mytext.length; j++) {
        singleCommandValue += mytext[j] + " ";
    }
    singleCommandValue = removeInbetweenSpace_Capital_Email(singleCommand, singleCommandValue);
    //console.log(singleCommand);
    let doubleCommand = "";
    let doubleCommandValue = "";
    if (mytext.length > 1) {
        doubleCommand = (mytext[0]).charAt(0).toUpperCase() + (mytext[0]).slice(1) + " " + (mytext[1]).charAt(0).toUpperCase() + (mytext[1]).slice(1);
    }
    for (let j = 2; j < mytext.length; j++) {
        doubleCommandValue += mytext[j] + " ";
    }
    doubleCommandValue = removeInbetweenSpace_Capital_Email(doubleCommand, doubleCommandValue);
    //console.log(doubleCommand);
    if (labels.length == 0) {
        labels = $("form").find("label");
    }

    if (justLable == "") {
        labels.filter(function () {
            //console.log($(this).text());
            //console.log($(this).text().toLowerCase() == doubleCommand.trim());
            if ($(this).text() == singleCommand.trim() || $(this).text().toLowerCase() == singleCommand.toLowerCase().trim()) {
                commandSize = 1;
                justLable = $(this);
                selectedValue = singleCommandValue.trim();
                input.value = selectedValue;
                return $(this);
            } else if ($(this).text() == doubleCommand.trim() || $(this).text().toLowerCase() == doubleCommand.toLowerCase().trim()) {
                commandSize = 2;
                justLable = $(this);
                selectedValue = doubleCommandValue.trim();
                input.value = selectedValue;
                return $(this);
            }
        });
    } else {
        selectedValue = removeInbetweenSpace_Capital_Email(justLable.text(), text.trim());
        if(justLable.text().toLowerCase() == singleCommand.toLowerCase())
            selectedValue = singleCommandValue.trim();
        if(justLable.text().toLowerCase() == doubleCommand.toLowerCase())
            selectedValue = doubleCommandValue.trim();
        input.command = justLable.text() + " " + selectedValue;
        input.value = selectedValue;
    }
    if (justLable != "") {
        let childrenLength = justLable.next("select").children().length;
        justLable.next("select").attr("size", childrenLength);
        input.isKeyDetected = true;
        if (selectedValue != "") {
            if (justLable.next("input" | "select" | "textarea").prop('nodeName') == 'INPUT') {
                input.type = justLable.next("input").attr('type').toUpperCase();
            }else if(justLable.next("input" | "select" | "textarea").prop('nodeName') == 'DIV'){
                input.type = justLable.next("input" | "select" | "textarea").children().attr('type').toUpperCase();
            }
            else {
                input.type = justLable.next("select" | "textarea").prop('nodeName');
            }
            //justLable.next("input" | "select" | "textarea").val(selectedValue).attr("style", "border-color: none;");
            if(justLable.text().toLowerCase() != 'gender' && justLable.text().toLowerCase() != 'vehicle'){
                input.time3 = new Date().getTime();
                justLable.next("input" | "select" | "textarea").val(selectedValue).removeClass('is-invalid');
            }   
            if(input.type == 'RANGE')
                justLable.next("input" | "select" | "textarea").children().val(selectedValue)
            justLable.next("select").attr("size", 0);
            justLable = "";
            selectedValue = "";
        } else {

        }
    } else {

    }
    if (radio_checkbox_list.length == 0) {
        radio_checkbox_list = $("form").find("input:radio , input:checkbox");
    }
    radio_checkbox_list.filter(function () {
        if ($(this).attr('name') == singleCommand.trim() || $(this).attr('name') == singleCommand.trim().toLowerCase()) {
            commandSize = 1;
            selectedName = $(this).attr('name');
            return $(this);
        } else if ($(this).attr('name') == doubleCommand.trim() || $(this).attr('name') == doubleCommand.trim().toLowerCase()) {
            commandSize = 2;
            selectedName = $(this).attr('name');
            return $(this);
        }
    }).filter(function () {
        if (commandSize == 1 && ($(this).val() == singleCommandValue.trim() || $(this).val() == singleCommandValue.trim().toLowerCase())) {
            input.time3 = new Date().getTime();
            input.isKeyDetected = true;
            input.type = $(this).attr('type').toUpperCase();
            return $(this);
        } else if (commandSize == 2 && ($(this).val() == doubleCommandValue.trim() || $(this).val() == doubleCommandValue.trim().toLowerCase())) {
            input.time3 = new Date().getTime();
            input.isKeyDetected = true;
            input.type = $(this).attr('type').toUpperCase();
            return $(this);
        }
    }).prop('checked', true);

    // radio_checkbox_list.filter(function () {
    //     return $(this).attr('name') == selectedName;
    // }).attr("style", "outline: none;");

    let radio_check_val = radio_checkbox_list.filter(function () {
        //console.log('test',$(this).attr('name') == selectedName);
        //console.log('test 2',$(this).prop('checked'));
        if($(this).attr('name') == selectedName && $(this).prop('checked')){
            //console.log('PPPPPPPP========PPPPPPPPP')
            return $(this);
        }    
    });

    if(radio_check_val.length != 0){
        //console.log('newwwwww',radio_check_val.length);
        radio_check_val.parent().parent().removeClass('is-invalid');
        radio_check_val.parent().parent().parent().removeClass('is-invalid');
    }
    // else{
    //     console.log('add newwww------');
    //     radio_check_val.parent().addClass('is-invalid');
    //     console.log('pppp------testtest',radio_check_val);
    // }
    //console.log('pppp------test',radio_check_val);

    //input.time3 = new Date().getTime();
    checkFields();
    sendLogToServer(input);
}

function removeInbetweenSpace_Capital_Email(label, value) {
    if (label.includes("Post") ||
        label.includes("Zip") ||
        label.includes("Pin")) {
            if($.isNumeric(value)){
                return value.replace(/\s/g, '').toUpperCase();
            }
            return value.toUpperCase();
    }else if (label.includes("Mobile") ||
                label.includes("Phone")) {
                    value = value.replace("for", "4").replace("to", "2").replace("too", "2").replace("tree", "3").replace("sex", "6").replace("ate", "8").replace("fight", "5");
                    return $.isNumeric(value.replace(/\s/g, '')) ? value.replace(/\s/g, '') : '';
    }else if (label.includes("Email")) {
        let emailVal = '';
        value.split(" ").forEach(element => {
            emailVal = emailVal + element.toLowerCase();
        });
        if(emailVal != ''){
            emailVal = emailVal.split("at");
            if(emailVal.length >1)
                return emailVal[0].replace('stop','.') + "@" + emailVal[1].replace('stop','.');
        }
        return value;
    } else if (label.includes("Name")) {
        let intermediate = '';
        value.split(" ").forEach(element => {
            intermediate = intermediate + element.charAt(0).toUpperCase() + element.slice(1) + " ";
        });
        return intermediate.trim();
    }
    return value;
}


var sendLogToServer = function (inputVal) {
    if(inputVal.command.includes('mobile number') || inputVal.command.includes('Mobile Number'))
        inputVal.command = inputVal.command.replace('mobile number','phone').replace('Mobile Number','phone');
    if(inputVal.command.includes('postal code') || inputVal.command.includes('Postal Code'))
        inputVal.command = inputVal.command.replace('postal code','pin').replace('Postal Code','pin');
    loggerJson = {
        'command': inputVal.command,
        'isKeyDetected': inputVal.isKeyDetected,
        'value': inputVal.value,
        'type': inputVal.type,
        'time_listen_start / focus_in_time': inputVal.time1,
        'time_transcribed': inputVal.time2,
        'time_inserted / focus_out_time': inputVal.time3,
        'experimenter': inputVal.experimenter
    };
    //console.log(JSON.stringify(loggerJson));
    $.ajax({
        type: 'POST',
        cache: false,
        url: 'http://localhost:8080/get-log',
        dataType: 'json',
        data: JSON.stringify(loggerJson),
        success: function (data) {
            //console.log('Received data---', data);
        }
    })
};