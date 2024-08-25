# 🛳️ Battle Ship Game

**Battle Ship** is a simple multiplayer game built on the Cartesi Machine using Cartesi CLI and JavaScript. The objective is to strategically position your vessels and sink your opponent's fleet by guessing the correct coordinates.

---

## 📖 Table of Contents
- [Understanding the Game](#understanding-the-game)
- [🚀 Installation](#installation)
- [🕹️ Usage](#usage)
- [✨ Features](#features)
- [🔧 Handling User Actions](#handling-user-actions)
- [🤝 Contributing](#contributing)


---

## Understanding the Game

### Game Setup
1. **Enter the Game:**  
   Create a room or join an empty room to begin playing.
   
2. **Setup Your Tactics:**  
   Position your vessels on the grid (11x11) using the following format:

   ```javascript
   { startX: 0, startY: 1, direction: 'H' }, // battleship 1
   { startX: 4, startY: 10, direction: 'H' }, // battleship 2
   { startX: 6, startY: 6, direction: 'V' }, // submarine
   { startX: 8, startY: 8, direction: 'V' }, // destroyer
   { startX: 0, startY: 6, direction: 'V' }, // patrolBoat
   { startX: 10, startY: 0, direction: 'V' }, // patrolBoat
   { startX: 4, startY: 4, direction: 'V' }, // patrolBoat
   { startX: 8, startY: 1, direction: 'V' }, // cruiser
   { startX: 2, startY: 7, direction: 'H' }, // cruiser


# Battle Ship Game Documentation

## 🚀 Installation

This game is designed to run in a Docker environment, which will automatically handle the installation of dependencies.

### Steps to Set Up and Run the Game:

1. **Clone the Repository:**

2. **Build the Docker Image:**

    Ensure you are in the directory where the Dockerfile is located. 

    ```bash
    cartesi build
    ```

3. **Run the Game:**

    After the build is complete, run the game using:

    ```bash
    cartesi run
    ```

    This command will execute the game inside the Docker container, using the environment specified in the Dockerfile.

**Note:**

- **Docker Environment:** Ensure you have Docker installed and running on your machine.
- **INPUT VALUES:** Ensure that your input values are in this format ```bash "{\"method\":\"menuOption\",\"request\":1}"```, remember you are sending it through the cli. therefore the code has accounted for you to copy and past from your JSON to String. As in inputs through cli are auto convertes to string, and the data is already a string. therefore double Json.parse  in index.js line: 68

## 🕹️ Usage

1. Start the game using the command above.
2. Follow the on-screen prompts to create or join a room.
3. Set up your tactics as described in the "Understanding the Game" section.
4. Start playing by making your first move if you are the room owner, or wait for your opponent’s move.


## ✨ Features

- **Multiplayer Gameplay:** Battle against other players in real-time.
- **Strategic Positioning:** Arrange your vessels tactically on the grid.
- **Turn-based Combat:** Take turns to guess the position of the opponent’s fleet.

## 🔧 Handling User Actions

The game uses two main objects to manage user actions: `handleInspect` and `handleAdvance`. These objects map specific actions to their respective functions within the game, allowing for dynamic execution of various game-related tasks.

### handleInspect

This object is responsible for managing user actions related to inspecting or navigating through different menus:

- **HomeMenu:** Navigates to the home menu.
```bash
    ../inspect/HomeMenu
```
- **listGames:** Displays a list of available games.
```bash
    ../inspect/listGames
```

### handleAdvance

This object handles more advanced user actions related to the gameplay itself:
```javascript
    { method: <String> , request<T>: <T>}
```

- **menuOption:** Handles the selection of a menu option.
```javascript
    {request<T>: <Number>} 
```
- **setPlayerFleet:** Allows the player to set up their fleet on the grid.{example in code}
```javascript
    {request<T>: <List<JSON>>}
```
- **play:** Executes a move during the game.
```javascript
    {request<T>: <List<List<Number,Number>>>}
```
- **getNews:** Retrieves game-related news or updates.
```javascript
    {request<T>: <null>}
```
- **getFleet:** Fetches the current fleet configuration of the player.
```javascript
    {request<T>: <null>}
```
- **getGrid:** Retrieves the current state of the game grid.
```javascript
    {request<T>: <null>}
```
- **getMyShots:** Retrieves a list of the player's shots.
```javascript
    {request<T>: <null>}
```
- **getOpponentShot:** Retrieves a list of the opponent's shots.
```javascript
    {request<T>: <null>}
```
- **getDefaultFleet:** Returns the default fleet configuration.
```javascript
    {request<T>: <null>}
```


## 🤝 Contributing

We welcome contributions to improve the Battle Ship game! To contribute:

1. **Fork the repository** to create your own copy.
2. **Create a feature branch** (`git checkout -b feature-name`).
3. **Make your changes** and commit (`git commit -m "Your message"`).
4. **Push to your fork** (`git push origin feature-name`).
5. **Submit a pull request** with a description of your changes.

Your contributions help make the Battle Ship game better!
