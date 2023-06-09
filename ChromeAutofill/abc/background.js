var DEV_MODE = true;
var inputWindowId = null;
var parentWindowId = null;
var timeOfLastRequest = 0;
var dictationMode = false;
var lastMessage = null;
var inputWindowURL = 'input.html'
var keepShowing = false;

// Open input.html in a separate window by default.
// Users can adjust options so that it opens in a separate tab instead.
var openInputWindow = function() {
    chrome.storage.sync.get({
        'openInTab': false
    }, function(items) {
        if(items.openInTab) {
            chrome.tabs.create(
                {
                    'url': inputWindowURL,
                },
                function(window) {
                    inputWindowId = window.id;
                }
            );
        } else {
            chrome.windows.create(
                {
                    'url': inputWindowURL,
                    'height': 300,
                    'width': 400,
                    'left': screen.width - 400,
                    'top': -10
                },
                function(window) {
                    inputWindowId = window.id;
                });
        }
    });
};

// Add click handler to extension icon.
chrome.browserAction.onClicked.addListener(openInputWindow);

// send a command to the browser; also handles the "close tab" command
var sendCommandToControlScript = function( message ) {
	console.log('here--:'+message)	
    chrome.tabs.query({
                    active: true,
                    windowId: window.id
                }, function( arrayOfOneTab ){
                    var tab = arrayOfOneTab[0];
                    var id = tab.id;
                    if (message === 'close tab' || message === 'close time') {
                        chrome.tabs.remove(id);
                        return;
                    }
                    // if we've gotten here, it's a non-dictation DOM-level
                    // command, so send it to control.js.
                    chrome.tabs.sendMessage(id, message);
                });
};

