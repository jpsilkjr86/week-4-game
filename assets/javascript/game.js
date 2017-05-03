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
function charObj (divId, name, healthPoints, attackPower, apIncrease, apAsPlayer, apAsEnemy, apIncrAsPlayer) {
	this.divId = divId;
	this.name = name;
	this.healthPoints = healthPoints;
	this.attackPower = attackPower;
	this.apIncrease = apIncrease;  // amount of attack power that increases each time the player attacks, initial = 0
	this.apAsPlayer = apAsPlayer; // attack power if character is selected as player
	this.apAsEnemy = apAsEnemy; // attack power if character is selected as enemy
	this.apIncrAsPlayer = apIncrAsPlayer; // attack power increase amount if character is selected as player
}

// add method to charObj called playerAttack() which takes enemyHP argument
charObj.prototype.attack = function(otherCharHP) {
	otherCharHP -= this.attackPower;  
	this.attackPower += this.apIncrease;  // Attack value increases each time. If char is an enemy, then incr = 0.
	return otherCharHP;
}

// Global object declarations, as new instances of each object type. These are essentially a library of 
// available players and objects, which will ultimately be determined when user chooses his/her player
// character.

var allChars = [];

var redChar = new charObj("red", "red", 100, 0, 0, 10, 15, 5);
var blueChar = new charObj("blue", "blue", 120, 0, 0, 8, 12, 7);
var yellowChar = new charObj("yellow", "yellow", 140, 0, 0, 20, 40, 1);
var greenChar = new charObj("green", "green", 60, 0, 0, 5, 10, 20);

// push player objects into an array	// push enemy objects into an array
allChars.push(redChar);
allChars.push(blueChar);
allChars.push(yellowChar);
allChars.push(greenChar);

var charDivIdMenu = ["red", "blue", "yellow", "green"]; // correspond to div id's


// GLOBAL METHOD DECLARATIONS

// populates character div's on #charSelectSpace on the DOM
function populateCharDivs() {
	jQuery.each(charDivIdMenu, function(i){
		$("#charSelectSpace").append('<div id="' + charDivIdMenu[i] + '" class="characters-div"></div>');
	});
}

// Uses divId argument to get the correct player object from the allChars array according to allChars[i].name, 
// returns the matching object element.		
function getPlayerObj (divId) {
	var gotObj;
	jQuery.each(allChars, function(i){
		if (divId === allChars[i].name)
		{ gotObj = allChars[i]; }				
	});
	return gotObj;  // jQuery wouldn't let me put the return inside the for-loop! Has to do with semicolon i think
}

function getEnemyCharIds (playerDivId) {
	var enemyAry = [];
	// loop pushes each id not equal to the playerDivId into enemyCharIdAry, 
	// thus determining the div id's of the enemies
	$(".characters-div[id!=" + playerDivId + "]").each(function(){
		var enemyId = $(this).attr("id");
		enemyAry.push(enemyId);
	});
	return enemyAry;
}

function getEnemyCharObjs (idAry) {
	var objAry = [];
	// checks each element of idAry[k] + "Enemy" against .name properties of each element of allChars[j] array
	// in order to populate the list of enemy objects, using two for-loops.
	jQuery.each(allChars, function(j){
		jQuery.each(idAry, function(k){
			if (idAry[k] === allChars[j].name) 
			 { objAry.push(allChars[j]); }	
		});							
	});
	return objAry;
}

// MAIN GAME FUNCTIONS

