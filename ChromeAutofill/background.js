var DEV_MODE = true;
var inputWindowId = null;
var inputWindowURL = 'input.html';
var dictationMode = false;
var lastMessage = null;
var timeOfLastRequest = 0;
var parentWindowId = null;
var currentTabId = null;



// Open input.html in a separate window by default.
// Users can adjust options so that it opens in a separate tab instead.
var openInputWindow = function () {
    chrome.storage.sync.get({
        'openInTab': false
    }, function (items) {
        if (items.openInTab) {
            chrome.tabs.create({
                    'url': inputWindowURL,
                },
                function (window) {
                    inputWindowId = window.id;
                }
            );
        } else {
            chrome.windows.create({
                    'url': inputWindowURL,
                    'height': 300,
                    'width': 400,
                    'left': screen.width - 400,
                    'top': -10
                },
                function (window) {
                    inputWindowId = window.id;
                });
        }
    });
};

// Add click handler to extension icon.
//chrome.browserAction.onClicked.addListener(openInputWindow);

chrome.extension.onConnect.addListener(port => {
    console.log('connected....')
    port.onMessage.addListener(msg => {
        console.log('message received ' + JSON.stringify(msg))
        if (msg !== 'Hi Background') {
            if (dictationMode) {
                console.log('called as dictation: ' + msg);
                executeMessage(msg, true);
            } else {
                console.log('called as command: ' + msg);
                executeMessage(msg, false);
            }
        } else {

            chrome.tabs.query({
                active: true,
                windowId: window.id
            }, function (arrayOfOneTab) {
                var tab = arrayOfOneTab[0];
                parentWindowId = tab.windowId;
                port.postMessage(tab.url);
            });
        }

    })
});

// Also does a lot of checking to prevent command doubling.
var executeMessage = function (message, isDictationMessage) {
    if (lastMessage && lastMessage.startsWith('keep') && lastMessage.endsWith(message.command)) {
        return;
    }

    // the webSpeech engine very frequently sends 'newtown' then immediately corrects it to 'new tab'
    // we would be better off making a lastMessageIsMisheard() function to make this generic instead of specific
    if (lastMessage === 'newtown' && message.command === 'new tab' && (new Date()).getTime() - timeOfLastRequest < 1000) {
        return;
    }

    // don't double execute commands that are sent twice by mistake
    if (!parseInt(message.command) && message.command === lastMessage && (new Date()).getTime() - timeOfLastRequest < 1000) {
        console.log('noticed time');
        return;
    }

    lastMessage = message.command;

    if (!isDictationMessage && !message.command.startsWith('go to')) {
        timeOfLastRequest = (new Date()).getTime();
    }

    if (!isDictationMessage) {
        console.log('executing: ' + message.command);
        if (message.command.startsWith('go to')) {
            let sitename = message.command.replace('go to ', '');
            openInNewTab(goTo(sitename));
            return;
        }
        if (message.command.startsWith('fill for')) {
            let name = message.command.replace('fill for ', '');
            sendCommandToControlScript(name);
            return;
        }
        if (message.command === 'done' || message.command === 'Don' || message.command === 'Dunn') {
            chrome.windows.remove(inputWindowId);
            // hide help when extension is closed
            sendCommandToControlScript('hidehelp');
            return;
        }
        if (message.command.startsWith("autofill") || message.command.startsWith("input")) {
            sendCommandToControlScript(message);
            return;
        }

        // handles execution of message
        chrome.windows.getAll({
            populate: true
        }, function (windows) {
            windows.forEach(function (window) {
                if (message === 'quit' || message === 'exit') {
                    chrome.windows.remove(window.id);
                    return;
                }

                // Don't let any other commands reach the input window's content script (control.js)
                if (window.tabs[0].url === inputWindowURL) {
                    return;
                }

                // toggle mute on active tab
                if (message === 'silence' || message === 'silent') {
                    var activeId = null;
                    chrome.tabs.query({
                            windowId: window.id
                        },
                        function (allTabs) {
                            allTabs.forEach(function (tab) {
                                if (tab.active) {
                                    chrome.tabs.update(tab.id, {
                                        muted: !tab.mutedInfo.muted
                                    });
                                }
                            });
                        }
                    );
                }

                if (message === 'full screen') {
                    if (window.state !== 'fullscreen') {
                        chrome.windows.update(window.id, {
                            state: 'fullscreen'
                        });
                    } else if (window.state === 'fullscreen') {
                        chrome.windows.update(window.id, {
                            state: 'maximized'
                        });
                    }
                    return;
                }
                if (message === 'minimize') {
                    if (window.state !== 'minimized') {
                        chrome.windows.update(window.id, {
                            state: 'minimized'
                        });
                    } else {
                        chrome.windows.update(window.id, {
                            state: 'maximized'
                        });
                    }
                    return;
                }
                if (message === 'maximize') {
                    chrome.windows.update(window.id, {
                        state: 'maximized'
                    });
                }
                if (message === 'new tab' || message === 'newtown') {
                    chrome.tabs.create({
                        windowId: window.id
                    });
                    return;
                }
                if (message === 'switch') {
                    var now = false;
                    chrome.tabs.query({
                            windowId: window.id
                        },
                        // find current active tab and switch to the next one
                        function (allTabs) {
                            for (var i = 0; i < allTabs.length; i++) {
                                if (now) {
                                    chrome.tabs.update(allTabs[i].id, {
                                        active: true
                                    });
                                    break;
                                }
                                if (allTabs[i].active) {
                                    now = true;
                                    if (i == allTabs.length - 1) {
                                        chrome.tabs.update(allTabs[0].id, {
                                            active: true
                                        });
                                        break;
                                    }
                                }
                            }
                        }
                    );
                }

                sendCommandToControlScript(message);
            });
        });
    } else {
        // send dictation command to active tab of window
        chrome.windows.getAll({
            populate: true
        }, function (windows) {
            windows.forEach(function (window) {
                // but don't send dictation to input.html
                if (window.tabs[0].url === inputWindowURL) {
                    return;
                }
                chrome.tabs.query({
                    active: true,
                    windowId: window.id
                }, function (arrayOfOneTab) {
                    var tab = arrayOfOneTab[0];
                    chrome.tabs.sendMessage(tab.id, message);
                });
            });
        });
    }
};

