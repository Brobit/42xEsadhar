import GUI from 'lil-gui';

export default class Debug
{
	constructor()
	{
		this.active = window.location.hash === '#debug';

		if (this.active)
		{
			this.ui = new GUI({
				name : 'debugger / tester for the project',
				closeFolders : true
			});
		}
	}
}