$(document).ready(function(){

	function startScreen(){
		// Declares local variables
		var selectedCharId = ""; // selectedCharId = the id of the clicked chararacter div
		var selectedCharObj; // selected character object with all its properties
		var enemyCharIdAry = []; // enemyCharIdAry is an array which consists of each .characters-div id not clicked
		var enemyCharObjAry = []; // an array of objects which will become the list of enemies

		// Populates the charSelectSpace with the menu of character div's upon startScreen() function call
		populateCharDivs();

		// Activates click event listener
		$(".characters-div").on("click", function(){
			
			// sets selectedCharId equal to the id of the .character-div clicked
			selectedCharId = $(this).attr("id"); 
			
			// gets the selectedCharObj according to the div id clicked (i.e. the player object)
			selectedCharObj = getPlayerObj(selectedCharId);

			// gets enemy character div id's
			enemyCharIdAry = getEnemyCharIds(selectedCharId);

			// gets enemy character objects according to the div id's of the enemies
			enemyCharObjAry = getEnemyCharObjs(enemyCharIdAry);	

			gameOn(selectedCharObj, enemyCharObjAry); // Calls game function, sends player and enemy objects.
			$("div.characters-div").off("click"); // removes click event listener for all characters div's.
		});
	}

	function gameOn(player, enemyAry){
		console.log("Player is:", player);
		jQuery.each(enemyAry, function(i){
			console.log("Enemy " + i + " is " + enemyAry[i].name);
		});

		// Move div's from #charSelectSpace to #yourCharSpace and #enemiesSpace

		// Add ".player" and ".enemy" CSS classes for styling

		// Activates event listener for selecting enemy

	}

	startScreen();
}); // end Document Ready

	// might not be necessary
	// var startScreenState = true;
	// var gameOnState = false;
	// var gameOverState = false;


	/*
	// events for error checking
	$(document).keypress(function(e){
		// press q any time to get character stats
		if(e.key === 'q'){
			console.log("redPlayer HP:", redPlayer.healthPoints, 
				"redPlayer AP:", redPlayer.attackPower, "redPlayer AP Increase:", redPlayer.apIncrease);
			console.log("redEnemy HP:", redEnemy.healthPoints, "redEnemy AP:", redEnemy.attackPower);
			console.log("bluePlayer HP:", bluePlayer.healthPoints, 
				"bluePlayer AP:", bluePlayer.attackPower, "bluePlayer AP Increase:", bluePlayer.apIncrease);
			console.log("blueEnemy HP:", blueEnemy.healthPoints, "blueEnemy AP:", blueEnemy.attackPower);
			console.log("yellowPlayer HP:", yellowPlayer.healthPoints, 
				"yellowPlayer AP:", yellowPlayer.attackPower, "yellowPlayer AP Increase:", yellowPlayer.apIncrease);
			console.log("yellowEnemy HP:", yellowEnemy.healthPoints, "yellowEnemy AP:", yellowEnemy.attackPower);
			console.log("greenPlayer HP:", greenPlayer.healthPoints, 
				"greenPlayer AP:", greenPlayer.attackPower, "greenPlayer AP Increase:", greenPlayer.apIncrease);
			console.log("greenEnemy HP:", greenEnemy.healthPoints, "greenEnemy AP:", greenEnemy.attackPower);
		}

		if(e.key ==='r'){
			redPlayer.healthPoints = blueEnemy.enemyAttack(redPlayer.healthPoints);
			blueEnemy.healthPoints = redPlayer.playerAttack(blueEnemy.healthPoints);
			console.log("blue enemy attack red player. red player attacks blue enemy");
			console.log("redPlayer HP:", redPlayer.healthPoints, 
				"redPlayer AP:", redPlayer.attackPower, "redPlayer AP Increase:", redPlayer.apIncrease);
			console.log("blueEnemy HP:", blueEnemy.healthPoints, "blueEnemy AP:", blueEnemy.attackPower);
		}

		if(e.key ==='t'){
			yellowPlayer.healthPoints = greenEnemy.enemyAttack(yellowPlayer.healthPoints);
			greenEnemy.healthPoints = yellowPlayer.playerAttack(greenEnemy.healthPoints);
			console.log("green enemy attack yellow player. yellow player attacks green enemy");
			console.log("yellowPlayer HP:", yellowPlayer.healthPoints, 
				"yellowPlayer AP:", yellowPlayer.attackPower, "yellowPlayer AP Increase:", yellowPlayer.apIncrease);
			console.log("greenEnemy HP:", greenEnemy.healthPoints, "greenEnemy AP:", greenEnemy.attackPower);
		}

		if(e.key ==='y'){
			bluePlayer.healthPoints = yellowEnemy.enemyAttack(bluePlayer.healthPoints);
			yellowEnemy.healthPoints = bluePlayer.playerAttack(yellowEnemy.healthPoints);
			console.log("yellow enemy attack blue player. blue player attacks yellow enemy");
			console.log("bluePlayer HP:", bluePlayer.healthPoints, 
				"bluePlayer AP:", bluePlayer.attackPower, "bluePlayer AP Increase:", bluePlayer.apIncrease);
			console.log("yellowEnemy HP:", yellowEnemy.healthPoints, "yellowEnemy AP:", yellowEnemy.attackPower);
		}
		if(e.key ==='u'){
			greenPlayer.healthPoints = redEnemy.enemyAttack(greenPlayer.healthPoints);
			redEnemy.healthPoints = greenPlayer.playerAttack(redEnemy.healthPoints);
			console.log("red enemy attack green player. green player attacks red enemy");
			console.log("greenPlayer HP:", greenPlayer.healthPoints, 
				"greenPlayer AP:", greenPlayer.attackPower, "greenPlayer AP Increase:", greenPlayer.apIncrease);
			console.log("redEnemy HP:", redEnemy.healthPoints, "redEnemy AP:", redEnemy.attackPower);
		}
	});  */




