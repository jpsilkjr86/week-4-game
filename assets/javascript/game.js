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
		-Each character has two objects: one as player, one as enemey
		-All player objects are instances of playerObjectType() object constructor
			Example Object = {
				attackPower: value, // (initial value)
				healthPoints: value, // (initial value)
				playerAttack method (enemyHP) {  // should use prototype approach to declare this method
					enemyHP -= this.attackPower;  
					this.attackPower += [value to increment];  // player's attack value increases each time
					return enemyHP
				}
			}
		-All enemy objects are instances of enemyObjectType() object constructor
			Example Object = {
				attackPower: value, // (initial value)
				healthPoints: value, // (initial value)
				enemyAttack method (playerHP) {  // should use prototype approach to declare this method
					playerHP -= this.attackPower;  // 
					return playerHP
				}
			}
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

// object constructor for player characters
function playerObj (nm, ap, hp, apIncr){
	this.name = nm;
	this.attackPower = ap;
	this.healthPoints = hp;
	this.apIncrease = apIncr;  // amount of attack power that increases each time the player attacks
}

// add method to playerObj called playerAttack() which takes enemyHP argument
playerObj.prototype.playerAttack = function(enemyHP){
	enemyHP -= this.attackPower;  
	this.attackPower += this.apIncrease;  // player's attack value increases each time
	return enemyHP;
}

// object constructor for enemy characters
function enemyObj (nm, ap, hp){
	this.name = nm;
	this.attackPower = ap;
	this.healthPoints = hp;
}

// add method to enemyObj called enemyAttack() which takes playerHP argument
enemyObj.prototype.enemyAttack = function(playerHP){
	playerHP -= this.attackPower;  // enemy's attack power is a constant
	return playerHP;
}

// Global object declarations, as new instances of each object type. These are essentially a library of 
// available players and objects, which will ultimately be determined when user chooses his/her player
// character.

var allPlayerChars = [];
var allEnemyChars = [];

var redPlayer = new playerObj("redPlayer", 10, 100, 8);
var redEnemy = new enemyObj("redEnemy", 20, 100);
var bluePlayer = new playerObj("bluePlayer", 15, 90, 5);
var blueEnemy = new enemyObj("blueEnemy", 25, 90);
var yellowPlayer = new playerObj("yellowPlayer", 50, 1000, 1);
var yellowEnemy = new enemyObj("yellowEnemy", 100, 1000);
var greenPlayer = new playerObj("greenPlayer", 1, 30, 20);
var greenEnemy = new enemyObj("greenEnemy", 2, 30);

// push objects onto an array
allPlayerChars.push(redPlayer); 		allEnemyChars.push(redEnemy); 
allPlayerChars.push(bluePlayer); 		allEnemyChars.push(blueEnemy); 
allPlayerChars.push(yellowPlayer); 		allEnemyChars.push(yellowEnemy);
allPlayerChars.push(greenPlayer); 		allEnemyChars.push(greenEnemy);

var charIdMenu = ["red", "blue", "yellow", "green"]; // correspond to div id's

$(document).ready(function(){

	function startScreen(){
		// Declares local variables
		var selectedCharId = ""; // selectedCharId = the id of the clicked chararacter div
		var enemyCharIdAry = []; // enemyCharIdAry is an array which consists of each .characters-div id not clicked
		var selectedCharObj; // selected character object with all its properties
		var enemyCharObjAry = []; // an array of objects which will become the list of enemies

		// Populates the charSelectSpace with the menu of characters upon startScreen() function call
		jQuery.each(charIdMenu, function(i){
			$("#charSelectSpace").append('<div id="' + charIdMenu[i] + '" class="characters-div"></div>');
		});

		// click event listener activated
		$(".characters-div").on("click", function(){
			
			selectedCharId = $(this).attr("id"); // sets selectedCharId equal to the id of the .character-div clicked

			// Uses selectedCharId to get the correct playerObj from the allPlayerChars array according to allPlayerChars[i].name, 
			// and sets the matching object element equal to selectedCharObj.
			jQuery.each(allPlayerChars, function(i){
				if (selectedCharId + "Player" === allPlayerChars[i].name)
				{ selectedCharObj = allPlayerChars[i]; }				
			});	

			// loop pushes each id != selectedCharId into enemyCharIdAry, thus determining the div id's of the enemies
			$(".characters-div[id!=" + selectedCharId + "]").each(function(){
				var enemyCharId = $(this).attr("id");
				enemyCharIdAry.push(enemyCharId);
			});

			// checks each enemyCharIdAry[k] + "Enemy" against each allEnemyChars[j].name in order
			// to populate the list of enemy objects (enemyCharObjAry), using two for-loops.
			jQuery.each(allEnemyChars, function(j){
				jQuery.each(enemyCharIdAry, function(k){
					if (enemyCharIdAry[k] + "Enemy" === allEnemyChars[j].name) 
					 { enemyCharObjAry.push(allEnemyChars[j]); }	
				});							
			});	

			gameOn(selectedCharObj, enemyCharObjAry); // Calls game function, sends player and enemy objects.
			$("div.characters-div").off("click"); // removes click event listener for all characters div's.
		});
	}

	function gameOn(player, enemyAry){
		console.log("Player is:", player);
		jQuery.each(enemyAry, function(i){
			console.log("Enemy " + i + " is " + enemyAry[i].name);
		});		
	}

	startScreen();
});

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




