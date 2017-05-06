// ********************************************* PSEUDO-CODE *********************************************
/* 
STEPS:
	1) Get select character function to work
		a) when player clicks on character picture...
			i) chosen character moves into player div
			ii) other characters move into enemy div
		b) disable clicking event
	2) Declare objects for each character (use object constructors)
		a) properties include HP, attack power, userAttack(), enemyAttack()
		b) property values differ depending on if the character is the main character or the enemies
		c) therefore, 2 objects should be defined for each character: 
			i) one is when the character is the user-controlled main character
			ii) the other is when the character is the computer-controlled enemy
			iii) HP is the same, attack power function is different
		d) the on-click event above should trigger such object declarations to occur.
		To accomplish this:
			i) each character picture has an id with their name
			ii) if the id is selected, program declares user as that character as main character
			iii) the other characters not selected become declared as the enemy versions
	3) Get enemy select function to work
		a) when enemy is clicked, move him/her to defender area
		b) fight function starts
	4) Fight function
		a) First, listen for user to click attack, then call user attack function:
			i) HP is deducted from enemy, starting from base
			ii) attack power increments by set amount (like += 8)
			iii) call enemey attack function
		b) Enemy attack function:
			i) HP is deducted from user character
			ii) no attack power increments
			iii) call user attack function to listen to user click
		c) Repeat by calling user and enemy attack functions back and forth till one dies
		d) if enemy dies, remove enemy from game
		e) if user character dies, display game over, click button to restart
	5) Get 3 and 4 to repeat until either user kills all enemies or until user's HP reaches 0
	6) Restart function
		a) display game over, and clickable button which can restart the game
		b) when button is clicked, clear all values (or refresh page?)
		c) return to start screen state

GAME STATES:
	1) Start screen state:
		-user can only choose a player character
	2) Game On state
		a) Choose enemy state
			-user can only choose an enemy to fight
		b) Fight state
			-user can only click the attack button
	3) Game Over state
		-user can only click the restart game button

PSEUDO-CODE:

	Declare global object variables for each character.
		-Each character is set as an object with certain stats.
			*By default, the HP is the same whether the character is an enemy or a player.
			*The attack power and attack power increase amount is set intitially to zero.
			*If the character is chosen as the player, then the attack power will be lower but will have 
			an attack power increase amount greater than zero.
			*If the character is an enemy, then the attack power is set higher but will not increase in the game.
		-When user selects player character, it will send the objects as parameters, and game function will 
		redeclare a new object instance of player and enemies as new local objects


	if startScreenState === true
		event listener: click on character
			call gameOn function, send id [$(this).attr('id')] as parameter. id name matches object name.

	if gameOnState === true

		if chooseEnemyState === true

		if fightState === true

		if gameOverState === true

	if gameOverState === true

*/

// ********************************************* GLOBAL OBJECTS *********************************************
// object constructor for all characters
function charObj (name, domId, domClass, // these 3 help the program identify & bind the objects to the DOM
	healthPoints, attackPower, apIncrease, // these 3 are base stats. AP and apIncrease are 0 before char is selected
	apAsPlayer, apAsEnemy, apIncrAsPlayer) {  // these 3 are assigned depending on if char is player or enemy

	this.name = name; // for convenience in getting the character's name
	this.domId = domId;  // corresponds to id on the DOM, helping bind the object to the DOM
	this.domClass = domClass; // corresponds to its class on the DOM, for jQuery selecting and CSS styling
	this.healthPoints = healthPoints;  // same no matter if the char is a player or enemy
	this.attackPower = attackPower; // how much HP can the character inflict on another
	this.apIncrease = apIncrease;  // amount of attack power that increases each time the player attacks, initial = 0
	this.apAsPlayer = apAsPlayer; // attack power if character is selected as player
	this.apAsEnemy = apAsEnemy; // attack power if character is selected as enemy
	this.apIncrAsPlayer = apIncrAsPlayer; // attack power increase amount if character is selected as player
}

