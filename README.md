# vessel-management-tool

General features
* Responsive design
* High optimization
* High Usability
* Google Maps Integration
* Visual interaction (Drag & Drop Elements: Sliders, markers)
* Visual Animation

#### Dashboard

![Dashboard](https://raw.githubusercontent.com/AngelR84/vessel-management-tool/master/images/dashboard.png)

Features:
* Global View
* Clicking the markers to open edit form

#### Vessel List

![Vessel List](https://raw.githubusercontent.com/AngelR84/vessel-management-tool/master/images/list.png)

Features:
* Fast identification (map image)
* Clicking the row to open edit form 
* Removing vessel pressing "X" button
* Creating new Vessel pressing "New Vessel" button

#### Vessel Edit Interface

![Vessel Edit](https://raw.githubusercontent.com/AngelR84/vessel-management-tool/master/images/item.png)

Features:
* Fast editting parametter with sliders
* Dragable marker to update location
* Removing vessel pressing "remove" button
* Doble funcionality: Creating & updating with same controller and view.

## Technologies & Libraries 

BackEnd

* Node.js
* Express.js
* Mongosse.js
* bodyParser
* MongoDB

FrontEnd

* Angular JS
* Angular Material
* Angular Google Maps

# Installation Process

### Mongo DB Installation

Install Brew
```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
Update Repository
```bash
brew update
```
Install Mongo DB
```bash
brew install mongodb
```
Run the database in background
```bash
sudo mongod &
```

### Server Installation

Install Node.js
```bash
  Follow the instructions at https://nodejs.org/
```
Run Server:
```bash
node server.js
```

App URL:
```bash
http://localhost:3000/
```
