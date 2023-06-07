var DEV_MODE = true;
var inputWindowId = null;
var parentWindowId = null;
var timeOfLastRequest = 0;
var dictationMode = false;
var lastMessage = null;
var inputWindowURL = 'input.html'
var keepShowing = false;
var pointerUrlArr = null;
var dataFromServer = null;
var loggerJson = {};
var sendLogger = null;

var addLastInputToPreviousInputsDisplay = function (input) {
    if (typeof input === 'object') {
        $('#previousInputsDisplay').prepend('<div> <pre>' + JSON.stringify(input) + '</pre></div>');
        return
    }
    $('#previousInputsDisplay').prepend('<div>' + input + '</div>');
};

$(function () {

    var commandAliases = {};
    var timeoutDuration = 180000;

    // dev id, different for every developer since it's randomly assigned by Chrome when loaded locally
    const extensionId = 'hjlgjkkmkialmidaegffkkflmoglkkpp';

    // prod id -- replaces above value for production releases
    // const extensionId = 'ddgmnkioeodkdacpjblmihodjgmebnld';

    chrome.runtime.sendMessage(extensionId, {
            getAliases: true
        },
        function (response) {
            if (response == undefined) {
                return;
            }
            commandAliases = response.commandAliases;
        });

    chrome.runtime.sendMessage(extensionId, {
            getTimeoutDuration: true
        },
        function (response) {
            if (response === undefined) {
                return;
            }
            timeoutDuration = response.timeoutDuration;
        });

    var dictationMode = false;
    $('#dictationEnable').click(function () {
        console.log('dictation mode enabled in input.js');
        dictationMode = true;
    });

    $('#dictationDisable').click(function () {
        console.log('dictation mode disabled in input.js');
        dictationMode = false;
    });

    var suggestedCommands = [
        'autofill',
        'otterfield',
        'autofield',
        'waterfall',
        'waterfield',
        'the film',
        'what is a',
        'how to fill',
        'how to kill',
        'howtokill',
        'howtofill',
        'how to film',
        'Otto kill',
        'Otto film',
        'Otto Farrant',
        'auto Saint',
        'article',
        'auto field',
        'Otto field',
        'auto feed',
        'auto film',
        'auto sell',
        'autocyl',
        'autofull',
        'Otto full',
        'auto full'
    ];
    var suggestedFillCommands = [
        'input',
        'import',
        'select'
    ];
    var suggestedSaveCommands = [
        'sieve',
        'sing',
        'saved',
        'send',
        'SIM',
        'sim',
        'same',
        'skip',
        'say',
        'Siri'
    ];
    var suggestedStateCommands = [
        'Steve',
        'stay',
        'stake',
        'steak',
        'speak',
        'stick',
        'sta'
    ];
    var suggestedDescriptionCommands = [
        'discussion'
    ];
    var suggestedAgeCommands = [
        '8'
    ];
    var suggestedLandmarkCommands = [
        'landmarks'
    ];
    var suggestedVehicleCommands = [
        'beagle',
        'vegan',
        'Regal',
        'regal',
        'eagle',
        'legal',
        'Eagle',
        'wiggle',
        'pinnacle',
        'cehegin',
        'mohican',
        'vaikal',
        'nickel'
    ];
    var suggestedProfessionCommands = [
        'revision',
        'profusion',
        'operation',
        'probation',
        'northeastern',
        'refreshing',
        'division',
        'revision',
        'location',
        'brockington',
        'provision',
        'proficient',
        'reflection',
        'prohibition',
        'professional'

    ];
    
    

    // handelig connection to background.js
    let port = chrome.extension.connect({
        name: 'connection'
    })
    // sends spoken command to extension's background script (background.js), which sends it to
    // the active tab, where it is executed by an injected content script (control.js)
    var sendCommand = function (command) {
        document.title = command;
        port.postMessage(command);
    };

    // handles spoken input, verifying validity before sending it to the extension
    var receiveInput = function (input) {
        if (dictationMode) {
            sendCommand(input.trim());

        } else {
            let output = input.trim();
            suggestedCommands.filter(a =>{
                if(output.includes(a)){
                    //console.log('EUREKA');
                    //console.log(output.replace(a,'autofill'));
                    output = output.replace(a,'autofill');
                }    
            })
            let myText = "";
            let finalString = "";
            let value = "";
            let sub_value = "";
            let arr_output = output.split(' ');
            let command = (arr_output[0]).trim().toLowerCase();
            //console.log('Prantik');
            //console.log(command);
            
            if (command == "autofill") {
                let ofIndex = arr_output.indexOf("of");
                if (ofIndex == -1) {
                    ofIndex = arr_output.length;
                }
                for (let j = 1; j < ofIndex; j++) {
                    myText += arr_output[j].trim() + " ";
                }
                for (let j = ofIndex + 1; j < arr_output.length; j++) {
                    sub_value += arr_output[j].trim() + " ";
                }
                if (sub_value != "") {
                    finalString = "autofill " + myText.trim() + " of " + sub_value.trim();
                } else {
                    finalString = "autofill " + myText.trim();
                }
                addLastInputToPreviousInputsDisplay(finalString);
            } else if (suggestedFillCommands.includes(command)) {
                let valueIndex = arr_output.indexOf("value");
                if (valueIndex == -1) {
                    return;
                }
                for (let j = 1; j < valueIndex; j++) {
                    myText += arr_output[j].trim() + " ";
                }
                for (let j = valueIndex + 1; j < arr_output.length; j++) {
                    value += arr_output[j].trim() + " ";
                }

                finalString = "input " + myText.trim() + " value " + value.trim();
                addLastInputToPreviousInputsDisplay(finalString);
            } else {
                if(suggestedSaveCommands.includes(command))
                    output = output.replace(command,'save');
                if(suggestedVehicleCommands.includes(command))
                    output = output.replace(command,'vehicle');
                if(suggestedProfessionCommands.includes(command))
                    output = output.replace(command,'profession');
                if(suggestedStateCommands.includes(command))
                    output = output.replace(command,'state');
                if(suggestedDescriptionCommands.includes(command))
                    output = output.replace(command,'description');
                if(suggestedAgeCommands.includes(command))
                    output = output.replace(command,'age');
                if(suggestedLandmarkCommands.includes(command))
                    output = output.replace(command,'landmark');
                finalString = output;
                if (interimLebel != "") {
                    if (output.trim() == "") {
                        return;
                    }
                    finalString = interimLebel + " " + output.replace(/\s/g, '');
                    interimLebel = "";
                }
                addLastInputToPreviousInputsDisplay(finalString);
            }

            if (finalString.trim() == "") {
                return;
            }
            createLoogger(finalString.trim(), sendLogger.isKeyDetected, sendLogger.value, sendLogger.time1, sendLogger.time2, sendLogger.time3);
            sendCommand(sendLogger);
            sendLogger = null;
            start();
        }
    };

    var lastStartedAt = 0;
    var lastInputAt = new Date().getTime();
    var interimLebel = "";
    var isSpellMode = false;
    var interimSpell = "";


    // starts up and maintains the WebSpeech speech recognition engine, dispatches its output to receiveInput
    var start = function () {
        if ('webkitSpeechRecognition' in window) {
            /* var SpeechRecognition = (
                 window.SpeechRecognition ||
                 window.webkitSpeechRecognition
               );*/

            // Create a new recognizer
            var recognition = new webkitSpeechRecognition();
            //var recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';
            //recognition.lang = 'en-IN';


            recognition.onstart = function () {
                recognizing = true;
                lastStartedAt = new Date().getTime();
            };

            recognition.onsoundstart = function () {
                if (sendLogger == null)
                    createLoogger(null, false, null, new Date().getTime(), null, null);
            }

            recognition.onerror = function (event) {
                if (event.error === 'no-speech') {
                    console.log('no speech');
                }
                if (event.error === 'audio-capture') {
                    console.log('audio capture');
                }
                if (event.error === 'not-allowed') {
                    console.log('not allowed');
                }
            };

            recognition.onend = function () {
                recognizing = false;
                var timeSinceLastStart = new Date().getTime() - lastStartedAt;
                if (timeSinceLastStart < 1000) {
                    console.log('setting timeout');
                    setTimeout(recognition.start, 1000 - timeSinceLastStart);
                } else if (new Date().getTime() - lastInputAt < timeoutDuration) {
                    recognition.start();
                } else {
                    alert('No speech detected  for ' + timeoutDuration / 60000 +
                        ' minutes, turning off. Refresh input window to reactivate.')
                }
            };

            recognition.onresult = function (event) {
                lastInputAt = new Date().getTime();
                var interimTranscript = '';

                if (event.results === undefined) {
                    console.log('event.results === undefined');
                    recognition.onend = null;
                    recognition.stop();
                    alert('results were undefined');
                    return;
                }

                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (isSpellMode) {
                        recognition.lang = '';
                        if (interimTranscript == '' && interimSpell != '') {
                            interimTranscript = interimSpell;
                        }

                        if (event.results[i][0].transcript.includes("finish")) {
                            isSpellMode = false;
                            let val = interimSpell;
                            interimSpell = "";
                            interimTranscript = '';
                            event.results[i][0].transcript = "";
                            document.getElementById('interimDisplay').innerHTML = '';
                            receiveInput(val);
                            continue;
                        } else if (event.results[i][0].transcript.includes("clear")) {
                            interimSpell = '';
                            interimTranscript = '';
                            event.results[i][0].transcript = "";
                            document.getElementById('interimDisplay').innerHTML = '';
                            continue;
                        } else {

                            if (event.results[i].isFinal) {
                                interimSpell = event.results[i][0].transcript.trim();
                            }
                        }
                    }

                    if (event.results[i].isFinal && !isSpellMode) {
                        addLastInputToPreviousInputsDisplay(event.results[i][0].transcript);
                        addLastInputToPreviousInputsDisplay("Speech receive at-" + new Date().getTime());
                        createLoogger(sendLogger.command, sendLogger.isKeyDetected, sendLogger.value, sendLogger.time1, new Date().getTime(), sendLogger.time3);
                        if (event.results[i][0].transcript.includes("Spell") || event.results[i][0].transcript.includes("spell")) {
                            isSpellMode = true;
                            interimLebel = "";
                            interimLebel = event.results[i][0].transcript.toLowerCase().split("spell")[1].trim();
                            addLastInputToPreviousInputsDisplay("Spell mode on for : " + interimLebel);
                        } else {
                            receiveInput(event.results[i][0].transcript);
                        }
                    } else {
                        interimTranscript += event.results[i][0].transcript;

                    }
                }

                if (interimTranscript !== '') {
                    document.getElementById('interimDisplay').innerHTML = interimTranscript;
                } else {
                    document.getElementById('interimDisplay').innerHTML = '<br>';
                }
            }

            recognition.start();
        }
    };


    var createLoogger = function (command, keydetected, value, time1, time2, time3) {
        loggerJson = {
            'command': command,
            'isKeyDetected': keydetected,
            'value': value,
            'time1': time1,
            'time2': time2,
            'time3': time3
        };
        sendLogger = loggerJson;
    }
    start();
});

// Listen for messages from control.js -- used to activate dictation mode
// when control.js detects that it has been asked to click on a form input.
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.greeting === 'AUTOFILL_SAMENAME_DATA') {
            for (var i = 0; i < request.names.length; i++) {
                addLastInputToPreviousInputsDisplay((i + 1) + " : " + request.names[i]);
            }
        }

    }
);