// adds method to objects of charObj type called attack() which takes the opponent's object argument.
charObj.prototype.attack = function(opponent) {
	opponent.healthPoints -= this.attackPower;
	$("#fight-stats").append(this.name + " has inflicted " +   // prints stats on the screen.
		this.attackPower + " points of damage on " + opponent.name + ".<br/>");
	this.attackPower += this.apIncrease;  // Attack value increases each time. If char is an enemy, then incr = 0.
	return opponent;
}

// adds method to objects of charObj type called setInitialStats() which sets stats according to whether the 
// character is a player or an enemy.
charObj.prototype.setInitialStats = function(str) {
	if (str === "player") {
		this.name = "Player " + this.name; // adds the title "Player" before the character's name.
		this.attackPower = this.apAsPlayer;
		this.apIncrease = this.apIncrAsPlayer;
	}

	if (str === "enemy") {
		this.name = "Enemy " + this.name;
		this.attackPower = this.apAsEnemy;
		this.apIncrease = 0; // increase amount is always zero for enemy characters.
	}
}

charObj.prototype.printStats = function() {
	var charStats = (this.name + "'s Stats:<br/>HP: " + this.healthPoints + 
		"&nbsp;&nbsp;&nbsp;Attack Power: " + this.attackPower + 
		"&nbsp;&nbsp;&nbsp;Attack Power Increase: " + this.apIncrease + "<br/>");
	$("#char-stats").append(charStats);
}

charObj.prototype.removeChar = function() {
	$("#" + this.domId).remove();
}

// Global object declarations, as new instances of each object type. These are essentially a library of 
// available players and objects, which will ultimately be determined when user chooses his/her player
// character.

var allChars = [];

var redChar = new charObj("Red", "red", "character", 125, 0, 0, 20, 25, 10);
var blueChar = new charObj("Blue", "blue", "character", 110, 0, 0, 10, 20, 15);
var yellowChar = new charObj("Yellow", "yellow", "character", 150, 0, 0, 25, 30, 3);
var greenChar = new charObj("Green", "green", "character", 80, 0, 0, 5, 15, 30);

allChars.push(redChar);
allChars.push(blueChar);
allChars.push(yellowChar);
allChars.push(greenChar);


// ******************************************* GLOBAL VARIABLES *******************************************

var attackButton = '<div id="attackbtn-div"><button type="button" id="attackbtn" class="btn btn-danger">Attack!</button></div>';
var playAgainButton = '<div id="playagainbtn-div"><br/><button type="button" id="playagainbtn" class="btn btn-warning btn-lg">Click here to play again!</button></div>';
var startIntro = '<div id="startintro-div"><button type="button" id="startintro" class="btn btn-warning">Start Intro!</button></div>';

// ************************************** GLOBAL METHOD DECLARATIONS **************************************

// populates character div's inside a given space on the DOM according to .domId and .domClass properties
// of the character object.
function printChar(spaceId, char) {
	// prints char in given space id on the DOM and assigns domId and domClass property values.
	$(spaceId).append('<div id="' + char.domId + 
		'" class="' + char.domClass + '"></div>');
	// binds char object data to the element. data key is the same as the domId for that character.
	$("#" + char.domId).data(char); 												 
}

// populates character div's inside a given space on the DOM according to .domId and .domClass properties
// of each character object in the provided array.
function printCharAry(spaceId, ary) {
	jQuery.each(ary, function(i){
		// prints char in given space id on the DOM and assigns domId and domClass property values.
		$(spaceId).append('<div id="' + ary[i].domId + 
			'" class="' + ary[i].domClass + '"></div>');
		// binds char object data to the element. data key is the same as the domId for that character.
		$("#" + ary[i].domId).data(ary[i]); 
	});													 
}

// moves character object's div to a new space on the DOM
function moveCharTo(char, destination) {
	$("#" + char.domId).detach().appendTo(destination);
}

// Adds a DOM class to an object argument and returns it.
function addClassToObj (obj, className) {
	obj.domClass += (" " + className);
	return obj;
}

