let xp = 0;
let health = 100;
let gold = 50;
let currentWeaponIndex = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
/**84The value of the currentWeaponIndex variable corresponds to an index in the weapons 
 * array. The player starts with a "stick", since currentWeaponIndex starts at 0 and 
 * weapons[0] is the "stick" weapon. */
const weapons = [
    { name: 'stick', power: 5 },
    { name: 'dagger', power: 30 },
    { name: 'claw hammer', power: 50 },
    { name: 'sword', power: 100 }
  ];
const monsters = [
    {
        name: "slime",
        level: 2,
        health: 15
    },
    {
        name: "fanged beast",
        level: 8,
        health: 60
    },
    {
        name: "dragon",
        level: 20,
        health: 300
    }
];
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    /** Use escaping forward slashes to allow "Store" in the string */
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store."
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster."
  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, easterEgg],
    /** Use escaping single quotes to allow "Arg!" in the string */
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;"
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;"
  },
  {
    name: "easter egg",
    "button text": ["Left knob", "Right knob", "Go to town square?"],
    "button functions": [pickLeft, pickRight, goTown],
    text: 'On your way back, you find a hidden door that seems to lead to an underground celler. The door has one knob on the left and another on the right. You tell yourself "I better be careful which knob I choose, it might be a trap! On the other hand, there might be treasure inside." '
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

/**After a monster is defeated, the monster's stat box should no longer display. 
 * for the &#x2620; emoticon text to properly display on the page, use the innerHTML property
*/
function update(location) {
    monsterStats.style.display = 'none';
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerHTML = location.text;
}

function goTown() {
    update(locations[0]);
  }
  
  function goStore() {
    update(locations[1]);
  }
  
  function goCave() {
    update(locations[2]);
  }
  
  function buyHealth() {
    if (gold >= 10) {
      gold -= 10;
      health += 10;
      goldText.innerText = gold;
      healthText.innerText = health;
    } else {
      text.innerText = "You do not have enough gold to buy health.";
    }
  }
  
/**Once a player has the best weapon, they cannot buy another one.  */
function buyWeapon() {
  if (currentWeaponIndex < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeaponIndex++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeaponIndex].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}
/**Initially, monsterStats are hidden with CSS. On "Fight dragon" button click, display them 
 * using monsterStats.style.display */
function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = 'block';
  /**update the text for the current monster's name and health */
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth; 
}
/**Add innertext for the attack, and reduce player health according to monster's damage level. 
 * Subject to isMonsterHit(), reduce monsterHealth according to currentweapon damage and player xp. 
 * Update health, and call lose(), or defeatMonster(), or if ts the Dragon winGame().
 * Additional: 
 * Give monsters a dynamic attack value getMonsterAttackValue(monsters[fighting].level);
 */
function attack() {
  text.innerText = "The "+ monsters[fighting].name +" attacks.";
  text.innerText += " You attack it with your "+ weapons[currentWeaponIndex].name +".";
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeaponIndex].power + Math.floor(Math.random()* xp) + 1;
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    return lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2){
      winGame();
    } else {
      defeatMonster();
    }
  }
  /**On every attack, there should be a 10% chance that the player's weapon breaks. All but the 'stick' 
   * Add message while, removing the latest weapon using inventory.pop(), 
   * then update currentWeaponIndex. */
  if (Math.random() <= .1  && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeaponIndex--
  }
}

/**The attack of the monster will be based on the monster's level and the player's xp.
 * Use ternary operator that returns hit if hit is greater than 0, or returns 0 if it is not.
*/
function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0
}

/**isMonsterHit function for attack(), helps wonded player
 * Return the boolean result of the comparison Math.random() > .2. OR health < 20 */
function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}
  
function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

/**Add to gold and xp according to monsters level, then update the innerText and 
 * update to locations[4]*/
function defeatMonster() {
  gold += Math.floor((monsters[fighting].level * 6.7))
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4])
}
 /** update to locations[5] */
function lose() {
  update(locations[5]);
}

/** update to locations[6] */
function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeaponIndex = 0;
  inventory = ["stick"];
  xpText.innerText = xp;
  healthText.innerText = health;
  goldText.innerText = gold;
  goTown()
}

/**Random functions taking player to easteregg win or lose game */
function easterEgg() {
  update(locations[7]);
}

function pickLeft() {
  pick(2);
}

function pickRight() {
  pick(8);
}

/**Pick a guess function, push a random number between 0 and 10 to the end of the numbers array
 * Check if guess is in the numbers array using .includes() method, with wins 20 gold message if found.
 * else lose 10 health. Update gold or health and innerTexts.
 */
function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked a knob, and pulled on it................................ \n";
  /**for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }*/
  if (numbers.includes(guess)) {
    text.innerText += "Good choice! You manage to open the door, and go inside, there you find 50 gold!";
    gold += 50;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong one! A loose bolder suddenly falls from the entrance, and lands on your foot. You lose 20 health!";
    health -= 20;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}