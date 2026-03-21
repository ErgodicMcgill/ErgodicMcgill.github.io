class Monomial {
  constructor(a1, b1, s = 1) {
    // handle different constructor signatures
    if (Array.isArray(a1) && Array.isArray(b1)) {
      this.a = a1.slice(); // copy
      this.b = b1.slice();
      this.sign = s;
    } else {
      // single pair case
      this.a = [a1];
      this.b = [b1];
      this.sign = 1;
    }
  }

  Mult(n2) {
    let c = this.a.concat(n2.a);
    let d = this.b.concat(n2.b);
    let s = this.sign * n2.sign;

    return new Monomial(c, d, s);
  }

  toStr() {
    let s = "" + this.sign;
    for (let i = 0; i < this.a.length; i++) {
      s += "n_" + this.a[i] + this.b[i];
    }
    return s;
  }

  Print() {
    console.log(this.toStr());
  }

  latexFormat() {
   let s = "" + this.sign;
    for (let i = 0; i < this.a.length; i++) {
      s += "n_{" + this.a[i] + this.b[i] + "}";
    }
    return s;
  }
}