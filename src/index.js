import Mousetrap from 'mousetrap';
// import html2canvas from 'html2canvas';
// import domtoimage from "dom-to-image-more";



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
        },
        {
            id: "playFromTsKey",
            name: "Play from Timestamp Shortkey",
            description: "While typing in a block press this to start playing from the time stamp of the current block",
            action: {
                type: "input",
                placeholder: 'alt+a ,',
                onChange: (evt) => { ytParams.playFromTsKey = evt.target.value; }
            }
        }
        // ,
        // {
        //     id: "screenshotKey",
        //     name: "Screenshot Shortkey",
        //     description: "Take screen shot",
        //     action: {
        //         type: "input",
        //         placeholder: 'alt+a s',
        //         onChange: (evt) => { ytParams.screenshotKey = evt.target.value; }
        //     }
        // }
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
    Mousetrap.unbind(ytParams.playFromTsKey);
    // Mousetrap.unbind(ytParams.screenshotKey);
}

function bindShortkeys() {
    Mousetrap.prototype.stopCallback = function () { return false }
    //Setting all shortcuts 
    //Title
    Mousetrap.bind(ytParams.grabTitleKey, async function (e) {
        e.preventDefault()

        if (e.target.localName == "textarea") {
            let playing = whatIsPlaying();
            let title;
            if (playing) { //if something is playing grab its title
                title = playing.getVideoData().title;
            } else { //otherwise: first youtube in my parent is the player
                let container = e.target.closest('.roam-block-container');
                let parContainer = container.parentElement.closest('.roam-block-container');
                let myIframe = parContainer.querySelector("iframe");
                if (myIframe === null) return false;
                title = players.get(myIframe.id.slice(-9)).getVideoData().title;
            }
            fillTheBlock("**" + title + "**");
        }
        return false;
    }, 'keydown');
    //Play from TimeStamp
    Mousetrap.bind(ytParams.playFromTsKey, async function (e) {
        e.preventDefault()
        let blockUid = e.target.closest('.rm-block__input').id.slice(-9)
        const btnBlockTxt = blockString(blockUid)
        const match = btnBlockTxt.match(/{{\[\[ccc\-yt\-timestamp\]\]\:(.*)\(\((.*)\)\)}}/)

        if (match && match[1]) {
            const tsString = match[1];
            const matches = tsString.match(/(\d\d)\:(\d\d)\:(\d\d)/); // start w/ m:ss or h:mm:ss
            let ts;
            if (!matches || matches.length < 4) {
                ts = 0;
            } else {
                ts = parseInt(matches[1]) * 3600 + parseInt(matches[2]) * 60 + parseInt(matches[3]);
            }
            const ytUid = match[2];
            let player = players.get(ytUid)
            if (!player) {
                await openBlockInSidebar('block', ytUid)
                await sleep(1500);
            }
            player = players.get(ytUid)
            let playing = whatIsPlaying();
            if (playing && playing != player)
                playing.pauseVideo();
            player.seekTo(ts, true)
            player.playVideo();
        }
        return false;
    }, 'keydown');

    //TimeStamp
    Mousetrap.bind(ytParams.grabTimeKey, async function (e) {
        e.preventDefault()
        let playing = targetPlayer();
        if (playing !== null) {
            let timeStr = new Date(playing.getCurrentTime() * 1000).toISOString().substring(11, 19)
            fillTheBlock("{{[[ccc-yt-timestamp]]:" + timeStr + "((" + playing.getIframe().id.slice(-9) + "))}}");
            // fillTheBlock(timeStr);
            return false;
        }
        return false;
    }, 'keydown');

    //Play-Pause
    Mousetrap.bind(ytParams.playPauseKey, async function (e) {
        // console.log('players', players)
        e.preventDefault();
        let playing = whatIsPlaying();
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
    //     console.log('bbbbbbbb')
    //     e.preventDefault();
    //     let playing = targetPlayer();
    //     if (playing !== null) {
    //         const iframe = playing.getIframe();
    //         // domtoimage.toPng(iframe)
    //         //     .then(function (dataUrl) {
    //         //         var img = new Image();
    //         //         img.src = dataUrl;
    //         //         document.body.appendChild(img);
    //         //     })

    //         //             let canvas = document.createElement('canvas');

    //         //             canvas.width = iframe.width;
    //         //             canvas.height = iframe.height;

    //         //             // let ctx = canvas.getContext('2d');
    //         //             // ctx.drawImage(iframe.parentElement, 0, 0, canvas.width, canvas.height);

    //         //             // let url = canvas.toDataURL('image/jpeg');
    //         // // const iframeBody = iframe.contentDocument.body
    //         // // console.log(iframeBody)
    //         //             html2canvas(iframe).then(async canvas => {
    //         //                 const url = canvas.toDataURL('image/png');
    //         //                 console.log('this is the url ', url)
    //         //                 const imgFile = await fetch(url)
    //         //                     .then(function (res) { return res.arrayBuffer(); })
    //         //                     .then(function (buf) { return new File([buf], 'screenshot.png', { type: 'image/png' }); })
    //         //                 const screenShotUrl = await roamAlphaAPI.util.uploadFile({ file: imgFile });
    //         //                 const currentFocus = window.roamAlphaAPI.ui.getFocusedBlock()
    //         //                 const imageBlockUid = createUid();
    //         //                 createChildBlock(currentFocus['block-uid'], 0, screenShotUrl, imageBlockUid);
    //         //                 const emptyBlockUid = createUid();
    //         //                 createChildBlock(imageBlockUid, 0, '', emptyBlockUid);
    //         //                 window.roamAlphaAPI.ui.setBlockFocusAndSelection(
    //         //                     {
    //         //                         location: { 'block-uid': emptyBlockUid, 'window-id': currentFocus['window-id'] },
    //         //                     })
    //         // })
    //     }
    //     return false;
    // }, 'keydown');
    //Mute
    Mousetrap.bind(ytParams.muteKey, async function (e) {
        e.preventDefault();
        let playing = targetPlayer();
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
        let playing = targetPlayer();
        if (playing !== null) {
            playing.setVolume(Math.min(playing.getVolume() + 10, 100))
            return false;
        }
        return false;
    }, 'keydown');
    //Volume Down
    Mousetrap.bind(ytParams.volDownKey, async function (e) {
        e.preventDefault();
        let playing = targetPlayer();
        if (playing !== null) {
            playing.setVolume(Math.max(playing.getVolume() - 10, 0))
            return false;
        }
        return false;
    }, 'keydown');
    //Speed Up
    Mousetrap.bind(ytParams.speedUpKey, async function (e) {
        e.preventDefault();
        let playing = targetPlayer();
        if (playing !== null) {
            playing.setPlaybackRate(Math.min(playing.getPlaybackRate() + 0.25, 2))
            return false;
        }
        return false;
    }, 'keydown');
    //Speed Down
    Mousetrap.bind(ytParams.speedDownKey, async function (e) {
        e.preventDefault();
        let playing = targetPlayer();
        if (playing !== null) {
            playing.setPlaybackRate(Math.max(playing.getPlaybackRate() - 0.25, 0))
            return false;
        }
        return false;
    }, 'keydown');
    //Normal Speed
    Mousetrap.bind(ytParams.normalSpeedKey, async function (e) {
        e.preventDefault();
        let playing = targetPlayer();
        if (playing !== null) {
            playing.setPlaybackRate(1, 0)
            return false;
        }
        return false;
    }, 'keydown');
    //Move Forward
    Mousetrap.bind(ytParams.forwardKey, async function (e) {
        e.preventDefault();
        let playing = targetPlayer();
        if (playing !== null) {
            let duration = playing.getDuration();
            playing.seekTo(Math.min(playing.getCurrentTime() + 10, duration), true)
            return false;
        }
        return false;
    }, 'keydown');
    //Move Backward
    Mousetrap.bind(ytParams.backwardKey, async function (e) {
        e.preventDefault();
        let playing = targetPlayer();
        if (playing !== null) {
            let duration = playing.getDuration();
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
        if (document.querySelector('iframe[id$="' + playerId + '"]') === null) {
            continue;
        }
        return player;
    }
    return null;
}

//Getting the target player
//1)playing  or 2)most recent one or 3) the first one
function targetPlayer() {
    let playing = whatIsPlaying();
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
async function fillTheBlock(perfixTxt) {
    let blockUid = document.querySelector("textarea.rm-block-input").id.slice(-9);
    let blockTxt = blockString(blockUid);
    let trail = blockTxt;
    const match = blockTxt.match(/{{\[\[ccc\-yt\-timestamp\]\]\:........\(\(.........\)\)}}.*/)
    if (match && match[0]) {
        trail = blockTxt.substring(46)
    }
    await updateBlockString(blockUid, perfixTxt + trail);
    const len = (perfixTxt + trail).length
    // sleep(300)
    window.roamAlphaAPI.ui.setBlockFocusAndSelection(
        {
            location: window.roamAlphaAPI.ui.getFocusedBlock(),
            selection: { start: len, end: len }
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

const updateBlockString = async (blockUid, newString) => {
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
                // const block = ytEl.closest('.roam-block-container');
                let frameId;
                // let newIframe = false;
                if (!ytEl.classList.contains('yt-activated')) {
                    let ytId = extractVideoID(ytEl.src);
                    frameId = "yt-" + ytEl.closest('.roam-block').id;
                    let ytWrapper = document.createElement('div');
                    ytWrapper.id = frameId;
                    ytEl.parentNode.insertBefore(ytWrapper, ytEl);
                    ytEl.remove()
                    let newYTEl = new window.YT.Player(frameId, { videoId: ytId })
                    let iframe = document.getElementById(frameId)
                    iframe.classList.add('rm-iframe', 'rm-video-player', 'yt-activated')
                    iframe.closest('div').classList.add('rm-iframe__container', 'rm-video-player__container', 'hoverparent')
                    players.set(frameId.slice(-9), newYTEl);

                    const iframeWrapper = iframe.closest('.rm-iframe__spacing-wrapper')
                    const overlayButton = iframeWrapper?.querySelector('.rm-video-player__comment-button')
                    overlayButton.style.display = 'none';
                    // let newDiv = overlayButton.cloneNode()
                    // newDiv.className = 'myCommentBtn';
                    // overlayButton.style.visibility = 'hidden';             
                    // iframe.parentElement.insertBefore(newDiv, iframe)
                    // newDiv.addEventListener("click", (e) => {
                    //     e.preventDefault();
                    //     e.stopPropagation();
                    //     e.stopImmediatePropagation();
                    //     let timeStr = new Date(newYTEl.getCurrentTime() * 1000).toISOString().substring(11, 19)
                    //     fillTheBlock("{{[[ccc-yt-timestamp]]:" + timeStr + "((" + playing.getIframe().id.slice(-9) + "))}}");
                    //     return false;
                    // });
                }
            });
        return;
    };

    const extractVideoID = (url) => {
        let regExp = /^(https?:\/\/)?((www\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/\/?|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
        let match = url.match(regExp);
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


function activateNewTimeStamp(mutations) {
    for (let mutation of mutations) {
        for (let node of mutation.addedNodes) {
            if (node.nodeType === 1) { //check if this is an element (not text/char)
                const btns = node.querySelectorAll('.rm-xparser-default-ccc-yt-timestamp')
                for (let btn of btns) {
                    if (!btn.closest('.rm-zoom')) {
                        const blockRefSpan = btn.closest('.rm-block-ref')
                        let blockUid;
                        if (!blockRefSpan) { //main
                            blockUid = btn.closest('.rm-block__input').id.slice(-9)
                        } else { //ref
                            blockUid = blockRefSpan.dataset.uid
                        }
                        const btnBlockTxt = blockString(blockUid)

                        const match = btnBlockTxt.match(/{{\[\[ccc\-yt\-timestamp\]\]\:(.*)\(\((.*)\)\)}}/)
                        if (match && match[1]) {
                            btn.innerHTML = match[1];
                            btn.addEventListener("click", (e) => { tsClick(e, match[1], match[2]) });
                        }
                        btn.classList.add('timestamp-control');
                    }
                }
            }
        }
        for (let node of mutation.removedNodes) {
            if (node.nodeType === 1) {
                const ytIframe = node.querySelector('iframe[id^="yt-"]') //iframe is closed remove it from players list
                if (ytIframe)
                    players.delete(ytIframe.id.slice(-9))
            }
        }

    }
}



function openBlockInSidebar(windowType, blockUid) {
    return window.roamAlphaAPI.ui.rightSidebar.addWindow({ window: { type: windowType, 'block-uid': blockUid } })
}

async function tsClick(e, tsString, ytUid) {
    e.stopPropagation()
    let ts = 0;
    const matches = tsString.match(/(\d\d)\:(\d\d)\:(\d\d)/); // start w/ m:ss or h:mm:ss
    if (!matches || matches.length < 4) {
        ts = 0;
    } else {
        ts = parseInt(matches[1]) * 3600 + parseInt(matches[2]) * 60 + parseInt(matches[3]);
    }
    let player = players.get(ytUid)
    if (!player) {
        await openBlockInSidebar('block', ytUid)
        await sleep(1500);
    }
    player = players.get(ytUid)
    let playing = whatIsPlaying();
    if (playing && playing != player)
        playing.pauseVideo();

    player.seekTo(ts, true)
    player.playVideo();
}

function setSettingDefault(extensionAPI, settingId, settingDefault) {
    let storedSetting = extensionAPI.settings.get(settingId);
    if (null == storedSetting) extensionAPI.settings.set(settingId, settingDefault);
    return storedSetting || settingDefault;
}

let tsObserver;
function onload({ extensionAPI }) {
    // console.log('loading')

    tsObserver = new MutationObserver(activateNewTimeStamp)
    tsObserver.observe(document.getElementById('app'), { subtree: true, childList: true })

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
    ytParams.playFromTsKey = setSettingDefault(extensionAPI, 'playFromTsKey', 'alt+a ,');
    // ytParams.screenshotKey = setSettingDefault(extensionAPI, 'screenshotKey', 'alt+a s');

    extensionAPI.settings.panel.create(panelConfig);

    startC3YtExtension();
    bindShortkeys();
}

function onunload() {
    // console.log('unloading')
    tsObserver.disconnect();

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