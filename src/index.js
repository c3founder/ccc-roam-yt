import Mousetrap from 'mousetrap';


let ytParams = {};

const panelConfig = {
    tabTitle: "CCC YouTube Timestamp with Player Control",
    settings: [
        {
            id: "grabTitleKey",
            name: "Grab Title Shortkey",
            description: "Paste the video title into the focused block",
            action: {
                type: "input",
                placeholder: 'alt+a t',
                onChange: (evt) => { ytParams.grabTitleKey = evt.target.value; }
            }
        },
        {
            id: "grabTimeKey",
            name: "Time Stamp Shortkey",
            description: "Paste the current playing time at the beginning of the focused block",
            action: {
                type: "input",
                placeholder: 'alt+a n',
                onChange: (evt) => { ytParams.grabTimeKey = evt.target.value; }
            }
        },
        {
            id: "normalSpeedKey",
            name: "Normal Speed Shortkey",
            description: "Set the playback speed to normal",
            action: {
                type: "input",
                placeholder: 'alt+a 0',
                onChange: (evt) => { ytParams.normalSpeedKey = evt.target.value; }
            }
        },
        {
            id: "speedUpKey",
            name: "Speed up by .25x Shortkey",
            description: "Increase the playback speed by .25x",
            action: {
                type: "input",
                placeholder: 'alt+a =',
                onChange: (evt) => { ytParams.speedUpKey = evt.target.value; }
            }
        },
        {
            id: "speedDownKey",
            name: "Speed down by .25x Shortkey",
            description: "Decrease the playback speed by .25x",
            action: {
                type: "input",
                placeholder: 'alt+a -',
                onChange: (evt) => { ytParams.speedDownKey = evt.target.value; }
            }
        },
        {
            id: "muteKey",
            name: "Mute Shortkey",
            description: "Mute the playback audio",
            action: {
                type: "input",
                placeholder: 'alt+a m',
                onChange: (evt) => { ytParams.muteKey = evt.target.value; }
            }
        },
        {
            id: "volUpKey",
            name: "Vol Up Shortkey",
            description: "Increase volume",
            action: {
                type: "input",
                placeholder: 'alt+a i',
                onChange: (evt) => { ytParams.volUpKey = evt.target.value; }
            }
        },
        {
            id: "volDownKey",
            name: "Vol Down Shortkey",
            description: "Decrease volume",
            action: {
                type: "input",
                placeholder: 'alt+a k',
                onChange: (evt) => { ytParams.volDownKey = evt.target.value; }
            }
        },
        {
            id: "playPauseKey",
            name: "Play Pause Shortkey",
            description: "Play/Pause the player",
            action: {
                type: "input",
                placeholder: 'alt+a p',
                onChange: (evt) => { ytParams.playPauseKey = evt.target.value; }
            }
        },
        {
            id: "backwardKey",
            name: "Backward Shortkey",
            description: "Go Backward",
            action: {
                type: "input",
                placeholder: 'alt+a j',
                onChange: (evt) => { ytParams.backwardKey = evt.target.value; }
            }
        },
        {
            id: "forwardKey",
            name: "ForwardKey Shortkey",
            description: "Go Forward",
            action: {
                type: "input",
                placeholder: 'alt+a l',
                onChange: (evt) => { ytParams.forwardKey = evt.target.value; }
            }
        }
    ]
};

let onunloadfns = [];


function unbindShortkeys() {
    Mousetrap.unbind(ytParams.grabTitleKey);
    Mousetrap.unbind(ytParams.grabTimeKey);
    Mousetrap.unbind(ytParams.normalSpeedKey);
    Mousetrap.unbind(ytParams.speedUpKey);
    Mousetrap.unbind(ytParams.speedDownKey);
    Mousetrap.unbind(ytParams.muteKey);
    Mousetrap.unbind(ytParams.volUpKey);
    Mousetrap.unbind(ytParams.playPauseKey);
    Mousetrap.unbind(ytParams.backwardKey);
    Mousetrap.unbind(ytParams.forwardKey);
    // Mousetrap.unbind(ytParams.screenshotKey);
}

