
class Animation {
	constructor(_parms, _function, _test) {
		this.func = _function;
		this.test = _test;
		this.parms = _parms;
		this.frame = 0;
	}

	run() {
		this.func(this);
		this.frame++;
	}

	shouldStop() {
		return (this.test(this));
	}
}