// Adds a DOM class to each object element of an array and returns the array.
function addClassToObjAry (ary, className) {
	jQuery.each(ary, function(i){
		ary[i].domClass += (" " + className);
	});
	return ary;
}

// adds a designated button. See button variables above for list of available buttons.
function addBtn(btnName, spaceId) {
	$(spaceId).append(btnName);
}

// removes a button according to its id on the DOM
function removeBtn(btnId) {
	$(btnId + "-div").remove();
}

// prints instructions to #instructions-msg on DOM
function printMessage(msg) {
	$("#instructions-msg").text(msg);
}

// prints a section header on the DOM
function printSectionHeader (loc, txt) {
	$(loc).text(txt);
}

// clears the html for a given text ID on the DOM
function clearText (txtId) {
	$(txtId).empty();
}

function audioControl(instruction) {
	var aud = $("#starwars-intro");
	
	if (instruction === "play")
	{aud.trigger("play");}

	// This not only pauses the sound bite but also resets the time so it won't resume on a later function call.
	if (instruction === "stop") 
	{aud.trigger("pause");}		
}
	

// ***************************************** MAIN GAME FUNCTIONS *****************************************

$(document).ready(function(){

	// $("body").load(function(){
	// 	$("#jumbotext-div").html("Star<br>Wars RPG");
	// 	$("#jumbotext-div").animate({
	// 		height: "-=1%",
	// 		width: "-=1%",
	// 		fontSize: "-=10px"
	// 	}, "10000");
	// }); 
	

	audioControl("play");
	startScreen(); // initial function call to start the game!

	function startScreen(){
		
		// Populates the charselect-space with the menu of character div's upon startScreen() function call
		printMessage("Select a character!");
		printSectionHeader("#charselect-header", "Characters:");
		printCharAry("#charselect-space", allChars);

		// Activates click event listener
		$(".character").on("click", function(){

			// grabs the data of the selected element, which is equal to the character object.
			var selectedCharObj = $(this).data();

			// makes a deep copy of the selected char object so that the original global object's 
			// data won't be changed during the game program.
			var selectedCharCopy = jQuery.extend(true, {}, selectedCharObj);

			// gets enemy character objects by deduction
			var notPlayerId = ".character[id!=" + selectedCharObj.domId + "]";
			var enemyCharObjAry = [];
			$(notPlayerId).each(function(){
				var enemyCharObj = $(this).data();
				enemyCharObjAry.push(enemyCharObj);
			});

			// makes a deep copy of each enemy char object and pushes each one onto an array
			var enemyCharCopyAry = [];
			jQuery.each(enemyCharObjAry, function(i){
				var enemyCharCopy = enemyCharObjAry[i];
				enemyCharCopyAry.push(enemyCharCopy);
			});

			// removes text, character DOM elements and their object data (not 
			// their copies) from the menu
			clearText("#charselect-header");
			jQuery.each(allChars, function(i){
				$("#" + allChars[i].domId).remove();
			});

			// Calls game function, sends copied objects of player and enemy characters (no DOM
			// element is binding them yet)
			gameOn(selectedCharCopy, enemyCharCopyAry); 
		});
	} // end start screen function

	// function gameOn receives objects "player" and "enemyAry" from startScreen as arguments
	function gameOn(player, enemyAry){
		
		// prints section headers and instructions on DOM
		printMessage("Choose an enemy to fight!");
		printSectionHeader("#yourchar-header", "Your Character:");
		printSectionHeader("#enemies-header", "Your Enemies:");

		// Adds ".player" / ".enemy" classes for CSS styling & for event listeners to work later on.
		player = addClassToObj(player, "player");
		enemyAry = addClassToObjAry(enemyAry, "enemy");
		
		// prints characters to designated spaces and assigns char object data to their DOM elements
		printChar("#yourchar-space", player);
		printCharAry("#enemies-space", enemyAry);

		// reassigns player and enemyAry[] elements so that they reference their 
		// DOM element data directly. This binds the character stats to the DOM element
		// so that DOM elements retain all character data no matter where they move to
		// as the game progresses.
		player = $("#" + player.domId).data();
		jQuery.each(enemyAry, function(i) {
			enemyAry[i] = $("#" + enemyAry[i].domId).data();
		});

		// sets initial stats for player and enemy.
		player.setInitialStats("player");
		jQuery.each(enemyAry, function(i){
			enemyAry[i].setInitialStats("enemy");
		});

		// prints stats for the player
		player.printStats();

		// Calls enemySelect function
		enemySelect();

		function enemySelect() {
			
			// If there are no more enemies left
			if (enemyAry.length === 0) {
				gameOver(true);
			}

			else {
				// Activates event listener for selecting enemy
				$(".enemy").on("click", function(){
					// gets reference to selected enemy's object data
					var selectedEnemy = $(this).data();

					// calls fightMode, sends a reference to the enemy object
					fightMode(selectedEnemy);

					$("div.enemy").off("click"); // removes click event listener for all enemy div's.
				});
			}
		} // end enemySelect() function
		
		// function fightMode receives "def" (defender enemy) as an argument, carries out fight code
		function fightMode(def) {
			// prints instructions and section heading on the DOM
			printMessage("Press the Attack! button when you're ready to fight!");
			printSectionHeader("#defender-header", "Defender:");

			// prints player and defender's stats
			clearText("#char-stats");
			player.printStats();
			def.printStats();
			
			addBtn(attackButton, "#defender-space");

			moveCharTo(def, "#defender-space");

			// when the attack button is clicked
			$("#attackbtn").on("click", function(){
				// clears the fight-stats message board in case there is any text there
				clearText("#fight-stats");

				// player attacks def, returns def with reduced HP.
				def = player.attack(def); 
				
				// if the defender is still alive
				if (def.healthPoints > 0) {
					// defender attacks player, returns player with reduced HP.
					player = def.attack(player); 
					// this condition ensures that the enemy doesn't somehow strike 
					// back while already dead.
				}

				// prints updated stats for both characters
				clearText("#char-stats");
				player.printStats();
				def.printStats();

				// if player dies
				if (player.healthPoints <= 0) {
					removeBtn("#attackbtn"); // removes attack button
					player.removeChar(); // removes the character from the DOM and bound data
					clearText("#yourchar-header"); 
					gameOver(false);
				}

				// if player defeats the enemy
				else if (def.healthPoints <= 0) {
					removeBtn("#attackbtn");
					def.removeChar();
					clearText("#defender-header");
					printMessage(def.name + " has been defeated. Good job!");
					
					// removes defeated enemy from enemyAry
					var defIndex = jQuery.inArray(def, enemyAry);
					enemyAry.splice(defIndex, 1);

					// passes ball back to enemySelect
					enemySelect();
				}
			}); // end attackbtn event listener			
		} // end fightMode() function

		// Controls the gameOver display and restart functionality
		function gameOver(youWon) {
			if (youWon) 
			{ printMessage("Great job! All enemies have been defeated. You beat the game!"); }
			else 
			{ printMessage("Game over. You Lose."); }

			addBtn(playAgainButton, "#instructions-msg");

			$("#playagainbtn").on("click", function(){
				// remove characters depending on who's left 
				if (youWon) 
				{ player.removeChar(); }
				else { 
					jQuery.each(enemyAry, function(i){
						enemyAry[i].removeChar();
					});
				}
				clearText("h2");
				clearText("h4");
				removeBtn("#playagainbtn");
				startScreen();
			});
		}

	} // end gameOn() function

		


	// checks stats in console log for error checking purposes
	$(document).keypress(function(e){
		
		audioControl("stop");

		if (e.key === 'q') {
			var text = "";
			jQuery.each(allChars, function(i){
				for (var k in allChars[i]){
					if (k==="attack") {break;}
					else {
					text += allChars[i][k] + " ";}
				}
			});
			console.log(text);
			
			// for (var k in allChars[0]) 
			// 	{console.log(`allChars[0].${k} = ${allChars[0][k]}`);}
			
		}
	})
}); // end Document Ready