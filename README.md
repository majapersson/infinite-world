<img src="https://media.giphy.com/media/Drs5pZfIZsZXi/giphy.gif" width="100%">

# A game

A final project before graduating.

## The idea

I want to try building a game with a procedurally generated world which the player explores. It will be built using three.js. More gameplay will be added along the way, I hope.

### Stuff to fix

#### Terrain
- [x] Generate random z values to create hills
- [x] Look up and implement Perlin/Simplex noise
- [ ] Continuously add new terrain as the player moves
- [ ] Return z value to player

#### Player
- [ ] Raycast mouse position 
- [ ] Get z value from terrain
- [ ] Move player toward raycasted position

#### Camera
- [ ] Pan camera as player moves
- [ ] Only render terrain in view
- [ ] FOV increases as game progresses

### Backlog
- Multiplayer support
- Endlessly generated world
- Some _actual_ gameplay

#### Changelog

### 2018-10-23
- Added raycasting, so that player movement is based on mouse movement
- Can't figure out the y-position of player

### 2018-10-22
- Started on player movement

### 2018-10-18
- Sat the entire day trying to figure out why stuff would disappear behind terrain.
- Realized I need to rotate stuff using radians, not degrees. Problem fixed!

### 2018-10-17
- Implemented simplex noise for natural randomness, started working on camera angles
- Added materials, lights and shadows

### 2018-10-16
- Generated plane with random terrain, started researching Perlin/simplex noise

### 2018-10-15
- Set up basic structure, started playing around in three.js
