import Experience from "./Home_page/Experience/experience";
import Desktop from "./Home_page/Page/Desktop";
import Mobile from "./Home_page/Page/Mobile";

const experience = new Experience(document.querySelector('canvas.webgl'));

if (navigator.maxTouchPoints <= 1)
{
	const desktopVersion = new Desktop();
}
else if (navigator.maxTouchPoints > 1)
{
	const mobileVersion = new Mobile();
}
