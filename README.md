## To Do

### Development
- [X] Create repository, import in typescript, react, redux, firebase
- [X] Set up basic redux functionality
- [x] Set up linter, unit testing
- [ ] Install custom console
- [x] Update amputation deserialization portion to not hardcode body parts
- [ ] Broader tests - cross-module

### Milestone 0: Post publically a preview video - proof of concept, stripped MVP
- [x] Import API for pulling data - print into the screen
- [x] Load tshirt + underwear Nikki by default
- [x] Type in item ID to load clothes
- [x] Can delete currently worn items
- - [x] Putting in new item of category = replaces the item
- - - [x] Replace clothes ID
- - - [x] Update amputation data
- - [x] Enforce wearing one item at a time
- - [x] Enforce unable to remove hair when selecting the hair again
- [x] Load in clothes on top of Nikki (locally)
- - [x] Figure out item's depth
- - [x] Figure out item's displacement
- - [x] Load assets
- - [x] Debug: when screen is too narrow, big items are displaced
- [x] Display currently-worn items
- [x] Make Nikki draggable on all browsers
- [x] Load backgrounds
- [x] Create icon stylesheet, scripts for creating it

### Milestone 0.5: Getting this running online
- [x] Shop for options
- [x] Webhosting
- [x] Cloudflare
- [ ] Database
- [ ] Create search function - wear suit on searching up suit
- [ ] Download render button
- [ ] Update snapshots with height/width info
- [ ] Update search/itemID selection to not use onChange() - onSubmit() is enough
- [ ] Refactor to initialize everything in its own usecase instead of in App.tsx

### Milestone 1: Beta of newest suits
- [ ] Save items on reload (`localStorage`)
- [ ] When resizing screen smaller, update the x coordinates of images
- [ ] Create clothes selection panel - select items by category
- [ ] Undo / Redo
- [ ] Hide / delete worn items from the items panel
- [ ] Create beautiful UI: https://www.figma.com/proto/i9XDb7wiSGCd7lIuxlcs8q/Site?node-id=6%3A6
- [ ] Find out how to only upload changed files to API

### Milestone 2: Beta of newest suits + current wardrobe
- [ ] Invest in ways to reduce image theft (for Paper's sake, not mine)
- [ ] Upload wardrobe file - load into simulator
- [ ] Search function - lazy load on stop typing
- [ ] Search by ID (with category prefix)
- [ ] Search by ID (without category prefix)
- [ ] Search by item name
- [ ] Search by suit
- [ ] Undo / Redo
- [ ] Hide / delete worn items from the items panel
- [ ] Hide / delete backgrounds/characters from the layers panel
- [ ] Remove all button

### Milestone 3: Beta of full simulator functionality - make all clothes available
- [ ] Figure out how to provide this public service without screwing over Paper's artists/developers revenue
- [ ] Filters
- - [ ] Sort by new
- - [ ] Sort by rare(? - by LN's sort)
- - [ ] Sort by color
- - [ ] Sort by nation
- - [ ] Sort by tag (default Nikki tags for now)
- - [ ] Sort by posed(?)
- [ ] Auto update when the game uupdates
- [ ] Animations

### Milestone 3.5: Assets from other versions
- [ ] Localize UI
- [ ] Update presenters/etc to handle new languages
- [ ] Upload assets

### Milestone 4: Public beta of mobile functionality / Nikki DB Lite (API v2)
- [ ] Design API to build images without having to load all assets locally
- [ ] Design mobile site

### Milestone 5: Advanced account features - saving, favorites, social
- [ ] Save designed suits to account
- [ ] Favorite items
- [ ] Publicized most favorited items
- [ ] Social: allow people to post their creations for likes/views?

### Milestone 6: Advanced simulator
- [ ] Upload custom clothes
- - [ ] Allow custom clothes to be shared on site / users can favorite, save, etc
- [ ] Edit hue/saturation/color of clothes
- [ ] Starry Corridor functions: resize, move, flip, rotate
- [ ] Custom tags