function bindShortkeys() {
    Mousetrap.prototype.stopCallback = function () { return false }
    //Setting all shortcuts 
    //Title
    Mousetrap.bind(ytParams.grabTitleKey, async function (e) {
        e.preventDefault()
        if (e.srcElement.localName == "textarea") {
            var container = e.srcElement.closest('.roam-block-container');
            var parContainer = container.parentElement.closest('.roam-block-container');
            var myIframe = parContainer.querySelector("iframe");
            if (myIframe === null) return false;
            var title = players.get(myIframe.id).getVideoData().title;
            fillTheBlock("**" + title + "**");
        }
        return false;
    }, 'keydown');
    //TimeStamp
    Mousetrap.bind(ytParams.grabTimeKey, async function (e) {
        e.preventDefault()
        var playing = targetPlayer();
        if (playing !== null) {
            var timeStr = new Date(playing.getCurrentTime() * 1000).toISOString().substr(11, 8)
            // fillTheBlock("{{[[ccc-yt-timestamp]]:" + timeStr + "}}");
            fillTheBlock(timeStr);
            return false;
        }
        return false;
    }, 'keydown');
    //Play-Pause
    Mousetrap.bind(ytParams.playPauseKey, async function (e) {
        e.preventDefault();
        var playing = whatIsPlaying();
        //If something is playing => pause it
        if (playing !== null) {
            playing.pauseVideo();
            paused = playing;
            return false;
        }
        //If there is an active paused video => play it
        if (paused !== null) {
            paused.playVideo();
            paused = null;
            return false;
        }
        //If nothing is playing or paused => play the first video
        if (players.size > 0) {
            playing = whatIsPresent();
            if (playing !== null) {
                playing.playVideo();
                return false;
            }
        }
        return false;
    }, 'keydown');
    //Screenshot
    // Mousetrap.bind(ytParams.screenshotKey, async function (e) {
    //     console.log('fffff')
    //     e.preventDefault();
    //     var playing = targetPlayer();
    //     if (playing !== null) {
    //         const iframe = playing.getIframe();

    //         let canvas = document.createElement('canvas');

    //         canvas.width = iframe.width;
    //         canvas.height = iframe.height;

    //         let ctx = canvas.getContext('2d');
    //         ctx.drawImage(iframe.parentElement, 0, 0, canvas.width, canvas.height);

    //         let url = canvas.toDataURL('image/jpeg');

    //         // html2canvas(iframe.parentElement).then(async canvas => {
    //             // const url = canvas.toDataURL('image/png');
    //             console.log('this is the url ', url)
    //             const imgFile = await fetch(url)
    //                 .then(function (res) { return res.arrayBuffer(); })
    //                 .then(function (buf) { return new File([buf], 'screenshot.png', { type: 'image/png' }); })
    //             const screenShotUrl = await roamAlphaAPI.util.uploadFile({ file: imgFile });
    //             const currentFocus = window.roamAlphaAPI.ui.getFocusedBlock()
    //             const imageBlockUid = createUid();
    //             createChildBlock(currentFocus['block-uid'], 0, screenShotUrl, imageBlockUid);
    //             const emptyBlockUid = createUid();
    //             createChildBlock(imageBlockUid, 0, '', emptyBlockUid);
    //             window.roamAlphaAPI.ui.setBlockFocusAndSelection(
    //                 {
    //                     location: { 'block-uid': emptyBlockUid, 'window-id': currentFocus['window-id'] },
    //                 })
    //         // })
    //     }
    //     return false;
    // }, 'keydown');
    //Mute
    Mousetrap.bind(ytParams.muteKey, async function (e) {
        e.preventDefault();
        var playing = targetPlayer();
        if (playing !== null) {
            if (playing.isMuted()) {
                playing.unMute();
            } else {
                playing.mute();
            }
            return false;
        }
        return false;
    }, 'keydown');
    //Volume Up
    Mousetrap.bind(ytParams.volUpKey, async function (e) {
        e.preventDefault();
        var playing = targetPlayer();
        if (playing !== null) {
            playing.setVolume(Math.min(playing.getVolume() + 10, 100))
            return false;
        }
        return false;
    }, 'keydown');
    //Volume Down
    Mousetrap.bind(ytParams.volDownKey, async function (e) {
        e.preventDefault();
        var playing = targetPlayer();
        if (playing !== null) {
            playing.setVolume(Math.max(playing.getVolume() - 10, 0))
            return false;
        }
        return false;
    }, 'keydown');
    //Speed Up
    Mousetrap.bind(ytParams.speedUpKey, async function (e) {
        e.preventDefault();
        var playing = targetPlayer();
        if (playing !== null) {
            playing.setPlaybackRate(Math.min(playing.getPlaybackRate() + 0.25, 2))
            return false;
        }
        return false;
    }, 'keydown');
    //Speed Down
    Mousetrap.bind(ytParams.speedDownKey, async function (e) {
        e.preventDefault();
        var playing = targetPlayer();
        if (playing !== null) {
            playing.setPlaybackRate(Math.max(playing.getPlaybackRate() - 0.25, 0))
            return false;
        }
        return false;
    }, 'keydown');
    //Normal Speed
    Mousetrap.bind(ytParams.normalSpeedKey, async function (e) {
        e.preventDefault();
        var playing = targetPlayer();
        if (playing !== null) {
            playing.setPlaybackRate(1, 0)
            return false;
        }
        return false;
    }, 'keydown');
    //Move Forward
    Mousetrap.bind(ytParams.forwardKey, async function (e) {
        e.preventDefault();
        var playing = targetPlayer();
        if (playing !== null) {
            var duration = playing.getDuration();
            playing.seekTo(Math.min(playing.getCurrentTime() + 10, duration), true)
            return false;
        }
        return false;
    }, 'keydown');
    //Move Backward
    Mousetrap.bind(ytParams.backwardKey, async function (e) {
        e.preventDefault();
        var playing = targetPlayer();
        if (playing !== null) {
            var duration = playing.getDuration();
            playing.seekTo(Math.max(playing.getCurrentTime() - 10, 0), true)
            return false;
        }
        return false;
    }, 'keydown');
}


