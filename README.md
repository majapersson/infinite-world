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
