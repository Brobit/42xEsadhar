# 42xEsadhar

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server
npm run dev

```

30 day left - 
10 things to do - 
1 things to correct - 
3 bonus to implement

## To do

- [x] implement the machanic of dash
- [x] implement the camera changement direction with the right & left arrow
- [x] implement the changement of control when rotate
- [x] implement the changement of level with the up & down arrow
- [x] make cube ennemy ( 3 - 5 alive in the same time )
- [x] make them constantly lookAt the cube and make them move
- [x] fix them when there is a collision between the cube and the ennemy,
  but the ennemy cube is fix if the speed of the cube is greater than
  the initial speed of the cube, in fact, fix the ennemy cube if the 
  cube is in a dash action/movement
  maybe do a boolean that tell if the player is in a dash or not
- [x] handle another keyboard layout , azerty for example
- [ ] find a way to slice the gbl model in 2x2x2 cube and if possible store all the 
  2x2x2 cube in an array where you store :
  - the 8 cube that compose the 2x2x2 cube that is going to be displayed
  - the position of the 8 cube that compose the 2x2x2 cube
  - maybe the position where the cannon.box needs to be
  - maybe the cannon.box, but it is maybe a lot of 3d component to create
    the browser and maybe it's going to be hard to support for the device
- [ ] display only a cube of 2x2x2 of the glb model
- [ ] make a box in cannon.js when the cube of 2x2x2 is display
- [ ] display the cube of 2x2x2 of the gbl model when the ennemy cube is fixed
  and at the position where the cube was fixed
- [ ] try with different 3d asset and try to generalize the slicing and all the rest
- [ ] add an another page with a menu, it must have :
  - [ ] a play button 
  - [ ] a tuto / command button 
  - [ ] a credit button
- [ ] create the tuto / command page
- [ ] create the credit page
- [ ] implement them in the project
- [ ] allow the player to click on play only if the canva is loaded

bonus :

- [ ] make the cube glide a little, to not stop directly when the user stop the movement
- [ ] implement vertical axes
- [ ] implement a button to change from horizontal axes to vertical axes

to correct :
- [x] put a cooldown on the dash, like 2 second and if you dash and kill an ennemy,
    there is no cooldown
- [x] put a cooldown on the camera chamgement
- [x] put a cooldown on the level changement
- [ ] make an annimation on the camera movement with gsap
- [x] implement the respawn of the ennemy

bug :

- movement doesn't stop sometimes and the cube continue to move , cause :
    moving while using the gui to display and undisplay the 3d asset and click in the checkbox
    doesn't reset your input and you keep going in a certain direction, bug might not be in prod
    so no worries