// Decide what to do with a command sent from input.js.
//
// If it's a browser level command (new tab, close tab, exit, done, full screen, minimize, maximize, switch),
// then it handles it itself. Otherwise it's a dictation or a DOM level command and 
// it gets sent to control.js.
//
// Also does a lot of checking to prevent command doubling.
var executeMessage = function( message, isDictationMessage ) {
    if (lastMessage && lastMessage.startsWith('keep') && lastMessage.endsWith(message)){
        return;
    }

    // the webSpeech engine very frequently sends 'newtown' then immediately corrects it to 'new tab'
    // we would be better off making a lastMessageIsMisheard() function to make this generic instead of specific
    if (lastMessage === 'newtown' && message === 'new tab' && (new Date()).getTime() - timeOfLastRequest < 1000 ){
        return;
    }

    // don't double execute commands that are sent twice by mistake
    if ( !parseInt(message) && message === lastMessage && (new Date()).getTime() - timeOfLastRequest < 1000 ) {
        console.log('noticed time');
        return;
    }

    lastMessage = message;

    if ( !isDictationMessage && !message.startsWith('go to') ) {
        timeOfLastRequest = (new Date()).getTime();
    }

    if (!isDictationMessage) {
        console.log('executing: ' + message);
		if(message.startsWith('go to')){
			let sitename = message.replace('go to ','');
			openInNewTab(goTo(sitename));
			return;
		}
        if (message === 'done' || message === 'Don' || message === 'Dunn') {
            chrome.windows.remove( inputWindowId );
            // hide help when extension is closed
            sendCommandToControlScript('hidehelp');
            return;
        }

        // handles execution of message
        chrome.windows.getAll( {populate: true}, function(windows){
            windows.forEach(function(window){
                if (message === 'quit' || message === 'exit') {
                    chrome.windows.remove( window.id );
                    return;
                }

                // Don't let any other commands reach the input window's content script (control.js)
                if (window.tabs[0].url === inputWindowURL) {
                    return;
                }

                // toggle mute on active tab
                if (message === 'silence' || message === 'silent') {
                    var activeId = null;
                    chrome.tabs.query(
                        {windowId: window.id},
                        function( allTabs ){
                            allTabs.forEach(function(tab) {
                                if (tab.active) {
                                    chrome.tabs.update(tab.id, {muted: !tab.mutedInfo.muted});
                                }
                            });
                        }
                    );
                }

                if (message === 'full screen') {
                    if (window.state !== 'fullscreen') {
                        chrome.windows.update( window.id, { state: 'fullscreen' } );
                    }
                    else if (window.state === 'fullscreen') {
                        chrome.windows.update( window.id, { state: 'maximized' } );
                    }
                    return;
                }
                if (message === 'minimize') {
                    if (window.state !== 'minimized') {
                        chrome.windows.update( window.id, { state: 'minimized' } );
                    } else {
                        chrome.windows.update( window.id, { state: 'maximized' } );
                    }
                    return;
                }
                if (message === 'maximize') {
                    chrome.windows.update( window. id, {state: 'maximized' } );
                }
                if (message === 'new tab' || message === 'newtown') {
                    chrome.tabs.create({ windowId: window.id });
                    return;
                }
                if (message === 'switch') {
                    var now = false;
                    chrome.tabs.query(
                        {windowId: window.id},
                        // find current active tab and switch to the next one
                        function( allTabs ){
                            for (var i = 0; i < allTabs.length; i++) {
                                if (now) {
                                    chrome.tabs.update(allTabs[i].id, {active: true});
                                    break;
                                }
                                if (allTabs[i].active) {
                                    now = true;
                                    if (i == allTabs.length - 1) {
                                        chrome.tabs.update(allTabs[0].id, {active: true});
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
        chrome.windows.getAll( {populate:true}, function(windows){
            windows.forEach(function(window){
                // but don't send dictation to input.html
                if (window.tabs[0].url === inputWindowURL) {
                    return;
                }
                chrome.tabs.query({
                    active: true,
                    windowId: window.id
                }, function( arrayOfOneTab ){
                    var tab = arrayOfOneTab[0];
                    chrome.tabs.sendMessage(tab.id, message);
                });
            });
        });
    }
};

// Listen for messages from input.js
chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        console.log('received something');
        // ignore messages from all other pages
        if (sender.url !== inputWindowURL) {
            console.log('Nevermind, bad URL from message sender.');
            console.log('URL: ' + sender.url);
            return;
        }
        // if request is asking for the user's custom aliases,
        // get them and send them back.
        if (request.getAliases) {
            chrome.storage.sync.get({
                commandAliases: {}
            }, function(items) {
                sendResponse({commandAliases: items.commandAliases});
            });
            return true;
        }
        // if request is asking for the user's custom "auto-inactivity-shut-off time",
        // get it and send it back.
        if (request.getTimeoutDuration) {
            chrome.storage.sync.get({
                timeoutDuration: 180000
            }, function(items) {
                sendResponse({timeoutDuration: items.timeoutDuration});
            });
            return true;
        }
        // check that message is not empty
        if (!request.message) {
            return;
        }
        if (request.message === 'CHROME_DICTATION_STOP' || request.message === 'CHROME_DICTATION_SUBMIT') {
            dictationMode = false;
        }
        if (dictationMode) {
            console.log('called as dictation: ' + request.message);
            executeMessage( request.message, true );
        } else {
            console.log('called as command: ' + request.message);
            executeMessage( request.message, false );
        }
    }
);

// Listen for messages from control.js -- used to activate dictation mode
// when control.js detects that it has been asked to click on a form input.
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting.dictModeOn === true) {
            console.log('turning on dictation mode in the background window');
            dictationMode = true;
            // send message to the input window's content script (control.js) to let it know to turn on dictation mode
            chrome.windows.get(inputWindowId, {populate: true}, function(window){
                chrome.tabs.query({
                    active: true,
                    windowId: window.id
                }, function( arrayOfOneTab ){
                    var tab = arrayOfOneTab[0];
                    chrome.tabs.sendMessage(tab.id, {dictModeOn: true});
                });
            });
        // This is only used to receive messages from onbeforeunload event handler in control.js.
        // Otherwise background.js/input.js turn off dictation mode for themselves by recognizing
        // stop/go commands as they pass through the chain of execution (input.js->backgrounds.js->control.js).
        } else if (request.greeting.dictModeOn === false) {
            console.log('turning off dictation mode in the background window due to onbeforeunload');
            dictationMode = false;
            // Send message to the input window's content script (control.js) to let it know to turn off dictation mode
            if (request.greeting.origin === 'mainWindow') {
                chrome.windows.get(inputWindowId, {populate: true}, function(window){
                    chrome.tabs.query({
                        active: true,
                        windowId: window.id
                    }, function( arrayOfOneTab ){
                        var tab = arrayOfOneTab[0];
                        chrome.tabs.sendMessage(tab.id, {dictModeOn: false});
                    });
                });
            } else if (request.greeting.origin === 'inputWindow') {
                // if we've just refreshed the input window, turn off dictation mode in the main window's control.js
                executeMessage('CHROME_DICTATION_STOP', false);
            }
        } else if (request.greeting === 'TOGGLE_EXTENSION_ON_OFF') {
            var open = true;
            chrome.windows.getAll( {populate: true}, function(windows){
                windows.forEach(function(window){
                    if (window.tabs[0].url === inputWindowURL) {
                        chrome.windows.remove( window.id );
                        open = false;
                    }
                });
                if (open) {
                    openInputWindow();
                }
            });
        } else if (request.greeting === 'KEEP_SHOWING') {
            keepShowing = true;
        } else if (request.greeting === 'STOP_SHOWING') {
            keepShowing = false;
        } else if (request.greeting === 'SHOW?') {
            sendResponse(keepShowing);
        }
    }
);

chrome.extension.onConnect.addListener(port => {
    console.log('connected....')
    port.onMessage.addListener(msg => {
        console.log('message received ' + msg)
		if(msg !== 'Hi Background'){
			if (dictationMode) {
				console.log('called as dictation: ' + msg);
				executeMessage( msg, true );
			} else {
				console.log('called as command: ' + msg);
				executeMessage( msg, false );
			}
		}else{
		
        chrome.tabs.query({
            active: true,
            windowId: window.id
        }, function( arrayOfOneTab ){
            var tab = arrayOfOneTab[0];
			parentWindowId=tab.windowId;
            port.postMessage(tab.url);
        });
		}
        
    })
})


var goTo = function(destination) {
            if (destination === 'undefined') {
                // sometimes webspeech sends 'go to undefined' before fully registering the input
                // so we check for those incomplete messages here and ignore them
                return;
            }
			var myUrl;
            if ( !destination.includes('.com') && !destination.includes('.edu') && 
                !destination.includes('.gov') && !destination.includes('.org') && !destination.includes('.de')) {
                if (destination.endsWith('.') ) {
                    destination = destination.slice(0, -1);
                }
                destination += '.com';
				myUrl='http://www.' + destination;
            }else{
				myUrl=destination;
			}
            // sigh
            if (destination === 'readit.com' || destination === 'read.com') {
				destination = 'reddit.com';
				myUrl='http://www.' + destination;
			}

            return myUrl;
        };
		
function openInNewTab(url) {
	chrome.tabs.create({windowId:parentWindowId, url: url, active: true }); 
}