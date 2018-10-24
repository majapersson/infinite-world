<img src="https://media.giphy.com/media/Drs5pZfIZsZXi/giphy.gif" width="100%">

# A game

A final project before graduating.

## The idea

The core concept is a procedurally generated world that the player walks around in and explores.
More details and gameplay might be added along the way.

### Stuff to fix

#### Terrain

- [x] Generate random z values to create hills
- [x] Look up and implement Perlin/Simplex noise
- [ ] Generate terrain as a giant sphere, to avoid trouble with edges and adding new terrain
- [x] Return z value to player
- [ ] Generate some sort of environment

#### Player

- [x] Get y value from terrain
- [x] Keyboard movements
- [ ] First or third person view?

#### Camera

- [ ] Only render terrain in view

### Backlog

- Multiplayer support
- Endlessly generated world
- Some _actual_ gameplay

#### Changelog

### 2018-10-23

- Changed approach. Abandoned third person view and focused more on core concept.

### 2018-10-22

- Added raycasting, so that player movement is based on mouse movement
- Can't figure out the y-position of player

### 2018-10-21

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
