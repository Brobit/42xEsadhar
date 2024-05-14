import Experience from "./Home_page/Experience/experience";
import Desktop from "./Home_page/Page/Desktop";
import Mobile from "./Home_page/Page/Mobile";

const experience = new Experience(document.querySelector('canvas.webgl'));

// if (navigator.maxTouchPoints <= 1)
// {
	// window.alert("desktop");
	// const desktopVersion = new Desktop();
// }
// else if (navigator.maxTouchPoints > 1)
// {
	// window.alert("mobile");
	const mobileVersion = new Mobile();
// }
