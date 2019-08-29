/********************************************************
Copyright (c) <2019> <copyright ErosZy>

"Anti 996" License Version 1.0 (Draft)

Permission is hereby granted to any individual or legal entity
obtaining a copy of this licensed work (including the source code,
documentation and/or related items, hereinafter collectively referred
to as the "licensed work"), free of charge, to deal with the licensed
work for any purpose, including without limitation, the rights to use,
reproduce, modify, prepare derivative works of, distribute, publish
and sublicense the licensed work, subject to the following conditions:

1. The individual or the legal entity must conspicuously display,
without modification, this License and the notice on each redistributed
or derivative copy of the Licensed Work.

2. The individual or the legal entity must strictly comply with all
applicable laws, regulations, rules and standards of the jurisdiction
relating to labor and employment where the individual is physically
located or where the individual was born or naturalized; or where the
legal entity is registered or is operating (whichever is stricter). In
case that the jurisdiction has no such laws, regulations, rules and
standards or its laws, regulations, rules and standards are
unenforceable, the individual or the legal entity are required to
comply with Core International Labor Standards.

3. The individual or the legal entity shall not induce, suggest or force
its employee(s), whether full-time or part-time, or its independent
contractor(s), in any methods, to agree in oral or written form, to
directly or indirectly restrict, weaken or relinquish his or her
rights or remedies under such laws, regulations, rules and standards
relating to labor and employment as mentioned above, no matter whether
such written or oral agreements are enforceable under the laws of the
said jurisdiction, nor shall such individual or the legal entity
limit, in any methods, the rights of its employee(s) or independent
contractor(s) from reporting or complaining to the copyright holder or
relevant authorities monitoring the compliance of the license about
its violation(s) of the said license.

THE LICENSED WORK IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN ANY WAY CONNECTION WITH THE
LICENSED WORK OR THE USE OR OTHER DEALINGS IN THE LICENSED WORK.
*********************************************************/

const raf = callback => {
  return setTimeout(callback, 1000 / 60);
};

raf.cancel = handler => {
  clearTimeout(handler);
};

class Ticker {
  constructor() {
    this.interval = 1000 / 60;
    this.timestamp = 0;
    this.callbacks = [];
    this.handler = raf(this._tick.bind(this));
  }

  setFps(fps) {
    this.interval = 1000 / fps;
  }

  add(func) {
    this.callbacks.push(func);
  }

  remove(func) {
    for (let i = this.callbacks.length - 1; i >= 0; i--) {
      if (this.callbacks[i] == func) {
        this.callbacks.splice(i, 1);
      }
    }
  }

  destroy() {
    raf.cancel(this.handler);
    this.handler = null;
    this.callbacks = [];
  }

  _tick() {
    let loop = 1;
    const now = this._now();
    if (!this.timestamp) {
      this.timestamp = now;
      loop = Math.floor((now - this.timestamp) / this.interval);
    }

    const diff = now - this.timestamp;
    if (diff >= this.interval) {
      for (let i = 0; i < this.callbacks.length; i++) {
        for (let j = 0; j < loop; j++) {
          this.callbacks[i](now - this.timestamp);
        }
      }
      this.timestamp = now;
    }

    this.handler = raf(this._tick.bind(this));
  }

  _now() {
    if (window.performance && window.performance.now) {
      return window.performance.now();
    }
    return +new Date();
  }
}

export default Ticker;
