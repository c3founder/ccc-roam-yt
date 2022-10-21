
# YouTube Timestamp 
You can add timestamps while typing using a shortcut. 

- **Parameters:**
  - Grab Title Shortkey: It grabs the title of playing video and paste it to the beginning of the current block.
  - Time Stamp Shortkey: It captures the player's current time and pastes it to the beginning of the block. If you press it multiple times, it updates the old timestamp with the current time. 

- **YouTube Demo**
    - Note: this is for an older version of the extension with a slightly different functionality and UI. 
	- [![timestamp](https://img.youtube.com/vi/Kgo_Lkw-2CA/0.jpg)](https://www.youtube.com/watch?v=Kgo_Lkw-2CA&ab_channel=ConnectedCognitionCrumbs)


# In-text Controllable Player
You can control the YT player while you are typing. This is good for taking note because you may fall behind or want to speed up the video, etc. 

But which player do you control by pressing the shortkeys?

- TL;DR: If you have one player on the page, shortcuts will control the player, easy. 
- When multi YT players are present 
  - If only one is playing: shortcuts will control the playing one. 
  - If nothing is playing, shortcuts will control the last playing video you paused before by shortcut (not mouse click). For example, you can mute/unmute or -10/+10 the last video you paused or play it with `alt+a p`.
  - If multiple videos are playing, everything is ambiguous, so you can only control the first one (according to the order of appearance on the page). You can pause them all in order by `alt+a p`, though. 

- **Parameters:** 
	- Play Pause Shortkey: play/pause the most recent player or the first one
	- Backward Shortkey: go backward 10 sec
	- ForwardKey Shortkey: go forward 10 sec
	- Normal Speed Shortkey: set the playback rate to 1
	- Speed up by .25x Shortkey: increase the rate by .25
	- Speed down by .25x Shortkey: decrease the rate by .25
	- Mute Shortkey: mute the player
	- Vol Up Shortkey: increase volume by 10/100
	- Vol Down Shortkey: decrease volume by 10/100
- **YouTube Demo**
- Note: this is for an older version of the extension with a slightly different functionality and UI. 
- [![timestamp](https://img.youtube.com/vi/ADJvhW31xj4/0.jpg)](https://www.youtube.com/watch?v=ADJvhW31xj4&ab_channel=ConnectedCognitionCrumbs)
	
# Known Issues with Shortcuts

## Shortcuts in mac 

I'm not a mac user, I've compiled this list based on feedback I received, this is why the language is uncertain; I have not tested them myself. Special thanks to [Abhay Prasanna](https://twitter.com/AbhayPrasanna) and [Jerome Wong](https://github.com/DarkArcZ).

- For mac users 'option' instead of 'alt' has worked. 
	- For example, you can replace 'alt+a n' with 'option+a n'
- I specific keyboard modes 'option+a' will generate 'å' in mac. You can read about it [here](https://en.wikipedia.org/wiki/Option_key#Alternative_keyboard_input).
	- It seems you can fix this by changing the keyboard Input Source to "Unicode Hex Input" from "ABC".
		1. Go to Keyboard on your Mac System Preferences
		1. Click on Input Sources on the top
		1. Press the "+" button and add "Unicode Hex Input"
		1. Go to where you pasted the code on roam
		1. Change the shortcut key to something else besides alt (cmd, option, ctrl)
		1. Restart Roam

## General notes

- To press 'alt+a n' you need to hold alt and a together for a fraction of a second (like when you press alt+tab to switch windows) and then RELEASE them and tap 'n'.
- Make sure that the perfix 'alt+a' ('option+a' in mac), is not already assigned and captured by other programs. 
	- Those programs can be installed on your operating system or be extensions in your browsers. 
	- If there is a conflict, you need to change the shortcut of either that program or YT extension.
- You can have 'alt+a+n' which means you need to hold all three buttons. 
	- Pros: It is harder to miss compare to 'alt+a n'.
	- Cons: You need to make sure that there is no conflict with both sub-sequence key combination, i.e., 'alt+a' and 'alt+n'.
	