let paused = null;
const players = new Map();

//Getting the playing player
function whatIsPlaying() {
    for (let player of players.values()) {
        if (player.getPlayerState() == 1) {
            return player;
        }
    }
    return null;
}

//Getting the first uncued player 
function whatIsPresent() {
    for (let [playerId, player] of players) {
        if (document.getElementById(playerId) === null) {
            continue;
        }
        return player;
    }
    return null;
}

//Getting the target player
//1)playing  or 2)most recent one or 3) the first one
function targetPlayer() {
    var playing = whatIsPlaying();
    if (playing !== null)
        return playing;
    if (paused !== null)
        return paused;
    //If nothing is playing return the fist player (if exists) that is not cued.
    if (players.size > 0)
        return whatIsPresent();
    return null;
}

const sleep = m => new Promise(r => setTimeout(r, m))


//Fill out the current block with the given text
function fillTheBlock(perfixTxt) {
    let blockUid = document.querySelector("textarea.rm-block-input").id.slice(-9);
    updateBlockString(blockUid, perfixTxt + " " + blockString(blockUid));
    sleep(300)
    window.roamAlphaAPI.ui.setBlockFocusAndSelection(
        {
            location: window.roamAlphaAPI.ui.getFocusedBlock(),
            selection: {start: 8, end: 8}
        })
}

const createChildBlock = (parentUid, order, childString, childUid) => {
    return window.roamAlphaAPI.createBlock(
        {
            location: { "parent-uid": parentUid, order: order },
            block: { string: childString.toString(), uid: childUid }
        })
}

const createUid = () => {
    return roamAlphaAPI.util.generateUID();
}

const updateBlockString = (blockUid, newString) => {
    return window.roamAlphaAPI.updateBlock({
        block: { uid: blockUid, string: newString }
    });
}

const blockString = (blockUid) => {
    return window.roamAlphaAPI.q(
        `[:find (pull ?block [:block/string])
    :where [?block :block/uid \"${blockUid}\"]]`)[0][0].string
}



