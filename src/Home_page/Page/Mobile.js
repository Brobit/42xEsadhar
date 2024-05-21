export default class Mobile
{
	constructor()
	{
		this.body = document.body;
		
		this.checkOrientation();

		this.createContainer();
		this.createTitle();
		this.createMenu();
		this.createPlayButton();
		this.createTutorialButton();
		this.createCreditButton();
	}

	checkOrientation()
	{
		window.addEventListener("orientationchange", () => {
			if (window.screen.orientation.type.includes("landscape"))
			{
				let divLandscapeOrientation = document.createElement("div");
				divLandscapeOrientation.classList.add("webgl", "landscape_mode");
				divLandscapeOrientation.id = "divLandscapeOrientation";
				document.body.appendChild(divLandscapeOrientation);
				let textDiv = document.createElement("div");
				textDiv.classList.add("webgl", "landscape_text");
				textDiv.textContent = "Pour jouer, mettez le téléphone en mode portrait";
				divLandscapeOrientation.appendChild(textDiv);
			}
			else if (window.screen.orientation.type.includes("portrait"))
			{
				if (document.body.contains(divLandscapeOrientation))
					document.body.removeChild(divLandscapeOrientation);
			}
		});
	}

	createContainer()
	{
		this.container = document.createElement("div");
		this.container.classList.add("webgl", "container");
		this.body.appendChild(this.container);
	}

	createTitle()
	{
		this.title = document.createElement("div");
		this.title.classList.add("webgl", "title");
		this.titleImage = document.createElement("img");
		this.titleImage.classList.add("webgl", "title_image");
		this.titleImage.src = "/game_title.gif";
		this.title.appendChild(this.titleImage);
		this.container.appendChild(this.title);
	}

	createMenu()
	{
		this.menu = document.createElement("div");
		this.menu.classList.add("webgl", "menu");
		this.container.appendChild(this.menu);
	}

	createPlayButton()
	{
		this.playButton = document.createElement("div");
		this.playButton.classList.add("webgl", "text_button", "play_button_mobile");
		this.menu.appendChild(this.playButton);
		this.playText = document.createElement("a");
		this.playText.textContent = "Jouer";
		this.playText.classList.add("link");
		this.playText.href = "./Game/game.html";
		this.playButton.appendChild(this.playText);
	}

	createTutorialButton()
	{
		this.tutorialButton = document.createElement("div");
		this.tutorialButton.classList.add("webgl", "text_button");
		this.tutorialButton.textContent = "Tutoriel";
		this.menu.appendChild(this.tutorialButton);
		this.tutorialInteraction();
	}

	createCreditButton()
	{
		this.creditButton = document.createElement("div");
		this.creditButton.classList.add("webgl", "text_button", "credit_button_mobile");
		this.creditButton.textContent = "Crédits";
		this.menu.appendChild(this.creditButton);
		this.creditInteraction();
	}

	tutorialInteraction()
	{
		this.tutorialButton.addEventListener("click", () => {
			this.createTutorialPopUp();
		});
	}

	creditInteraction()
	{
		this.creditButton.addEventListener("click", () => {
			this.createCreditPopUp();
		});
	}

	createTutorialPopUp()
	{
		if (this.body.contains(this.tutorialPopUp))
			return;
		this.tutorialPopUp = document.createElement("div");
		// this.tutorialPopUp.classList.add("webgl", "popUpContainer_mobile");
		this.tutorialPopUp.classList.add("webgl", "parent2");
		this.body.appendChild(this.tutorialPopUp);
		this.createTutorialContent(this.tutorialPopUp);
		this.createCloseCross(this.tutorialPopUp);
	}

	createCreditPopUp()
	{
		if (this.body.contains(this.creditPopUp))
			return;
		this.creditPopUp = document.createElement("div");
		// this.creditPopUp.classList.add("webgl", "popUpContainer_mobile");
		this.creditPopUp.classList.add("webgl", "parent2");
		this.body.appendChild(this.creditPopUp);
		this.createCreditContent(this.creditPopUp);
		this.createCloseCross(this.creditPopUp);
	}

	createCloseCross(div)
	{
		this.tutorialCross = document.createElement("div");
		// this.tutorialCross.classList.add("webgl", "close_mobile");
		this.tutorialCross.classList.add("webgl", "parent2", "div_pop_up", "closev2");
		div.appendChild(this.tutorialCross);
		this.tutorialCross.addEventListener("click", () => {
			this.body.removeChild(div);
		});
	}

	createTutorialContent(div)
	{
		this.imgTutorial = document.createElement("div");
		this.imgTutorial.classList.add("webgl", "parent2", "div_pop_up", "img_tutorial_mobile");
		// this.imgTutorial.classList.add("webgl", "img_tutorial");
		div.appendChild(this.imgTutorial);

		// this.joystickLeftText = document.createElement("div");
		// this.joystickLeftText.classList.add("webgl", "tutorial_text", "text_joystick_left");
		// this.joystickLeftText.textContent = "Joystick de gauche : Sert à se déplacer dans toutes les directions.";
		// div.appendChild(this.joystickLeftText);
		//
		// this.leftButton = document.createElement("div")
		// this.leftButton.classList.add("webgl", "tutorial_text", "text_button_left");
		// this.leftButton.textContent = "Bouton de gauche : Sert à changer la vue 3 ème personne en vu orbital.";
		// div.appendChild(this.leftButton);
		//
		// this.rightButton = document.createElement("div");
		// this.rightButton.classList.add("webgl", "tutorial_text", "text_button_right");
		// this.rightButton.textContent = "Bouton de droite : Sert à effectuer une courte accélération, permet de fixer un cube si il est toucher pendant l'accélération.";
		// div.appendChild(this.rightButton);
		//
		// this.joystickRightText = document.createElement("div");
		// this.joystickRightText.classList.add("webgl", "tutorial_text", "text_joystick_right");
		// this.joystickRightText.textContent = "Joystick de droite : Sert à monter/descendre d'un niveau ou à faire une rotation d'un quart de tour vers la gauche/droite."
		// div.appendChild(this.joystickRightText);
	}

	createCreditContent(div)
	{
		// create credit title
		this.creditTitle = document.createElement("div");
		this.creditTitle.classList.add("webgl", "parent2", "div_pop_up", "img_credit_mobile");
		// this.creditTitle.classList.add("webgl", "credit_text", "credit_title");
		// this.creditTitle.textContent = "Crédits";
		div.appendChild(this.creditTitle);

		// create artist role
		// this.artistRole = document.createElement("div");
		// this.artistRole.classList.add("webgl", "credit_text", "artist_role");
		// this.artistRole.textContent = "3D artist - UI/UX designer";
		// div.appendChild(this.artistRole);

		// create name + link to the email
		// this.artistNameOne = document.createElement("div");
		// this.artistNameOne.classList.add("webgl", "credit_text", "artist_name");
		// this.artistNameOne.textContent = "ZAFANE Louiza";
		// div.appendChild(this.artistNameOne);
		//
		// this.artistEmailOne = document.createElement("div");
		// this.artistEmailOne.classList.add("webgl", "credit_text", "contact");
		//
		// this.emailLinkOne = document.createElement("a");
		// this.emailLinkOne.classList.add("webgl", "email_container");
		// this.emailLinkOne.href = "mailto:louiza.zafane@esadhar.fr";
		// this.emailLinkOne.target = "_blank";
		// this.emailIconOne = document.createElement("img");
		// this.emailIconOne.classList.add("webgl", "email_icon");
		// this.emailIconOne.src = "/lettre.png";
		// this.emailLinkOne.appendChild(this.emailIconOne);
		// this.artistEmailOne.appendChild(this.emailLinkOne);
		// div.appendChild(this.artistEmailOne);
		//
		// this.artistNameTwo = document.createElement("div");
		// this.artistNameTwo.classList.add("webgl", "credit_text", "artist_name");
		// this.artistNameTwo.textContent = "ROBINOT Emile";
		// div.appendChild(this.artistNameTwo);
		//
		// this.artistEmailTwo = document.createElement("div");
		// this.artistEmailTwo.classList.add("webgl", "credit_text", "contact");
		//
		// this.emailLinkTwo = document.createElement("a");
		// this.emailLinkTwo.classList.add("webgl", "email_container");
		// this.emailLinkTwo.href = "mailto:emile.robinot@esadhar.fr";
		// this.emailLinkTwo.target = "_blank";
		// this.emailIconTwo = document.createElement("img");
		// this.emailIconTwo.classList.add("webgl", "email_icon");
		// this.emailIconTwo.src = "/lettre.png";
		// this.emailLinkTwo.appendChild(this.emailIconTwo);
		// this.artistEmailTwo.appendChild(this.emailLinkTwo);
		// div.appendChild(this.artistEmailTwo);

		// create dev role
		// this.devRole = document.createElement("div");
		// this.devRole.classList.add("webgl", "credit_text", "dev_role");
		// this.devRole.textContent = "Développeur";
		// div.appendChild(this.devRole);

		// create the name + all the link
		// this.devName = document.createElement("div");
		// this.devName.classList.add("webgl", "credit_text", "dev_name");
		// this.devName.textContent = "MARICOURT Alann";
		// div.appendChild(this.devName);
		//
		// this.contactDev = document.createElement("div");
		// this.contactDev.classList.add("webgl", "credit_text", "contact");
		// 
		// this.devEmail = document.createElement("a");
		// this.devEmail.classList.add("webgl", "logo");
		// this.devEmail.href = "mailto:contactme@alann.coffee";
		// this.devEmail.target = "_blank";
		// this.emailIconThree = document.createElement("img");
		// this.emailIconThree.classList.add("webgl", "email_dev");
		// this.emailIconThree.src = "/lettre.png";
		// this.devEmail.appendChild(this.emailIconThree);
		// this.contactDev.appendChild(this.devEmail);
		//
		// this.devGit = document.createElement("a");
		// this.devGit.classList.add("webgl", "logo");
		// this.devGit.href = "https://github.com/Brobit";
		// this.devGit.target = "_blank";
		// this.gitIcon = document.createElement("img");
		// this.gitIcon.classList.add("webgl", "github")
		// this.gitIcon.src = "/github-mark-white.png";
		// this.devGit.appendChild(this.gitIcon);
		// this.contactDev.appendChild(this.devGit);
		//
		// this.devLinkedin = document.createElement("a");
		// this.devLinkedin.classList.add("webgl", "logo");
		// this.devLinkedin.href = "https://www.linkedin.com/in/alann-maricourt-developpeur-c-javascript-freelance";
		// this.devLinkedin.target = "_blank";
		// this.linkedinIcon = document.createElement("img");
		// this.linkedinIcon.classList.add("webgl", "linkedin_icon");
		// this.linkedinIcon.src = "/LI-In-Bug.png";
		// this.devLinkedin.appendChild(this.linkedinIcon);
		// this.contactDev.appendChild(this.devLinkedin);
		//
		// div.appendChild(this.contactDev);

		// github - linkedin - email 
	}
}
