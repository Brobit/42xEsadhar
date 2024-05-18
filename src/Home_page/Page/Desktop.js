export default class Desktop
{
	constructor()
	{
		this.body = document.body;
		
		this.createContainer();
		this.createTitle();
		this.createMenu();
		this.createTutorialButton();
		this.createPlayButton();
		this.createCreditButton();
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
		this.title.classList.add("webgl", "title_desktop");
		this.titleImage = document.createElement("img");
		this.titleImage.classList.add("webgl", "title_image_desktop");
		this.titleImage.src = "./game_title.gif";
		this.title.appendChild(this.titleImage);
		// this.title.textContent = "Pixel";
		this.container.appendChild(this.title);
	}

	createMenu()
	{
		this.menu = document.createElement("div");
		this.menu.classList.add("webgl", "menu_desktop");
		this.container.appendChild(this.menu);
	}

	createTutorialButton()
	{
		this.tutorialButton = document.createElement("div");
		this.tutorialButton.classList.add("webgl", "text_button", "tuto_button");
		this.tutorialButton.textContent = "Tutoriel";
		this.menu.appendChild(this.tutorialButton);
		this.tutorialInteraction();
	}

	createPlayButton()
	{
		this.playButton = document.createElement("div");
		this.playButton.classList.add("webgl", "text_button", "play_button");
		this.menu.appendChild(this.playButton);
		this.playText = document.createElement("a");
		this.playText.textContent = "Jouer";
		this.playText.classList.add("link");
		this.playText.href = "../../Game/game.html";
		this.playButton.appendChild(this.playText);
	}

	createCreditButton()
	{
		this.creditButton = document.createElement("div");
		this.creditButton.classList.add("webgl", "text_button", "credit_button");
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
		this.tutorialPopUp.classList.add("webgl", "popUpContainer");
		this.body.appendChild(this.tutorialPopUp);
		this.createTutorialContent(this.tutorialPopUp);
		this.createCloseCross(this.tutorialPopUp);
	}

	createCreditPopUp()
	{
		if (this.body.contains(this.creditPopUp))
			return;
		this.creditPopUp = document.createElement("div");
		this.creditPopUp.classList.add("webgl", "popUpContainer");
		this.body.appendChild(this.creditPopUp);
		this.createCreditContent(this.creditPopUp);
		this.createCloseCross(this.creditPopUp);
	}

	createCloseCross(div)
	{
		this.tutorialCross = document.createElement("div");
		this.tutorialCross.classList.add("webgl", "close");
		div.appendChild(this.tutorialCross);
		this.tutorialCross.addEventListener("click", () => {
			this.body.removeChild(div);
		});
	}

	createTutorialContent(div)
	{
		this.imgTutorial = document.createElement("div");
		this.imgTutorial.classList.add("webgl", "img_tutorial_desktop");
		div.appendChild(this.imgTutorial);

		this.gridContainer = document.createElement("div");
		this.gridContainer.classList.add("webgl", "grid_container");

		this.joystickLeftText = document.createElement("div");
		this.joystickLeftText.classList.add("webgl", "tutorial_text", "tutorial_text_desktop");
		this.joystickLeftText.textContent = "Joystick de gauche : Sert à se déplacer dans toutes les directions.";
		this.gridContainer.appendChild(this.joystickLeftText);

		this.leftButton = document.createElement("div")
		this.leftButton.classList.add("webgl", "tutorial_text", "tutorial_text_desktop");
		this.leftButton.textContent = "Bouton de gauche : Sert à changer la vue 3 ème personne en vu orbital.";
		this.gridContainer.appendChild(this.leftButton);

		this.rightButton = document.createElement("div");
		this.rightButton.classList.add("webgl", "tutorial_text", "tutorial_text_desktop");
		this.rightButton.textContent = "Bouton de droite : Sert à effectuer une courte accélération, permet de fixer un cube si il est toucher pendant l'accélération.";
		this.gridContainer.appendChild(this.rightButton);

		this.joystickRightText = document.createElement("div");
		this.joystickRightText.classList.add("webgl", "tutorial_text", "tutorial_text_desktop");
		this.joystickRightText.textContent = "Joystick de droite : Sert à monter/descendre d'un niveau ou à faire une rotation d'un quart de tour vers la gauche/droite."
		this.gridContainer.appendChild(this.joystickRightText);

		div.appendChild(this.gridContainer);
	}

	createCreditContent(div)
	{
		this.parent = document.createElement("div");
		this.parent.classList.add("webgl", "parent");

		// this.div1 = document.createElement("div");
		// this.div1.classList.add("webgl", "parent", "div1");
		
		// create credit title
		this.creditTitle = document.createElement("div");
		this.creditTitle.classList.add("webgl", "credit_text", "credit_title_desktop", "parent", "div1");
		this.creditTitle.textContent = "Crédits";
		// this.div1.appendChild(this.creditTitle);

		
		// this.div2 = document.createElement("div");
		// this.div2.classList.add("webgl", "parent", "div2");

		// create artist role
		this.artistRole = document.createElement("div");
		this.artistRole.classList.add("webgl", "credit_text", "artist_role_desktop", "parent", "div2");
		this.artistRole.textContent = "3D artist - UI/UX designer";
		// this.div2.appendChild(this.artistRole);


		// this.div3 = document.createElement("div");
		// this.div3.classList.add("webgl", "parent", "div3");

		// create name + link to the email
		this.artistNameOne = document.createElement("div");
		this.artistNameOne.classList.add("webgl", "credit_text", "artist_name", "parent", "div3");
		this.artistNameOne.textContent = "ZAFANE Louiza";
		// this.div3.appendChild(this.artistNameOne);

		this.artistEmailOne = document.createElement("div");
		this.artistEmailOne.classList.add("webgl", "credit_text", "contact", "parent", "div3");

		this.emailLinkOne = document.createElement("a");
		this.emailLinkOne.classList.add("webgl", "email_container");
		this.emailLinkOne.href = "mailto:louiza.zafane@esadhar.fr";
		this.emailLinkOne.target = "_blank";
		this.emailIconOne = document.createElement("img");
		this.emailIconOne.classList.add("webgl", "email_icon_desktop");
		this.emailIconOne.src = "./lettre.png";
		this.emailLinkOne.appendChild(this.emailIconOne);
		this.artistEmailOne.appendChild(this.emailLinkOne);
		// this.div3.appendChild(this.artistEmailOne);


		// this.div4 = document.createElement("div");
		// this.div4.classList.add("webgl", "parent", "div4");

		// create name + link to the email
		this.artistNameTwo = document.createElement("div");
		this.artistNameTwo.classList.add("webgl", "credit_text", "artist_name", "parent", "div4");
		this.artistNameTwo.textContent = "ROBINOT Emile";
		// this.div4.appendChild(this.artistNameTwo);

		this.artistEmailTwo = document.createElement("div");
		this.artistEmailTwo.classList.add("webgl", "credit_text", "contact", "parent", "div4");

		this.emailLinkTwo = document.createElement("a");
		this.emailLinkTwo.classList.add("webgl", "email_container");
		this.emailLinkTwo.href = "mailto:emile.robinot@esadhar.fr";
		this.emailLinkTwo.target = "_blank";
		this.emailIconTwo = document.createElement("img");
		this.emailIconTwo.classList.add("webgl", "email_icon_desktop");
		this.emailIconTwo.src = "./lettre.png";
		this.emailLinkTwo.appendChild(this.emailIconTwo);
		this.artistEmailTwo.appendChild(this.emailLinkTwo);
		// this.div4.appendChild(this.artistEmailTwo);


		// this.div5 = document.createElement("div");
		// this.div5.classList.add("webgl", "parent", "div5");

		// create dev role
		this.devRole = document.createElement("div");
		this.devRole.classList.add("webgl", "credit_text", "dev_role_desktop", "parent", "div5");
		this.devRole.textContent = "Développeur";
		// this.div5.appendChild(this.devRole);


		// this.div6 = document.createElement("div");
		// this.div6.classList.add("webgl", "parent", "div6");

		// create the name + all the link
		this.devName = document.createElement("div");
		this.devName.classList.add("webgl", "credit_text", "dev_name", "parent", "div6");
		this.devName.textContent = "MARICOURT Alann";
		// this.div6.appendChild(this.devName);

		this.contactDev = document.createElement("div");
		this.contactDev.classList.add("webgl", "credit_text", "contact_desktop", "parent", "div6");
		
		this.devEmail = document.createElement("a");
		this.devEmail.classList.add("webgl", "logo_desktop");
		this.devEmail.href = "mailto:contactme@alann.coffee";
		this.devEmail.target = "_blank";
		this.emailIconThree = document.createElement("img");
		this.emailIconThree.classList.add("webgl", "email_dev_desktop");
		this.emailIconThree.src = "./lettre.png";
		this.devEmail.appendChild(this.emailIconThree);
		this.contactDev.appendChild(this.devEmail);

		this.devGit = document.createElement("a");
		this.devGit.classList.add("webgl", "logo_desktop");
		this.devGit.href = "https://github.com/Brobit";
		this.devGit.target = "_blank";
		this.gitIcon = document.createElement("img");
		this.gitIcon.classList.add("webgl", "github_desktop")
		this.gitIcon.src = "./github-mark-white.png";
		this.devGit.appendChild(this.gitIcon);
		this.contactDev.appendChild(this.devGit);

		this.devLinkedin = document.createElement("a");
		this.devLinkedin.classList.add("webgl", "logo_desktop");
		this.devLinkedin.href = "https://www.linkedin.com/in/alann-maricourt-developpeur-c-javascript-freelance";
		this.devLinkedin.target = "_blank";
		this.linkedinIcon = document.createElement("img");
		this.linkedinIcon.classList.add("webgl", "linkedin_icon_desktop");
		this.linkedinIcon.src = "./LI-In-Bug.png";
		this.devLinkedin.appendChild(this.linkedinIcon);
		this.contactDev.appendChild(this.devLinkedin);

		// this.div6.appendChild(this.contactDev);


		// this.parent.appendChild(this.div1);
		this.parent.appendChild(this.creditTitle);
		// this.parent.appendChild(this.div2);
		this.parent.appendChild(this.artistRole);
		// this.parent.appendChild(this.div3);
		this.parent.appendChild(this.artistNameOne);
		this.parent.appendChild(this.artistEmailOne);
		// this.parent.appendChild(this.div4);
		this.parent.appendChild(this.artistNameTwo);
		this.parent.appendChild(this.artistEmailTwo);
		// this.parent.appendChild(this.div5);
		this.parent.appendChild(this.devRole);
		// this.parent.appendChild(this.div6);
		this.parent.appendChild(this.devName);
		this.parent.appendChild(this.contactDev);
		div.appendChild(this.parent);
	}
}