function startC3YtExtension() {


    const activateYtVideos = () => {
        if (typeof (YT) == 'undefined') return;
        Array.from(document.getElementsByTagName('IFRAME'))
            .filter(iframe => iframe.src.includes('youtube.com'))
            .forEach(ytEl => {
                if (ytEl.closest('.rm-zoom-item') !== null) {
                    return; //ignore breadcrumbs and page log            
                }
                const block = ytEl.closest('.roam-block-container');
                let frameId;
                let newIframe = false;
                if (!ytEl.classList.contains('yt-activated')) {
                    var ytId = extractVideoID(ytEl.src);
                    frameId = "yt-" + ytEl.closest('.roam-block').id;
                    var ytWrapper = document.createElement('div');
                    ytWrapper.id = frameId;
                    ytEl.parentNode.insertBefore(ytWrapper, ytEl);
                    ytEl.remove()
                    let newYTEl = new window.YT.Player(frameId, { videoId: ytId })
                    let iframe = document.getElementById(frameId)
                    iframe.classList.add('rm-iframe', 'rm-video-player', 'yt-activated')
                    iframe.closest('div').classList.add('rm-iframe__container', 'rm-video-player__container', 'hoverparent')
                    players.set(frameId, newYTEl);

                    const iframeWrapper = iframe.closest('.rm-iframe__spacing-wrapper')
                    const overlayButton = iframeWrapper?.querySelector('.rm-video-player__comment-button')
                    overlayButton.style.visibility = 'hidden';
                    newIframe = true;
                } else {
                    frameId = ytEl.id
                }
                addTimestampControls(block, players.get(frameId), newIframe);
            });
    };

    const addTimestampControls = (block, player, newIframe) => {
        if (block.children.length < 2) return null;
        const childBlocks = Array.from(block.children[1].querySelectorAll('.rm-block__input'));
        childBlocks.forEach(child => {
            if (!child.classList.contains('timestamp-observed') || newIframe) {
                const timestamp = getTimestamp(child);
                const buttonIfPresent = getControlButton(child);
                const timestampChanged = buttonIfPresent !== null && timestamp != buttonIfPresent.dataset.timestamp;
                if (buttonIfPresent !== null && (timestamp === null || timestampChanged || newIframe)) {
                    buttonIfPresent.remove();
                }
                if (timestamp !== null && ((buttonIfPresent === null || timestampChanged || newIframe))) {
                    addControlButton(child, timestamp, () => player.seekTo(timestamp, true));
                }
                child.classList.add('timestamp-observed')
            }
        });
    };


    const getControlButton = (block) => block.parentElement.querySelector('.timestamp-control');

    const addControlButton = (block, timestamp, fn) => {
        const button = document.createElement('button');
        button.innerText = '►';
        button.classList.add('timestamp-control');
        button.dataset.timestamp = timestamp;
        // button.style.borderRadius = '50%';
        button.addEventListener('click', fn);
        block.parentElement.insertBefore(button, block);
    };

    const getTimestamp = (block) => {
        var myspan = block.querySelector('span')
        if (myspan === null) return null;
        const blockText = myspan.textContent;
        const matches = blockText.match(/^((?:\d+:)?\d+:\d\d)\D/); // start w/ m:ss or h:mm:ss
        if (!matches || matches.length < 2) return null;
        const timeParts = matches[1].split(':').map(part => parseInt(part));
        if (timeParts.length == 3) return timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
        else if (timeParts.length == 2) return timeParts[0] * 60 + timeParts[1];
        else return null;
    };

    const extractVideoID = (url) => {
        var regExp = /^(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/\/?|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
        var match = url.match(regExp);
        if (match && match[7].length == 11) {
            return match[7];
        } else {
            return null;
        }
    };

    let ytReady = setInterval(() => {
        if (typeof (YT) == 'undefined' || typeof (YT.Player) == 'undefined') {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            clearInterval(ytReady);
        }
    }, 1000);

    let initInterval = window.setInterval(activateYtVideos, 1000);
    onunloadfns.push(() => clearInterval(initInterval));
}


// function activateNewTimeStamp(mutations) {
//     // for (let mutation of mutations) {
//     //     for (let node of mutation.addedNodes) {
//     //         const btn = node.querySelector('.rm-xparser-default-ccc-yt-timestamp')
//     //         if (btn) {
//     //             const blockContainer = btn.closest('.rm-block__input')
//     //             const blockUid = blockContainer.id.slice(-9)
//     //             const btnBlockTxt = blockString(blockUid)
//     //             const match = btnBlockTxt.match(/{{\[\[ccc\-yt\-timestamp\]\]\:(.*)}}/)
//     //             btn.parentElement.insertBefore(btn, )
//     //             if (match && match[1]) {
//     //                 btn.innerHTML = match[1];
//     //             }
//     //             btn.classList.add('timestamp-control');
//     //         }
//     //     }
//     // }
// }


function setSettingDefault(extensionAPI, settingId, settingDefault) {
    let storedSetting = extensionAPI.settings.get(settingId);
    if (null == storedSetting) extensionAPI.settings.set(settingId, settingDefault);
    return storedSetting || settingDefault;
}

function onload({ extensionAPI }) {
    // console.log('loading')
    
    ytParams.grabTitleKey = setSettingDefault(extensionAPI, 'grabTitleKey', 'alt+a t');
    ytParams.grabTimeKey = setSettingDefault(extensionAPI, 'grabTimeKey', 'alt+a n');
    ytParams.normalSpeedKey = setSettingDefault(extensionAPI, 'normalSpeedKey', 'alt+a 0');
    ytParams.speedUpKey = setSettingDefault(extensionAPI, 'speedUpKey', 'alt+a =');
    ytParams.speedDownKey = setSettingDefault(extensionAPI, 'speedDownKey', 'alt+a -');
    ytParams.muteKey = setSettingDefault(extensionAPI, 'muteKey', 'alt+a m');
    ytParams.volUpKey = setSettingDefault(extensionAPI, 'volUpKey', 'alt+a i');
    ytParams.volDownKey = setSettingDefault(extensionAPI, 'volDownKey', 'alt+a k');
    ytParams.playPauseKey = setSettingDefault(extensionAPI, 'playPauseKey', 'alt+a p');
    ytParams.backwardKey = setSettingDefault(extensionAPI, 'backwardKey', 'alt+a j');
    ytParams.forwardKey = setSettingDefault(extensionAPI, 'forwardKey', 'alt+a l');
    extensionAPI.settings.panel.create(panelConfig);

    startC3YtExtension();
    bindShortkeys();
}

function onunload() {
    // console.log('unloading')
    unbindShortkeys();
    for (const f of onunloadfns) {
        // console.log(f);
        f();
    }
    onunloadfns = [];
}

export default {
    onload: onload,
    onunload: onunload
}