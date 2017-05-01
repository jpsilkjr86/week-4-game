// ********************************************* PSEUDO-CODE *********************************************
/*
	Steps:
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
			i) display game over, and clickable button which can restart the game
			ii) when button is clicked, clear all values (or refresh page?)
			ii) return to initial state







*/