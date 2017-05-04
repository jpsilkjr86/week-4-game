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

// object constructor for all characters
function charObj (name, divId, cssClass, // these 3 help the program identify & bind the objects to the DOM
	healthPoints, attackPower, apIncrease, // these 3 are base stats. AP and apIncrease are 0 before char is selected
	apAsPlayer, apAsEnemy, apIncrAsPlayer) {  // these 3 are assigned depending on if char is player or enemy

	this.name = name; // for convenience in getting the character's name
	this.divId = divId;  // corresponds to div on the DOM
	this.cssClass = cssClass; // corresponds to CSS styles
	this.healthPoints = healthPoints;  // same no matter if the char is a player or enemy
	this.attackPower = attackPower; // how much HP can the character inflict on another
	this.apIncrease = apIncrease;  // amount of attack power that increases each time the player attacks, initial = 0
	this.apAsPlayer = apAsPlayer; // attack power if character is selected as player
	this.apAsEnemy = apAsEnemy; // attack power if character is selected as enemy
	this.apIncrAsPlayer = apIncrAsPlayer; // attack power increase amount if character is selected as player
}

// adds method to objects of charObj type called attack() which takes enemyHP argument
charObj.prototype.attack = function(defender) {
	defender.healthPoints -= this.attackPower;  
	this.attackPower += this.apIncrease;  // Attack value increases each time. If char is an enemy, then incr = 0.
	return defender;
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
	console.log(this.name, "HP:", this.healthPoints, 
		"AP:", this.attackPower, "Incr:", this.apIncrease);
}

// Global object declarations, as new instances of each object type. These are essentially a library of 
// available players and objects, which will ultimately be determined when user chooses his/her player
// character.

var allChars = [];

var redChar = new charObj("Red", "red", "character", 100, 0, 0, 10, 15, 5);
var blueChar = new charObj("Blue", "blue", "character", 120, 0, 0, 8, 12, 7);
var yellowChar = new charObj("Yellow", "yellow", "character", 140, 0, 0, 20, 40, 5);
var greenChar = new charObj("Green", "green", "character", 60, 0, 0, 5, 10, 20);

// push player objects into an array	// push enemy objects into an array
allChars.push(redChar);
allChars.push(blueChar);
allChars.push(yellowChar);
allChars.push(greenChar);


// GLOBAL VARIABLES

var attackButton = '<button type="button" id="attackbtn" class="btn btn-danger">Attack!</button><br/>';


// GLOBAL METHOD DECLARATIONS

// populates character div's inside a given space on the DOM according to .divId and .cssClass properties
// of each character object in the provided array.
function printCharMenu(spaceId, ary) {
	jQuery.each(ary, function(i){
		$(spaceId).append('<div id="' + ary[i].divId + 
			'" class="' + ary[i].cssClass + '"></div>');
	});
}

// clears a character according to its divId
function clearChar(char) {
	$("#" + char.divId).remove();
}

// moves character object's div to a new space on the DOM
function moveCharTo(char, destination) {
	$("#" + char.divId).remove(); // removes div from current location, if any on screen
	$(destination).append('<div id="' + char.divId + '" class="' + char.cssClass + '"></div>');
}

// moves array of object div's to a new space on the DOM
function moveCharAryTo(ary, destination) {
	jQuery.each(ary, function(i){
		$("#" + ary[i].divId).remove(); // removes div from current location, if any on screen
		$(destination).append('<div id="' + ary[i].divId + '" class="' + ary[i].cssClass + '"></div>');
	});
}

// Uses divId argument to get the correct player object from the allChars array according to allChars[i].divId, 
// returns the matching object element.		
function getPlayerObj (argId) {
	var gotObj;
	jQuery.each(allChars, function(i){
		if (argId === allChars[i].divId)
		{ gotObj = allChars[i]; }				
	});
	return gotObj;  // jQuery wouldn't let me put the return inside the for-loop! Has to do with semicolon i think
}

function getEnemyCharIds (playerDivId) {
	var enemyAry = [];
	// loop pushes each id not equal to the playerDivId into enemyCharIdAry, 
	// thus determining the div id's of the enemies
	$(".character[id!=" + playerDivId + "]").each(function(){
		var enemyId = $(this).attr("id");
		enemyAry.push(enemyId);
	});
	return enemyAry;
}

function getEnemyCharObjs (idAry) {
	var objAry = [];
	// checks each element of idAry[k] + "Enemy" against .divId properties of each element of allChars[j] array
	// in order to populate the list of enemy objects, using two for-loops.
	jQuery.each(allChars, function(j){
		jQuery.each(idAry, function(k){
			if (idAry[k] === allChars[j].divId) 
			 { objAry.push(allChars[j]); }	
		});							
	});
	return objAry;
}

