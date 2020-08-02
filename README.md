# SHIELD OF AIUR

### What is Shield of Aiur?

Shield of Aiur is my personal codebase for the strategy game [Screeps](http://screeps.com/). Screeps is a massively-multiplayer online game where players gather resources and battle each other by writing AIs in Javascript that run every few seconds. Literally every action is completed programatically, from recognizing enemy attackers, to selecting optimal sites to build structures, to delivering specific orders to each individual creeps. The name "Shield of Aiur" was inspired by the most well-known publicly available Screeps codebase, [Overmind](https://github.com/bencbartlett/Overmind).

### How does Shield of Aiur work?

Screeps functions by running `main.js` in the root directory [each 'tick' of game time](https://status.screeps.com); all of a player's code must ultimately be called from this file. Shield of Aiur takes a top-down, object-oriented approach to the game:

1. Setup accesses memory, populates data structures, and adds custom methods to pre-existing classes.

2. Controllers for each sector of gameplay (defense, resource harvesting, creep creation, etc.) analyze the state of their sector and dispatch orders to individual creeps and structures.

3. Cleanup and logging functions to prepare information for the next tick.


### How do I install Shield of Aiur?

Shield of Aiur is developed using [screeps-remote](https://www.npmjs.com/package/screeps-remote). After cloning the project and running `npm install` to install screeps-remote, follow the linked instructions to configure it to your Screeps installation. From that point on you can update your local Screeps build in real time by changing the linked files in the code editor of your choice.