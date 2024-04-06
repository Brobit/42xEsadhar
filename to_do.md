to do :

- [ ] implement the machanic of dash
- [ ] implement the camera changement direction with the right & left arrow
- [ ] implement the changement of level with the up & dowm arrow
- [ ] make cube ennemy ( 3 - 5 alive in the same time )
- [ ] make them constantly lookAt the cube and make them move
- [ ] fix them when there is a collision between the cube and the ennemy,
  but the ennemy cube is fix if the speed of the cube is greater than
  the initial speed of the cube, in fact, fix the ennemy cube if the 
  cube is in a dash action/movment
  maybe do a boolean that tell if the player is in a dash or not
- [ ] handle another keyboard layout , azerty for example
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
  - a credit button
- create the tuto / command page
- create the credit page
- implement them in the project
- allow the player to click on play only if the canva is loaded

bonus :

- make the cube glide a little, to not stop directly when the user stop the movment
- implement vertical axes
- implement a button to change from horizontal axes to vertical axes

bug :

- movment doesn't stop sometimes and the cube continue to move , cause :
    moving while using the gui to display and undisplay the 3d asset and click in the checkbox
    doesn't reset your input and you keep going in a certain direction, bug might not be in prod
    so no worries
