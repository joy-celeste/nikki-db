## To Do

### Milestone 0: Post publically a preview video - proof of concept, stripped MVP
- [X] Create repository, import in typescript, react, redux, firebase
- [X] Set up basic redux functionality
- [ ] Import API for pulling data - print into the screen
- [ ] Type in item ID to load image (locally-hosted images)
- - [ ] Putting in new item of category = replaces the item
- - [ ] Display currently-worn items
- [ ] Search by ID (with category prefix)
- [ ] Load items on top of Nikki
- [ ] Make Nikki draggable
- [ ] Load backgrounds
- [ ] Save items on reload (`localStorage`)

### Milestone 1: Beta of newest suits
- [ ] Create clothes selection panel - select items by category
- [ ] Create icon stylesheet, scripts for creating it
- [ ] Undo / Redo
- [ ] Hide / delete worn items from the items panel
- [ ] Selectable background base color (#fff, #000, etc)
- [ ] Host images (assets/icons/backgrounds) on Cloudflare
- [ ] Create beautiful UI: https://www.figma.com/proto/i9XDb7wiSGCd7lIuxlcs8q/Site?node-id=6%3A6
- [ ] Find out how to only upload changed files to API

### Milestone 2: Beta of newest suits + current wardrobe
- [ ] Shrink images hosted on CloudFlare? Invest in ways to lower bandwidth use
- [ ] Upload wardrobe file - load into simulator
- [ ] Create search function - lazy load on stop typing
- [ ] Search by ID (with category prefix)
- [ ] Search by ID (without category prefix)
- [ ] Search by item name
- [ ] Search by suit
- [ ] Undo / Redo
- [ ] Hide / delete worn items from the items panel
- [ ] Hide / delete backgrounds/characters from the layers panel
- [ ] Download button

### Milestone 3: Beta of full simulator functionality - make all clothes available
- [ ] Figure out how to provide this public service without screwing over Paper's artists/developers revenue
- [ ] Filters
- - [ ] Sort by new
- - [ ] Sort by rare(? - by LN's sort)
- - [ ] Sort by color
- - [ ] Sort by nation
- - [ ] Sort by tag (default Nikki tags for now)
- - [ ] Sort by posed(?)

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
- [ ] Custom tags

---------

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
