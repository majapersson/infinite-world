<img src="https://media.giphy.com/media/Drs5pZfIZsZXi/giphy.gif" width="100%">

# A game

A final project before graduating.

## The idea

The core concept is a procedurally generated world that the player can explore.
More details and gameplay might be added along the way.

### Priorities

#### Terrain

- [x] Generate random z values to create hills
- [x] Look up and implement Perlin/Simplex noise
- [x] Return z value to player
- [x] Randomize x and y values as well, to avoid grid feeling
- [x] Generate environment (flowers, trees, ponds)
  - [x] Randomize rotation, height and models of flowers and trees
  - [x] Add content not only to vertices
  - [ ] Create tree- and flower meshes, to cut down on rendering
  - [ ] Don't add stuff on top of each other
- [x] Create world class with global world functions
- [x] Generate nine terrain tiles
- [x] Calculate if tiles are too far away and should be removed
- [x] Generate new terrain tiles
- [ ] Smooth adding and removing of tiles (distance?)

#### Player

- [x] Get y value from terrain
- [x] Mouse movements through raycasting
- [x] Third person view
- [ ] Collision detection
- [ ] Find better sprite for player

#### Camera

- [ ] Only render terrain in view
- [x] Smooth chase cam

### Backlog

- Nicer colors and overall look
- Continuously generated world, or world as sphere
- Some _actual_ gameplay

### Changelog

##### 2018-11-07

- Refactored tiles into World object for global world functions and terrain calculations
- Calculated if tiles should be removed

##### 2018-11-05

- Ditched moving terrain, focusing on chunks/tiles instead

##### 2018-11-03

- Added basic terrain generation on movement

##### 2018-10-31

- Added shadows to trees
- Configured colors and randomization

##### 2018-10-30

- Basic randomized addition of trees and flowers to terrain based on vertex and simplex noise

##### 2018-10-29

- Decided on third person view and flat shaded art style for simplicity.
- Spent a lot of time trying to understand Blender. Finally managed to import 3D models.

##### 2018-10-24

- Tried out both first and third person controls, kept both for later decision.
- Tried out spheric world, but it got too complicated. Continuing with plane for now.

##### 2018-10-23

- Changed approach. Abandoned third person view and focused more on core concept.

##### 2018-10-22

- Added raycasting, so that player movement is based on mouse movement
- Can't figure out the y-position of player

##### 2018-10-21

- Started on player movement

##### 2018-10-18

- Sat the entire day trying to figure out why stuff would disappear behind terrain.
- Realized I need to rotate stuff using radians, not degrees. Problem fixed!

##### 2018-10-17

- Implemented simplex noise for natural randomness, started working on camera angles
- Added materials, lights and shadows

##### 2018-10-16

- Generated plane with random terrain, started researching Perlin/simplex noise

##### 2018-10-15

- Set up basic structure, started playing around in three.js