function openInNewTab(url) {
    chrome.tabs.create({
        windowId: parentWindowId,
        url: url,
        active: true
    });
}

var goTo = function (destination) {
    if (destination === 'undefined') {
        // sometimes webspeech sends 'go to undefined' before fully registering the input
        // so we check for those incomplete messages here and ignore them
        return;
    }
    var myUrl;
    if (destination.includes('chrome://')) {
        return destination;
    }
    if (destination.includes(':4200')) {
        return destination;
    }
    if (!destination.includes('.com') && !destination.includes('.edu') &&
        !destination.includes('.gov') && !destination.includes('.org') && !destination.includes('.de')) {
        if (destination.endsWith('.')) {
            destination = destination.slice(0, -1);
        }
        destination += '.com';
        myUrl = 'http://www.' + destination;
    } else {
        myUrl = destination;
    }
    // sigh
    if (destination === 'readit.com' || destination === 'read.com') {
        destination = 'reddit.com';
        myUrl = 'http://www.' + destination;
    }

    return myUrl;
};

// send a command to the browser; also handles the "close tab" command
var sendCommandToControlScript = function (message) {
    console.log('here--:' + message.command);
    chrome.tabs.query({
        active: true,
        windowId: window.id
    }, function (arrayOfOneTab) {
        var tab = arrayOfOneTab[0];
        var id = tab.id;
        console.log('here--currenttabid:' + currentTabId);
        if (message.command === 'close tab' || message.command === 'close time') {
            chrome.tabs.remove(id);
            return;
        }
        // if we've gotten here, it's a non-dictation DOM-level
        // command, so send it to control.js.
        //chrome.tabs.sendMessage(currentTabId, message);

        if (message.command.startsWith("input")) {
            let inputVal = message.command.split(" ");
            let valueIndex = inputVal.indexOf("value");
            let field = '';
            let value = '';
            if (valueIndex == -1) {
                valueIndex = inputVal.length;
            }
            for (let j = 1; j < valueIndex; j++) {
                field += (inputVal[j]).charAt(0).toUpperCase() + (inputVal[j]).slice(1) + " ";
            }
            if (field.trim() == "") {
                return;
            }
            for (let j = valueIndex + 1; j < inputVal.length; j++) {
                value += inputVal[j] + " ";
            }
            let inputdata = {
                "command": "input",
                "field": field.trim(),
                "value": value.trim()
            }
            console.log(inputdata);
            chrome.tabs.sendMessage(currentTabId, inputdata);
        } else if (message.command.startsWith("autofill")) {
            let inputVal = message.command.split(" ");
            let value = "";
            let sub_value = "";
            let ofIndex = inputVal.indexOf("of");
            if (ofIndex == -1) {
                ofIndex = inputVal.length;
            }

            for (let j = 1; j < ofIndex; j++) {
                value += inputVal[j].toLowerCase() + " ";
            }
            for (let j = ofIndex + 1; j < inputVal.length; j++) {
                sub_value += inputVal[j].toLowerCase() + " ";
            }

            readTextFile("autofillList.json", function (text) {
                var data = JSON.parse(text);
                let nameList = [];
                let autofilldata;
                for (var i = 0; i < data.length; i++) {
                    //change metadata.namepronounciation to summaryLabel if need to compare with correctly pronounced full name
                    if (data[i].metadata.namepronounciation.includes(value.trim())) {
                        autofilldata = {
                            "command": message.command,
                            "value": data[i]
                        }
                        //change metadata.streetpronounciation to summarySublabel if need to compare with correctly pronounced street name
                        if (sub_value != "" && data[i].metadata.streetpronounciation.includes(sub_value.trim())) {
                            autofilldata.isKeyDetected = true;
                            autofilldata.time1 = message.time1;
                            autofilldata.time2 = message.time2;
                            autofilldata.time3 = message.time3;
                            console.log(autofilldata);
                            chrome.tabs.sendMessage(currentTabId, autofilldata);
                            return;
                        } else {
                            nameList.push(data[i].metadata.summaryLabel + " of" + data[i].metadata.summarySublabel);
                            continue;
                        }
                    } else {
                        continue;
                    }
                }
                if (nameList.length == 1) {
                    autofilldata.isKeyDetected = true;
                    autofilldata.time1 = message.time1;
                    autofilldata.time2 = message.time2;
                    autofilldata.time3 = message.time3;
                    console.log(autofilldata);
                    chrome.tabs.sendMessage(currentTabId, autofilldata);
                    return;
                }
                if (nameList.length > 1) {
                    chrome.runtime.sendMessage({
                        greeting: 'AUTOFILL_SAMENAME_DATA',
                        names: nameList
                    });
                    return;
                }
                if (nameList.length == 0) {
                    chrome.tabs.sendMessage(currentTabId, message);
                    return;
                }
            });
        } else {
            console.log("generic command =" + message.command);
            chrome.tabs.sendMessage(currentTabId, message);
            return;
        }

    });
};

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.greeting === 'TOGGLE_EXTENSION_ON_OFF') {
            pointerUrlArr = request.mylinks;
        }
        if (request.greeting === 'GET_AUTOFILL_DATA') {
            chrome.tabs.query({
                active: true,
                windowId: window.id
            }, function (arrayOfOneTab) {
                var tab = arrayOfOneTab[0];
                console.log(sender.tab.id);
                currentTabId = sender.tab.id;
                chrome.pageAction.show(currentTabId);
            });
        }
        if (request.greeting === 'NO_AUTOFILL_DATA') {
            chrome.tabs.query({
                active: true,
                windowId: window.id
            }, function (arrayOfOneTab) {
                var tab = arrayOfOneTab[0];
                currentTabId = sender.tab.id;
                chrome.pageAction.hide(currentTabId);
            });
        }
        if (request.greeting === 'GET_MY_DATA') {
            console.log(request.mylinks);
        }

    }
);