function addCssToObj (obj, className) {
	obj.cssClass += (" " + className);
	return obj;
}

function addCssToObjAry (ary, className) {
	jQuery.each(ary, function(i){
		ary[i].cssClass += (" " + className);
	});
	return ary;
}

function getIndexByDivId (id, ary) {
	var index;
	jQuery.each(ary, function(j){
		if (ary[j].divId === id)
		{ index = j; }
	});
	return index;
}

function addBtn(btnName, spaceId) {
	$(spaceId).append(btnName);
}

function removeBtn(btnId) {
	$(btnId).remove();
}
	

// MAIN GAME FUNCTIONS

$(document).ready(function(){

	startScreen(); // initial function call to start the game!

	function startScreen(){
		
		// Populates the charSelectSpace with the menu of character div's upon startScreen() function call
		printCharMenu("#charSelectSpace", allChars);

		// Activates click event listener
		$(".character").on("click", function(){
			
			// sets selectedCharId equal to the id of the clicked .character div 
			var selectedCharId = $(this).attr("id"); 
			
			// gets the selected character object according to the div id clicked (i.e. the player object)
			var selectedCharObj = getPlayerObj(selectedCharId);

			// gets enemy character div id's
			var enemyCharIdAry = getEnemyCharIds(selectedCharId);

			// gets array of enemy character objects according to the div id's of the enemies
			var enemyCharObjAry = getEnemyCharObjs(enemyCharIdAry);

			gameOn(selectedCharObj, enemyCharObjAry); // Calls game function, sends player and enemy objects.
		});
	} // end start screen function

	function gameOn(player, enemyAry){
		
		// Adds ".player" and ".enemy" CSS classes for styling
		player = addCssToObj(player, "player");
		enemyAry = addCssToObjAry(enemyAry, "enemy");
		
		// moves characters to designated spaces
		moveCharTo(player, "#yourCharSpace");
		moveCharAryTo(enemyAry, "#enemiesSpace");

		// sets initial stats for player and enemy.
		player.setInitialStats("player");
		jQuery.each(enemyAry, function(i){
			enemyAry[i].setInitialStats("enemy");
		});

		// prints stats
		player.printStats();
		jQuery.each(enemyAry, function(i){
			enemyAry[i].printStats();
		});

		// Calls enemySelect function
		enemySelect();

		function enemySelect() {
			
			if (enemyAry.length === 0) {
				console.log("Great job! All enemies have been defeated. You beat the game!")
			}

			else {
				// Activates event listener for selecting enemy
				$(".enemy").on("click", function(){
					
					// test code
					var selectedEnemyId = $(this).attr('id');

					console.log("Selected Enemy:", selectedEnemyId);

					var selectedEnemyIndex = getIndexByDivId(selectedEnemyId, enemyAry);

					// calls fightMode, sends the index of the selected enemy
					fightMode(selectedEnemyIndex);

					$("div.enemy").off("click"); // removes click event listener for all enemy div's.
				});
			}
		} // end enemySelect() function
		
		function fightMode(defIndex) {
			
			var def = enemyAry[defIndex]; // def is the defender, i.e. the enemy selected from enemySelect()

			// defIndex stands for "index of defender", i.e. the index of the enemy the user is attacking
			console.log("You, " + player.name + ", are fighting " + def.name);
			
			addBtn(attackButton, "#defenderSpace");

			moveCharTo (def, "#defenderSpace");
			// printOneChar("#defenderSpace", enemyAry[defIndex]);

			$("#attackbtn").on("click", function(){

				// Here are the attack methods:
				def = player.attack(def); // player attacks def, returns def with reduced HP.

				player = def.attack(player); // defender attacks player, returns player with reduced HP.

				player.printStats();
				def.printStats();

				// if player dies
				if (player.healthPoints <= 0) {
					removeBtn("#attackbtn");
					clearChar(player);
					console.log("Game Over. Your HP is now " + player.healthPoints + ". You Lose.");
				}

				// if player defeats the enemy
				else if (def.healthPoints <= 0) {
					removeBtn("#attackbtn");
					clearChar(def);
					console.log("Enemy " + def.name + " has been defeated. Good job!");
					
					// removes defeated enemy from enemyAry
					enemyAry.splice(defIndex, 1);

					// prints stats
					player.printStats();
					jQuery.each(enemyAry, function(i){
						enemyAry[i].printStats();
					});

					// passes ball back to enemySelect
					enemySelect();
				}

			}); // end attackbtn event listener
			
		} // end fightMode() function

	} // end gameOn() function

}); // end Document Ready

	// might not be necessary
	// var startScreenState = true;
	// var gameOnState = false;
	// var gameOverState = false;